import { Router } from "express";
import { verifyAccessToken } from "../middleware/verifyToken";
import { db } from "@repo/common/config";
import { CreateProjectSchema, UUIDSchema } from "@repo/common/schema";
import { RequestWithUser } from "../types";
import { ProjectModel } from "@repo/mongodb/model";
import { UUID } from "@repo/common/types";
import { asyncHandler } from "../middleware/asyncHandler";
import { AppError } from "../utils/AppError";

const ProjectRouter = Router();

ProjectRouter.use(verifyAccessToken);

// fetch multiple project
ProjectRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);

    const skip = (page - 1) * limit;

    const [projects, totalProjects] = await Promise.all([
      db.project.findMany({
        skip: skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      db.project.count(),
    ]);

    return res.status(200).json({
      success: true,
      projects,
      meta: {
        total: totalProjects,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalProjects / limit),
      },
    });
  }),
);

// create project
ProjectRouter.post(
  "/",
  asyncHandler(async (req: RequestWithUser, res) => {
    const parsedData = CreateProjectSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: parsedData.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    const data = parsedData.data;
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("Unauthorized: user ID missing");
    }

    const createdPostgresProject = await db.project.create({
      data: { ...data, owner_id: userId },
    });

    try {
      await ProjectModel.create({
        project_id: createdPostgresProject.id as UUID,
        updatedBy: userId,
        strokes: [],
      });
    } catch (error) {
      console.log(error);
    }

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: createdPostgresProject,
      id: createdPostgresProject.id,
    });
  }),
);

// fetch project by id
ProjectRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const parsed = UUIDSchema.safeParse({ id });
    if (!parsed.success)
      throw new AppError("Invalid UUID format requested", 400);

    const projectId = parsed.data.id;

    const [projectMetadata, projectCanvasState] = await Promise.all([
      db.project.findUnique({
        where: { id: projectId },
      }),
      ProjectModel.findOne({ project_id: projectId }),
    ]);

    if (!projectMetadata)
      throw new AppError(`Project with ID ${projectId} not found`, 404);

    let newCanvasState;
    if (!projectCanvasState) {
      newCanvasState = await ProjectModel.create({
        project_id: projectMetadata.id as UUID,
        baseImageUrl: "",
        strokes: [],
        updatedBy: "System",
        lastUpdated: Date.now(),
      });
    }

    return res.status(200).json({
      message: "Project details retrieved successfully",
      project: projectMetadata,
      canvasState: projectCanvasState ?? newCanvasState,
    });
  }),
);

// TODO: update project
ProjectRouter.put("/:id", (req, res) => {
  return res.json({
    message: "update project",
  });
});

// delete project
ProjectRouter.delete(
  "/:id",
  asyncHandler(async (req: RequestWithUser, res) => {
    const id = req.params.id;
    const userId = req.user?.id;

    const validation = UUIDSchema.safeParse({ id });

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid or missing Project ID format.",
      });
    }

    const validatedId = validation.data.id;

    if (!userId) {
      throw new Error("Unauthorized. Missing user session profile token.");
    }

    const deletedProject = await db.project.delete({
      where: {
        id: validatedId,
        owner_id: userId,
      },
    });

    return res.status(200).json({
      message: "deleted project",
      id: deletedProject.id,
    });
  }),
);

// TODO: duplicate project
ProjectRouter.post("/:id/duplicate", (req, res) => {
  res.json({
    message: "Duplicate project",
  });
});

// TODO: check all versions of project
ProjectRouter.get("/:id/versions", (req, res) => {
  res.json({
    message: "See all versions",
  });
});

// TODO: restore a version of project
ProjectRouter.post("/:id/restore", (req, res) => {
  return res.json({
    message: "Restore specific version",
  });
});

// TODO: export the project
ProjectRouter.post("/:id/export", (req, res) => {
  return res.json({
    message: "Export image",
  });
});

// TODO: download the project
ProjectRouter.get("/:id/download", (req, res) => {
  return res.json({
    message: "Download project from here",
  });
});
export default ProjectRouter;
