import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  ForgetPasswordSchema,
  LoginSchema,
  RegisterSchema,
  VerifyEmailSchema,
} from "@repo/common/schema";
import { ACCESS_SECRET, REFRESH_SECRET } from "@repo/common/config";
import { prisma } from "@repo/database";
import { forgetPasswordToken, verifyRefreshToken } from "./middleware";
import { RequestForForgetPassword, RequestForVerifyEmail } from "./types";
import { generateVerificationCode, mailVerificationCode } from "./script";

const AuthRouter = Router();

const codes: Record<string, { code: number; expireIn: number }> = {};

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

AuthRouter.post("/forget-password", async (req, res) => {
  const parsedSchema = ForgetPasswordSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    return res.status(400).json({ msg: "Invalid inputs" });
  }

  const { email } = parsedSchema.data;

  const generatedCode = generateVerificationCode();
  try {
    await mailVerificationCode({ to: email }, generatedCode);

    codes[email] = {
      code: generatedCode,
      expireIn: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const secret = process.env.FORGET_PASSWORD_SECRET;
    if (!secret) {
      return res.status(500).json({ msg: "Internal error" });
    }

    const token = jwt.sign({ email }, secret, { expiresIn: "20m" });

    res.cookie("draw-app-reset-password", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({ msg: "Password reset request sent" });
  } catch (error) {
    console.error("Forget password error:", error);
    return res.status(500).json({ msg: "Internal error" });
  }
});

AuthRouter.post(
  "/reset-password",
  forgetPasswordToken,
  async (req: RequestForForgetPassword, res) => {
    const { newPass, code } = req.body;
    if (!code) {
      return res.json({
        msg: "Provide code",
      });
    }
    if (!newPass) {
      return res.json({
        msg: "Provid password",
      });
    }
    if (!req.user)
      return res.json({
        msg: "Not Authorized",
      });

    const email = req.user.email;

    if (!codes[email])
      return res.json({
        msg: "Not Autorized",
      });
    if (codes[email].code !== parseInt(code)) {
      console.log(codes[email]);
      return res.json({
        msg: "Invalide code",
      });
    }
    if (codes[email].expireIn < Date.now())
      return res.json({
        msg: "Code is Expired",
      });

    try {
      const salt = await bcrypt.genSalt(12);
      const password_hash = await bcrypt.hash(newPass, salt);
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          password_hash,
        },
      });
      delete codes[email];
      return res.json({
        msg: "Success password is changed",
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Internal Error",
      });
    }
  },
);

AuthRouter.use(verifyRefreshToken);

AuthRouter.post("/logout", (req, res) => {
  res.clearCookie("draw-cookie");
  return res.status(200).json({
    msg: "Logged out successfully",
  });
});

AuthRouter.post("/refresh-token", async (req: RequestForVerifyEmail, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!ACCESS_SECRET) {
      return res.status(500).json({ msg: "Internal Error" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    return res.status(200).json({ token, msg: "Access token refreshed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Error" });
  }
});

AuthRouter.use(verifyRefreshToken);

AuthRouter.post("/verify-email", async (req, res) => {
  const parsedSchema = VerifyEmailSchema.safeParse(req.body);

  if (!parsedSchema.success) {
    return res.status(400).json({ error: parsedSchema.error.message });
  }

  const { email, code } = parsedSchema.data;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // If no code provided, generate and send one
  if (!code) {
    const generatedCode = generateVerificationCode();

    try {
      await mailVerificationCode({ to: email }, generatedCode);

      codes[email] = {
        code: generatedCode,
        expireIn: Date.now() + 20 * 60 * 1000, // 20 minutes
      };

      return res.status(200).json({ msg: "Verification code sent" });
    } catch (error: any) {
      console.error("Mail error:", error.message);
      return res.status(500).json({ error: "Internal Error" });
    }
  }

  const record = codes[email];
  if (!record) return res.status(400).json({ error: "No code found" });
  if (Date.now() > record.expireIn)
    return res.status(400).json({ error: "Code expired" });
  if (Number(code) !== record.code)
    return res.status(400).json({ error: "Invalid code" });

  try {
    await prisma.user.update({
      where: { email },
      data: { email_verified: true },
    });
    delete codes[email];
    return res.json({ msg: "Email verified successfully!" });
  } catch (error: any) {
    console.error("DB error:", error.message);
    return res.status(500).json({ error: "Internal Error" });
  }
});

AuthRouter.post("/oauth/callback", (req, res) => {
  res.json({ msg: "callback" });
});

export default AuthRouter;
