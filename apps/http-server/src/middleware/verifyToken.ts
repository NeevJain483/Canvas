import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import {
  ACCESS_SECRET,
  FORGET_PASSWORD_SECRET,
  REFRESH_SECRET,
} from "@repo/common/config";
import {
  CustomJwtPayload,
  RequestForForgetPassword,
  RequestWithUser,
} from "../types";

export const verifyAccessToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  if (!ACCESS_SECRET) {
    res.status(500).json({ msg: "Internal Server Error" });
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ msg: "Authorization header missing" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ msg: "Token missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as CustomJwtPayload;
    if (!decoded.email) {
      res.status(403).json({ msg: "Invalid token payload" });
      return;
    }

    req.user = {
      email: decoded.email,
      id: decoded.id || "",
      username: decoded.username || "",
    };

    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export const verifyRefreshToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
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
    req.user = {
      id: verify.id || "",
      username: verify.username || "",
      email: "",
    };
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
    res.status(401).json({ msg: "Not Authorized" });
    return;
  }

  const secret = FORGET_PASSWORD_SECRET;
  if (!secret) {
    res.status(500).json({ msg: "Internal Server Error" });
    return;
  }

  try {
    const verify = jwt.verify(token, secret) as CustomJwtPayload;

    if (!verify.email) {
      res.status(401).json({ msg: "Not Authorized" });
      return;
    }
    req.user = {
      email: verify.email,
    };
    next();
  } catch (error) {
    res.status(401).json({ msg: "Not Authorized" });
  }
};
