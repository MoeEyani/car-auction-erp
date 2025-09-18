// src/roles/dto/role.zod.ts
import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(100, 'Role name must be less than 100 characters'),
  description: z.string().optional(),
  permissionIds: z.array(z.number().int().positive()).optional(),
});

export const updateRoleSchema = createRoleSchema.partial();

export type CreateRoleDto = z.infer<typeof createRoleSchema>;
export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;