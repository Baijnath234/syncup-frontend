import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2),
  role: z.enum(["CANDIDATE", "EMPLOYER"]),
  company: z.string().optional(),
});

export const jobSchema = z.object({
  title: z.string().min(3),
  company: z.string().min(2),
  location: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().min(20),
  skills: z.string().min(2),
});
