import { Router } from "express";
import { validate as isUuid } from "uuid";
import { db } from "@repo/common/config";
import { RequestWithUser } from "../types";
import { verifyAccessToken } from "../middleware/verifyToken";

const UserRouter = Router();

// Apply auth middleware to all routes in this router
UserRouter.use(verifyAccessToken);

// --- SEARCH USERS ---
UserRouter.get("/search", async (req, res) => {
  const { q } = req.query;
  
  if (!q || typeof q !== "string") {
    return res.status(400).json({ message: "Search query is required." });
  }

  try {
    const users = await db.user.findMany({
      where: {
        username: {
          contains: q,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
        first_name: true,
        last_name: true,
        profile_pic_url: true,
        last_login: true,
      },
    });

    return res.status(200).json({ data: users });
  } catch (error) {
    console.error("User search error:", error);
    return res.status(500).json({ message: "An error occurred while searching for users." });
  }
});

// --- GET USER PROFILE ---
UserRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: String(id) },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        profile_pic_url: true,
        email_verified: true,
        created_at: true,
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Fetch user error:", error);
    return res.status(500).json({ message: "An error occurred while fetching the user profile." });
  }
});

// --- UPDATE USER ---
UserRouter.put("/:id", async (req: RequestWithUser, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!isUuid(id)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  // Security: Prevent updating sensitive fields via this endpoint
  const restrictedFields = ["password_hash", "id", "email", "email_verified"];
  const containsRestricted = restrictedFields.some(field => field in updateData);

  if (containsRestricted) {
    return res.status(403).json({ 
      message: "You are not permitted to update sensitive account fields through this endpoint." 
    });
  }

  if (!req.user || req.user.id !== id) {
    return res.status(403).json({ message: "You are not authorized to update this profile." });
  }

  try {
    const updatedUser = await db.user.update({
      where: { id: String(id) },
      data: updateData,
    });
    
    return res.status(200).json({ 
      message: "Profile updated successfully.",
      data: updatedUser 
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to update profile data." });
  }
});

// --- GET USER PROJECTS ---
UserRouter.get("/:id/projects", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  try {
    const projects = await db.project.findMany({ 
        where: { owner_id: id } 
    });

    return res.status(200).json({ data: projects });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while fetching projects." });
  }
});

// --- DELETE USER ---
UserRouter.delete("/:id", async (req: RequestWithUser, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  if (!req.user || req.user.id !== id) {
    return res.status(403).json({ message: "You are not authorized to delete this account." });
  }

  try {
    await db.user.delete({ where: { id } });
    return res.status(200).json({ message: "User account successfully deleted." });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User account not found." });
    }
    return res.status(500).json({ message: "An error occurred while deleting the account." });
  }
});

export default UserRouter;