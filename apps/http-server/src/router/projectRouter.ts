import { Router } from "express";
import { verifyAccessToken } from "../middleware/verifyToken";
import { db } from "@repo/common/config";
import { CreateProjectSchema, UUIDSchema } from "@repo/common/schema";
import { RequestWithUser } from "../types";

const ProjectRouter = Router();

type UUID = `${string}-${string}-${string}-${string}-${string}`;

ProjectRouter.use(verifyAccessToken);

// fetch multiple project
ProjectRouter.get("/", async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  if (!page || !limit)
    return res.json({
      message: "Provide complete information",
    });
  try {
    const skip = (page - 1) * limit;

    const projects = await db.project.findMany({
      skip: skip,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    const totalProjects = await db.project.count();

    return res.json({
      projects,
      meta: {
        total: totalProjects,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalProjects / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching projects" });
  }
});

// create project
ProjectRouter.post("/", async (req: RequestWithUser, res) => {
  const parsedData = CreateProjectSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid request data",
      errors: parsedData.error,
    });
  }

  const data = parsedData.data;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized: user ID missing",
    });
  }

  try {
    const project = await db.project.create({
      data: { ...data, owner_id: userId },
    });

    return res.status(201).json({
      message: "Project created successfully",
      project,
      id: project.id,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      message: "Internal server error while creating project",
    });
  }
});

// fetch project by id
ProjectRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const verifiedData = UUIDSchema.parse({ id });
    const project = await db.project.findUnique({
      where: {
        id: verifiedData.id,
      },
    });
    return res.json({
      project,
    });
  } catch (error) {
    console.log(error);
  }
});

// TODO: update project
ProjectRouter.put("/:id", (req, res) => {
  return res.json({
    message: "update project",
  });
});

// delete project
ProjectRouter.delete("/:id", async (req: RequestWithUser, res) => {
  const id = req.params.id;

  const validation = UUIDSchema.safeParse({ id });

  if (!validation.success) {
    return res.status(400).json({
      message: "Invalid or missing Project ID format.",
    });
  }

  const validatedId = validation.data.id;

  if (!req.user?.id) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Missing user session profile token." });
  }

  try {
    const deletedProject = await db.project.delete({
      where: {
        id: validatedId,
        owner_id: req.user.id,
      },
    });

    return res.status(200).json({
      message: "deleted project",
      id: deletedProject.id,
    });
  } catch (error: any) {
    console.error("Error deleting project:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message:
          "Project not found or you do not have permission to delete it.",
      });
    }
    return res.status(500).json({
      message: "An internal server error occurred while deleting the project.",
    });
  }
});

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
