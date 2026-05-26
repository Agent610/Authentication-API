import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
