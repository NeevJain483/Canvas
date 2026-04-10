import { Router } from "express";
import { validate as isUuid } from "uuid";

import { db } from "@repo/common/config";
import { RequestWithUser } from "../types";
import { verifyAccessToken, verifyRefreshToken } from "../middleware";

const UserRouter = Router();

UserRouter.use(verifyRefreshToken);
UserRouter.use(verifyAccessToken);

UserRouter.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q || typeof q !== "string") {
    return res
      .status(400)
      .json({ success: false, msg: "Missing search query" });
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
        last_login: true,
        profile_pic_url: true,
      },
    });

    return res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ msg: "Server error" });
  }
});

UserRouter.get("/:id", async (req: RequestWithUser, res) => {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(400).json({ msg: "Invalid UUID format." });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: req.user?.id },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
});

UserRouter.put("/:id", async (req: RequestWithUser, res) => {
  const { id } = req.params;
  const updateData = req.body;
  // TODO: add right fields
  if (updateData.password_hash) {
    return res.status(403).json({
      msg: "You are not allow to change password_hash field",
    });
  }

  if (!req.user || req.user.id !== id) {
    return res.status(403).json({ msg: "Unauthorized to update this user" });
  }

  try {
    const updatedUser = await db.user.update({
      where: { id: String(id) },
      data: updateData,
    });
    return res.status(200).json(updatedUser);
  } catch (error: any) {
    return res.status(500).json({ msg: error.message });
  }
});

// TODO: test this route after create project routes
UserRouter.get("/:id/projects", async (req, res) => {
  const { id } = req.params;
  try {
    const projects = await db.project.findMany({ where: { id } });
    return res.status(200).json({
      projects,
    });
  } catch (error) {
    return res.status(404).json({
      msg: "User does not exist",
    });
  }
});

// UserRouter.get("/:id/artworks", (req, res) => {
//   const { id } = req.params;
//   res.json(`User with id ${id} projects`);
// });

UserRouter.delete("/:id", async (req: RequestWithUser, res) => {
  const { id } = req.params;
  if (!req.user || req.user.id !== id)
    return res.status(403).json({
      msg: "Not Authorized",
    });
  try {
    await db.user.delete({ where: { id } });
    res.status(200).json({
      msg: "User is deleted",
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).json({ msg: "Server error" });
  }
});

// UserRouter.post("/:id/follow", (req, res) => {
//   const { id } = req.params;
//   res.json({
//     msg: "follow",
//   });
// });

// UserRouter.get("/:id/followers", (req, res) => {
//   const { id } = req.params;
//   res.json({
//     msg: "followers",
//   });
// });

export default UserRouter;
