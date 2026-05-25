import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import AuthRouter from "./router/authRouter";
import UserRouter from "./router/userRouter";

import { db, FRONTEND_URL } from "@repo/common/config";
import ProjectRouter from "./router/projectRouter";

import { ProjectModel,initailizeMongoDB } from "@repo/mongodb/model";

(async () => {
  await initailizeMongoDB();
})()

const PORT = 4002;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/projects", ProjectRouter);

app.get("/api/v1/ping", async (req, res) => {
  const status = {
    postgres: "Unknown",
    mongodb: "Unknown"
  };

  try {
    await db.user.findFirst({});
    status.postgres = "Healthy";
  } catch (error) {
    status.postgres = "Unhealthy";
    console.log(error)
  }

  try {
    await ProjectModel.findOne({});
    status.mongodb = "Healthy";
  } catch (error) {
    status.mongodb = "Unhealthy";
    console.log(error)
  }
  const isHealthy = status.postgres === "Healthy" && status.mongodb === "Healthy";
  const statusCode = isHealthy ? 200 : 500;

  return res.status(statusCode).json({
    success: isHealthy,
    message: isHealthy ? "All systems operational" : "One or more services are degraded",
    services: status
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});
