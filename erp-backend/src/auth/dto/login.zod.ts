// src/auth/dto/login.zod.ts
import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginDto = z.infer<typeof loginSchema>;