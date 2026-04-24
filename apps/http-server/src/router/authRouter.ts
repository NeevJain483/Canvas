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

const AuthRouter = Router();
const codes: Record<string, { code: number; expireIn: number }> = {};

// --- REGISTER ---
AuthRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Invalid registration data." });

    const { username, email, password, first_name, last_name } = parsed.data;

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    try {
      const user = await db.user.create({
        data: { username, email, password_hash, first_name, last_name },
      });

      const { accessToken, refreshToken } = generateTokensAndSetCookie(
        res,
        user,
      );

      return res.status(201).json({
        message: "Account created successfully.",
        user: formatUserResponse(user),
        accessToken,
        refreshToken,
        expiresIn: 900,
      });
    } catch (err: any) {
      if (err.code === "P2002")
        return res
          .status(409)
          .json({ message: "Username or email already exists." });
      throw err;
    }
  }),
);

// --- LOGIN ---
AuthRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Invalid input format." });

    const { email, password } = parsed.data;
    const user = await db.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const { accessToken, refreshToken } = generateTokensAndSetCookie(res, user);

    return res.status(200).json({
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
    if (!parsed.success)
      return res.status(400).json({ message: "Valid email is required." });

    const { email } = parsed.data;
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Account not found." });

    const code = generateVerificationCode();
    await mailVerificationCode({ to: email }, code);

    codes[email] = { code, expireIn: Date.now() + 20 * 60 * 1000 };

    const secret = process.env.FORGET_PASSWORD_SECRET;
    const token = jwt.sign({ email }, secret!, { expiresIn: "20m" });

    res.cookie("draw-app-reset-password", token, {
      httpOnly: true,
      sameSite: "strict",
    });
    return res
      .status(200)
      .json({ message: "Verification code sent to your email." });
  }),
);

// --- RESET PASSWORD ---
AuthRouter.post(
  "/reset-password",
  forgetPasswordToken,
  asyncHandler(async (req: RequestForForgetPassword, res) => {
    const { newPassword, code } = req.body;
    const email = req.user?.email;

    if (!email || !codes[email] || codes[email].code !== parseInt(code) || code[email].expireIn < Date.now()) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code." });
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await db.user.update({ where: { email }, data: { password_hash } });
    delete codes[email];

    return res.status(200).json({ message: "Password successfully updated." });
  }),
);

// --- VERIFY EMAIL ---
AuthRouter.post(
  "/verify-email",
  verifyAccessToken,
  asyncHandler(async (req, res) => {
    const { email, code } = VerifyEmailSchema.parse(req.body);

    if (!code) {
      const generatedCode = generateVerificationCode();
      await mailVerificationCode({ to: email }, generatedCode);
      codes[email] = {
        code: generatedCode,
        expireIn: Date.now() + 20 * 60 * 1000,
      };
      return res.status(200).json({ message: "Verification code sent." });
    }

    const record = codes[email];
    if (
      !record ||
      record.code !== Number(code) ||
      Date.now() > record.expireIn
    ) {
      return res.status(400).json({ message: "Invalid or expired code." });
    }

    await db.user.update({ where: { email }, data: { email_verified: true } });
    delete codes[email];
    return res.status(200).json({ message: "Email verified successfully." });
  }),
);

// --- LOGOUT & REFRESH ---
AuthRouter.post("/logout", (req, res) => {
  res.clearCookie("draw-cookie");
  return res.status(200).json({ message: "Logged out successfully." });
});

AuthRouter.post(
  "/refresh-token",
  verifyRefreshToken,
  asyncHandler(async (req: RequestWithUser, res) => {
    const user = await db.user.findUnique({ where: { id: req.user?.id } });
    if (!user) return res.status(404).json({ message: "User not found." });

    const { accessToken } = generateTokensAndSetCookie(res, user);
    return res.status(200).json({ accessToken, message: "Token refreshed." });
  }),
);

export default AuthRouter;
