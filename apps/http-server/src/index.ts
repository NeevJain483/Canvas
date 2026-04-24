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
  try {
    await db.user.findMany({});
    return res.json({
      message: "pong",
      database: "OK",
    });
  } catch (error) {
    return res.json({
      message: "database is not working",
      error: error,
    });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});
