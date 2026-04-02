import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { LoginSchema, RegisterSchema } from "@repo/common/schema";
import { ACCESS_SECRET, REFRESH_SECRET } from "@repo/common/config";
import { prisma } from "@repo/database";
const AuthRouter = Router();

AuthRouter.post("/register", async (req, res) => {
  const parsedSchema = RegisterSchema.safeParse(req.body);
  if (!parsedSchema.success)
    return res.status(400).json({
      msg: parsedSchema.error.message,
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
    // console.error("Register error:", err);
    if (err.code === "P2002") {
      return res.status(409).json({
        msg: "Email or username already exists",
      });
    }
    return res.status(500).json({
      msg: "Failed to register user",
    });
  }
});

AuthRouter.post("/login", async (req, res) => {
  const parsedSchema = LoginSchema.safeParse(req.body);
  if (!parsedSchema.success)
    return res.status(400).json({
      msg: parsedSchema.error.message,
    });
  const data = parsedSchema.data;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user)
      return res.status(404).json({
        msg: "Create Account first",
      });

    const success = await bcrypt.compare(data.password, user.password_hash);
    if (!success)
      return res.status(401).json({
        msg: "wrong password",
      });

    if (!ACCESS_SECRET || !REFRESH_SECRET)
      return res.status(500).json({
        msg: "Internal Error",
      });
      
    const access_token = jwt.sign(
      { username: user.username, id: user.id },
      ACCESS_SECRET,
      { expiresIn: "1h" },
    );
    const refresh_token = jwt.sign(
      { username: user.username, id: user.id },
      REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("draw-cookie", refresh_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      msg: "Login successful",
      token: access_token,
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Internal Error",
    });
  }
});

AuthRouter.post("/logout", (req, res) => {
  res.clearCookie("draw-cookie");
  return res.status(200).json({
    msg: "Logged out successfully",
  });
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
