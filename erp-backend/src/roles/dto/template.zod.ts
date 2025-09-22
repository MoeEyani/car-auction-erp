// src/roles/dto/template.zod.ts
import { z } from 'zod';

export const createTemplateSchema = z.object({
  id: z.string().min(1, 'Template ID is required').max(100, 'Template ID must be less than 100 characters'),
  name: z.string().min(1, 'Template name is required').max(100, 'Template name must be less than 100 characters'),
  description: z.string().min(1, 'Template description is required').max(500, 'Description must be less than 500 characters'),
  category: z.enum(['management', 'operations', 'support', 'finance']),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  branchScope: z.enum(['global', 'branch']),
});

export const updateTemplateSchema = createTemplateSchema.partial().extend({
  id: z.string().min(1, 'Template ID is required').max(100, 'Template ID must be less than 100 characters'),
});

export type CreateTemplateDto = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateDto = z.infer<typeof updateTemplateSchema>;