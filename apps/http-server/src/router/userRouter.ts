import { Router } from "express";
import { db } from "@repo/common/config";
import { RequestWithUser } from "../types";
import { verifyAccessToken } from "../middleware/verifyToken";
import { asyncHandler } from "../middleware/asyncHandler";
import { AppError } from "../utils/AppError";
import { UUIDSchema } from "@repo/common/schema";
import { ProjectModel } from "@repo/mongodb/model";

const UserRouter = Router();

// Apply auth middleware to all routes in this router
UserRouter.use(verifyAccessToken);

// --- SEARCH USERS ---
UserRouter.get(
  "/search",
  asyncHandler(async (req: RequestWithUser, res) => {
    const { q } = req.query;

    if (!q || typeof q !== "string" || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "A valid, non-empty search query parameter 'q' is required.",
      });
    }

    const currentUserId = req.user?.id;
    const users = await db.user.findMany({
      where: {
        username: {
          contains: q.trim(),
          mode: "insensitive",
        },
        ...(currentUserId && {
          id: {
            not: currentUserId,
          },
        }),
      },
      select: {
        id: true,
        username: true,
        first_name: true,
        last_name: true,
        profile_pic_url: true,
      },
      take: 20,
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  }),
);

// --- GET USER PROFILE ---
UserRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const validatedResult = UUIDSchema.parse(id);

    const user = await db.user.findUnique({
      where: { id: validatedResult.id },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        profile_pic_url: true,
        email_verified: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new AppError(`User with ID ${validatedResult.id} not found.`, 404);
    }

    // 4. Return clean, predictable payload structure
    return res.status(200).json({
      success: true,
      data: user,
    });
  }),
);

// --- UPDATE USER ---
UserRouter.put(
  "/:id",
  asyncHandler(async (req: RequestWithUser, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const verifiedResult = UUIDSchema.parse({ id });

    const restrictedFields = ["password_hash", "id", "email", "email_verified"];
    const containsRestricted = restrictedFields.some(
      (field) => field in updateData,
    );

    if (containsRestricted) {
      throw new AppError(
        "You are not permitted to update sensitive account fields through this endpoint.",
        403,
      );
    }

    if (!req.user || req.user.id !== id) {
      throw new AppError("You are not authorized to update this profile.", 403);
    }
    // TODO: create UpdateUserSchema
    // const validatedData = UpdateUserSchema.parse(req.body);

    // if (Object.keys(validatedData).length === 0) {
    //   throw new AppError("Please provide at least one valid field to update.", 400);
    // }

    const updatedUser = await db.user.update({
      where: { id: verifiedResult.id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  }),
);

// --- GET USER PROJECTS ---
UserRouter.get(
  "/:id/projects",
  asyncHandler(async (req, res) => {
    const { id: paramId } = req.params;

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const validatedUserId = UUIDSchema.parse(paramId);

    const [projects, totalProjects, projectStats] = await Promise.all([
      db.project.findMany({
        skip,
        take: limit,
        where: { owner_id: validatedUserId.id },
        orderBy: { created_at: "desc" },
      }),
      db.project.count({
        where: { owner_id: validatedUserId.id },
      }),
      db.project.groupBy({
        where: { owner_id: validatedUserId.id },
        by: ["is_public"],
        _count: { is_public: true },
      }),
    ]);

    const publicCount =
      projectStats.find((item) => item.is_public === true)?._count.is_public ||
      0;
    const privateCount =
      projectStats.find((item) => item.is_public === false)?._count.is_public ||
      0;

    if (totalProjects === 0) {
      const userExists = await db.user.findUnique({
        where: { id: validatedUserId.id },
      });
      if (!userExists) {
        throw new AppError(
          `User with ID ${validatedUserId} does not exist.`,
          404,
        );
      }
    }
    return res.status(200).json({
      success: true,
      data: projects,
      meta: {
        total: totalProjects,
        page,
        limit,
        totalPages: Math.ceil(totalProjects / limit),
        publicCount,
        privateCount,
      },
    });
  }),
);

// --- DELETE USER ---
UserRouter.delete(
  "/:id",
  asyncHandler(async (req: RequestWithUser, res) => {
    const { id: paramsId } = req.params;
    const { id } = UUIDSchema.parse({ id: paramsId });
    const owner_id = UUIDSchema.parse({ id: req.user?.id });

    if (!req.user || owner_id.id !== id) {
      throw new AppError("You are not authorized to delete this account.", 403);
    }

    const userProjects = await db.project.findMany({
      where: { owner_id: id },
      select: { id: true },
    });
    const projectIds = userProjects.map((p) => p.id);

    if (projectIds.length > 0) {
      await ProjectModel.deleteMany({ project_id: { $in: projectIds as `${string}-${string}-${string}-${string}-${string}`[] } });
      await db.project.deleteMany({
        where: { owner_id: id },
      });
    }
    await db.user.delete({
      where: { id: id },
    });
    return res.status(200).json({
      success: true,
      message:
        "User account and all related project workspaces have been permanently purged.",
    });
  }),
);

export default UserRouter;
