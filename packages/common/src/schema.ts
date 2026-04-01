import z, { email, string } from "zod";

export const RegisterSchema = z.object({
  username: z.string().trim().max(25).min(3),
  email: z.email().transform((val)=>val.toLowerCase().trim()),
  password: z.string().trim().max(50).min(8),
});

export const LoginSchema = z.object({
  email: z.email().transform((val)=>val.toLowerCase().trim()),
  password: z.string().trim().min(8).max(50),
});