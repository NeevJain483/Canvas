import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { REFRESH_SECRET } from "@repo/common/config";
import { CustomJwtPayload, RequestWithUser } from "./types";

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

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
    req.user = { id: verify.id || "", username: verify.username || "" };
    next();
  } catch (error) {
    res.status(401).json({ msg: "Login first" });
  }
};