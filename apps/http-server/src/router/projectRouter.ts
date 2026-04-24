import { Router } from "express";
import { verifyAccessToken } from "../middleware/verifyToken";
import { db } from "@repo/common/config";
import { CreateProjectSchema } from "@repo/common/schema";
import { RequestWithUser } from "../types";

const ProjectRouter = Router();

ProjectRouter.use(verifyAccessToken);

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
      data: projects,
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
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      message: "Internal server error while creating project",
    });
  }
});

ProjectRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  return res.json({
    message: "project with id",
    id,
  });
});

ProjectRouter.put("/:id", (req, res) => {
  return res.json({
    message: "update project",
  });
});

ProjectRouter.delete("/:id", (req, res) => {
  return res.json({
    message: "delete project",
  });
});

ProjectRouter.post("/:id/duplicate", (req, res) => {
  res.json({
    message: "Duplicate project",
  });
});

ProjectRouter.get("/:id/versions", (req, res) => {
  res.json({
    message: "See all versions",
  });
});

ProjectRouter.post("/:id/restore", (req, res) => {
  return res.json({
    message: "Restore specific version",
  });
});

ProjectRouter.post("/:id/export", (req, res) => {
  return res.json({
    message: "Export image",
  });
});

ProjectRouter.get("/:id/download", (req, res) => {
  return res.json({
    message: "Download project from here",
  });
});
export default ProjectRouter;
