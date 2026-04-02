import z, { email, string } from "zod";

export const RegisterSchema = z.object({
  email: z
    .email()
    .max(225)
    .transform((val) => val.toLowerCase().trim()),
  password: z.string().trim().max(225).min(8),
  username: z.string().trim().max(100).min(3),
  first_name: z.string().max(50).optional(),
  last_name: z.string().max(50).optional(),
});

export const LoginSchema = z.object({
  email: z.email().transform((val) => val.toLowerCase().trim()),
  password: z.string().trim().min(8).max(50),
});
