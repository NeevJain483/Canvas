import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface RequestForVerifyEmail extends Request {
  user?: { id: string; username: string };
}

export interface RequestForForgetPassword extends Request {
  user?: { email: string };
}

export interface CustomJwtPayload extends JwtPayload {
  id?: string;
  username?: string;
  email?: string;
}
