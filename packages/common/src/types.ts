import { z } from "zod";
import {
  AuthResponseSchema,
  CanvasElementSchema,
  CreateProjectSchema,
  CurrentProjectSchema,
  LoginSchema,
  ProjectDataSchema,
  RefreshTokenResponseSchema,
  RegisterSchema,
  UserSchema,
} from "./schema.js";
export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type UserType = z.infer<typeof UserSchema>;
export type AuthResponseType = z.infer<typeof AuthResponseSchema>;
export type RefreshTokenResponseType = z.infer<
  typeof RefreshTokenResponseSchema
>;
export type LoginPayloadType = z.infer<typeof LoginSchema>;
export type RegisterPayloadType = z.infer<typeof RegisterSchema>;
export type CreateProjectType = z.infer<typeof CreateProjectSchema>;
export type ProjectDataType = z.infer<typeof ProjectDataSchema>;
export type CurrentProjectType = z.infer<typeof CurrentProjectSchema>;
export type CanvasElementType = z.infer<typeof CanvasElementSchema>;
