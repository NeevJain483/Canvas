import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import express from "express";

import AuthRouter from "./authRouter";
import { prisma } from "@repo/database";

const PORT = 4002;
const app = express();

app.use(express.json());

app.use("/api/v1/auth", AuthRouter);

app.get("/api/v1/ping", async (req, res) => {
  try {
    await prisma.user.findMany({});
    return res.json({
      msg: "pong",
      database: "OK",
    });
  } catch (error) {
    return res.json({
      msg: "database is not working",
      error: error,
    });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});
