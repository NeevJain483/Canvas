import z, { number } from "zod";

import { Prisma } from "../../database/generated/prisma/index.js";
import type { UUID } from "./types.js";

// Auth Schema ------------------------------
export const RegisterSchema = z.object({
  email: z
    .email()
    .max(225)
    .transform((val) => val.toLowerCase().trim()),
  password: z.string().max(64).min(8),
  username: z.string().trim().max(100).min(3),
  first_name: z.string().max(50).optional(),
  last_name: z.string().max(50).optional(),
});

export const LoginSchema = z.object({
  email: z.email().transform((val) => val.toLowerCase().trim()),
  password: z.string().trim().min(8).max(64),
});

export const VerifyEmailSchema = z.object({
  email: z.email().transform((val) => val.toLowerCase().trim()),
  code: z.string().length(6).optional(),
});

export const ForgetPasswordSchema = z.object({
  email: z.email().transform((val) => val.toLowerCase().trim()),
});

export const ResetPasswordSchema = z.object({
  newPassword: z.string().max(225).min(8),
  code: z.string().length(6),
});

export const CreateProjectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  thumbnail_url: z.string().optional(),
  is_public: z.boolean(),
  width: z.number(),
  height: z.number(),
  dpi: z.number(),
  color_mode: z.enum(["RGB", "CMYK", "Grayscale"]),
  background_color: z.string().length(7),
});

export const UUIDSchema = z.object({
  id: z.uuid() as z.ZodType<UUID>,
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  username: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profilePicUrl: z.string().optional(),
  createdAt: z.string(),
});

// Response Schema ------------------------------
export const AuthResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  message: z.string(),
});

export const RefreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number(),
});

export const ProjectDataSchema = z.object({
  id: z.uuid(),
  owner_id: z.uuid(),
  title: z.string(),
  description: z.string(),
  thumbnail_url: z.string().optional(),
  is_public: z.boolean(),
  width: z.number(),
  height: z.number(),
  dpi: z.number(),
  color_mode: z.enum(["RGB", "CMYK", "Grayscale"]),
  background_color: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  last_edited_at: z.string().nullable(),
  is_archived: z.boolean(),
  view_count: z.number(),
}) satisfies z.ZodType<Prisma.ProjectUncheckedCreateInput>;

export const UserProjectResonseSchema = z.object({
  projects: z.array(ProjectDataSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    publicCount: z.number(),
    privateCount: z.number(),
  }),
});

export const ProjectResponseSchema = z.object({
  projects: z.array(ProjectDataSchema),
});
