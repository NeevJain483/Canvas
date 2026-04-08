import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { REFRESH_SECRET } from "@repo/common/config";
import {
  CustomJwtPayload,
  RequestForForgetPassword,
  RequestForVerifyEmail,
} from "./types";

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const verifyRefreshToken = async (
  req: RequestForVerifyEmail,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const refresh_token = req.cookies["draw-cookie"];

  if (!refresh_token) {
    res.status(401).json({ msg: "Login first" });
    return;
  }

  if (!REFRESH_SECRET) {
    res.status(500).json({ msg: "Internal Error" });
    return;
  }

  try {
    const verify = jwt.verify(
      refresh_token,
      REFRESH_SECRET,
    ) as CustomJwtPayload;
    req.user = { id: verify.id || "", username: verify.username || "" };
    next();
  } catch (error) {
    res.status(401).json({ msg: "Login first" });
  }
};

export const forgetPasswordToken = (
  req: RequestForForgetPassword,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies["draw-app-reset-password"];
  if (!token) {
    return res.status(401).json({ msg: "Not Authorized" });
  }

  const secret = process.env.FORGET_PASSWORD_SECRET;
  if (!secret) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }

  try {
    const verify = jwt.verify(token, secret) as CustomJwtPayload;

    if (!verify.email) {
      return res.status(401).json({ msg: "Not Authorized" });
    }
    req.user = {
      email: verify.email,
    };

    // Continue to next middleware
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Not Authorized" });
  }
};
