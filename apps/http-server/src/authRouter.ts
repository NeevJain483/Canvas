import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { LoginSchema, RegisterSchema } from "@repo/common/schema";
import { JWT_SECRET } from "@repo/common/config";
import { prisma } from "@repo/database";
const AuthRouter = Router();

AuthRouter.post("/register", async (req, res) => {
  const parsedSchema = RegisterSchema.safeParse(req.body);
  if (!parsedSchema.success)
    return res.status(400).json({
      error: parsedSchema.error.message,
    });
  const inputData = parsedSchema.data;
  try {
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(inputData.password, salt);

    await prisma.user.create({
      data: {
        username: inputData.username,
        email: inputData.email,
        password_hash,
        first_name: inputData.first_name,
        last_name: inputData.last_name,
      },
    });

    return res.status(201).json({
      msg: "User is created",
    });
  } catch (err: any) {
    console.error("Register error:", err);
    if (err.code === "P2002") {
      return res.status(409).json({
        error: "Email or username already exists",
      });
    }
    return res.status(500).json({
      error: "Failed to register user",
    });
  }
});
AuthRouter.post("/login", async (req, res) => {
  const parsedSchema = LoginSchema.safeParse(req.body);
  if (!parsedSchema.success)
    return res.json({
      msg: parsedSchema.error.message,
    });
  const data = parsedSchema.data;
  try {
    // fatch password and username and email form database
    let pass = "";
    let username = "";

    const success = await bcrypt.compare(data.password, pass);
    if (!success)
      return res.json({
        msg: "wrong password",
      });

    // sign secret from env variable
    if (!JWT_SECRET)
      return res.json({
        msg: "Internal Error",
      });
    const token = jwt.sign(username, JWT_SECRET);
    return res.cookie("draw-cookie", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  } catch (error) {
    return res.json({
      error: error,
    });
  }
});
AuthRouter.post("/logout", (req, res) => {
  res.json({ msg: "logout" });
});
AuthRouter.post("/refresh-token", (req, res) => {
  res.json({ msg: "refresh-token" });
});
AuthRouter.post("/forget-password", (req, res) => {
  res.json({ msg: "forget-password" });
});
AuthRouter.post("/reset-password", (req, res) => {
  res.json({ msg: "reset-password" });
});
AuthRouter.get("/verify-email", (req, res) => {
  res.json({ msg: "verify-email" });
});
AuthRouter.post("/oauth/callback", (req, res) => {
  res.json({ msg: "callback" });
});

export default AuthRouter;
