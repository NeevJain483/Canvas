import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  RegisterSchema,
  LoginSchema,
  ForgetPasswordSchema,
  VerifyEmailSchema,
} from "@repo/common/schema";
import { db } from "@repo/common/config";
import {
  forgetPasswordToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../middleware/verifyToken";
import { RequestForForgetPassword, RequestWithUser } from "../types";
import { generateVerificationCode, mailVerificationCode } from "../script";
import { asyncHandler } from "../middleware/asyncHandler";
import { formatUserResponse, generateTokensAndSetCookie } from "../utils/auth";
import { AppError } from "../utils/AppError";

const AuthRouter = Router();
const codes: Record<string, { code: number; expireIn: number }> = {};

// --- REGISTER ---
AuthRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError("Invalid registration data.", 400);

    const { username, email, password, first_name, last_name } = parsed.data;

    const existingUser = await db.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      throw new AppError(
        "An account with that email or username already exists.",
        409,
      );
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await db.user.create({
      data: { username, email, password_hash, first_name, last_name },
    });

    const { accessToken, refreshToken } = generateTokensAndSetCookie(res, user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: formatUserResponse(user),
      accessToken,
      refreshToken,
      expiresIn: 900,
    });
  }),
);

// --- LOGIN ---
AuthRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError("Invalid input format.", 400);

    const { email, password } = parsed.data;
    const user = await db.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new AppError("Invalid email or password.", 401);
    }

    const { accessToken, refreshToken } = generateTokensAndSetCookie(res, user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: formatUserResponse(user),
      accessToken,
      refreshToken,
      expiresIn: 900,
    });
  }),
);

// --- FORGET PASSWORD ---
AuthRouter.post(
  "/forget-password",
  asyncHandler(async (req, res) => {
    const parsed = ForgetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("A valid email address is required.", 400);
    }

    const { email } = parsed.data;
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Account not found", 404);

    const code = generateVerificationCode();
    await mailVerificationCode({ to: email }, code);

    codes[email] = { code, expireIn: Date.now() + 20 * 60 * 1000 };

    const secret = process.env.FORGET_PASSWORD_SECRET;
    if (!secret) {
      throw new AppError(
        "Internal Configuration Error: Missing Signature Secrets.",
        500,
      );
    }

    const token = jwt.sign({ email }, secret, { expiresIn: "20m" });

    res.cookie("draw-app-reset-password", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email.",
    });
  }),
);

// --- RESET PASSWORD ---
AuthRouter.post(
  "/reset-password",
  forgetPasswordToken,
  asyncHandler(async (req: RequestForForgetPassword, res) => {
    const { newPassword, code } = req.body;
    const email = req.user?.email;

    if (
      !email ||
      !codes[email] ||
      codes[email].code !== parseInt(code) ||
      codes[email].expireIn < Date.now()
    ) {
      throw new AppError("Invalid or expired verification code.", 400);
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await db.user.update({ where: { email }, data: { password_hash } });
    delete codes[email];

    return res.status(200).json({
      success: true,
      message: "Password successfully updated.",
    });
  }),
);

// --- VERIFY EMAIL ---
AuthRouter.post(
  "/verify-email",
  verifyAccessToken,
  asyncHandler(async (req, res) => {
    const parsed = VerifyEmailSchema.safeParse(req.body);
    if (!parsed.success)
      throw new AppError("Invalid email verification payload structure.", 400);

    const { email, code } = parsed.data;

    if (!code) {
      const generatedCode = generateVerificationCode();
      await mailVerificationCode({ to: email }, generatedCode);
      codes[email] = {
        code: generatedCode,
        expireIn: Date.now() + 20 * 60 * 1000,
      };
      return res
        .status(200)
        .json({ success: true, message: "Verification code sent." });
    }

    const record = codes[email];
    if (
      !record ||
      record.code !== Number(code) ||
      Date.now() > record.expireIn
    ) {
      throw new AppError("Invalid or expired code", 400);
    }

    await db.user.update({ where: { email }, data: { email_verified: true } });
    delete codes[email];

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  }),
);

// --- LOGOUT & REFRESH ---
AuthRouter.post("/logout", (req, res) => {
  res.clearCookie("draw-cookie");
  res.clearCookie("draw-app-reset-password");
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully." });
});

AuthRouter.post(
  "/refresh-token",
  verifyRefreshToken,
  asyncHandler(async (req: RequestWithUser, res) => {
    const userId = req.user?.id;
    if (!userId)
      throw new AppError("Unauthorized session profile context.", 401);

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    const { accessToken } = generateTokensAndSetCookie(res, user);
    return res.status(200).json({
      success: true,
      accessToken,
      expiresIn: 900,
      message: "Token refreshed.",
    });
  }),
);

export default AuthRouter;
