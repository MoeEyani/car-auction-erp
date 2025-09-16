// src/pages/Branches/branchSchema.ts
import { z } from 'zod';

export const branchSchema = z.object({
  name: z.string().min(3, 'يجب أن يكون الاسم 3 أحرف على الأقل'),
  location: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type BranchFormData = z.infer<typeof branchSchema>;