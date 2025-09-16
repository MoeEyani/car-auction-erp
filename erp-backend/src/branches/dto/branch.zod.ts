// src/branches/dto/branch.zod.ts
import { z } from 'zod';

export const createBranchSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  location: z.string().optional(),
});

export const updateBranchSchema = z.object({
  name: z.string().min(3).optional(),
  location: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateBranchDto = z.infer<typeof createBranchSchema>;
export type UpdateBranchDto = z.infer<typeof updateBranchSchema>;