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
} from "./types";

export const verifyAccessToken = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  if (!ACCESS_SECRET) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ msg: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as CustomJwtPayload;
    console.log(decoded)
    if (!decoded.email) {
      return res.status(403).json({ msg: "Invalid token payload" });
    }

    req.user = {
      email: decoded.email,
      id: decoded.id || "",
      username: decoded.username || "",
    };

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};


export const verifyRefreshToken = async (
  req: RequestWithUser,
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
    return res.status(401).json({ msg: "Not Authorized" });
  }

  const secret = FORGET_PASSWORD_SECRET;
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
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Not Authorized" });
  }
};
