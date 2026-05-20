import { Response } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "@repo/common/config";

export const formatUserResponse = (user: any) => ({
  id: user.id,
  email: user.email,
  username: user.username,
  firstName: user.first_name || "",
  lastName: user.last_name || "",
  profilePicUrl: user.profile_pic_url || "",
  createdAt: user.created_at,
});

export const generateTokensAndSetCookie = (res: Response, user: any) => {
  if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error("AUTH_SECRETS_MISSING");
  }

  const accessToken = jwt.sign(
    { username: user.username, id: user.id, email: user.email },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("draw-cookie", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return { accessToken, refreshToken };
};