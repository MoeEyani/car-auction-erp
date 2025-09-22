// src/users/dto/user.zod.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(255, 'Full name must be less than 255 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roleId: z.number().int().positive('Role ID must be a positive integer'),
  branchId: z.number().int().positive('Branch ID must be a positive integer').optional(),
  preferredLanguage: z.enum(['ar', 'en']).default('ar'),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;