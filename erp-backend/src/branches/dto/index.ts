import { z } from 'zod';

// Zod schema for branch creation
export const createBranchSchema = z.object({
  name: z.string()
    .min(1, 'اسم الفرع مطلوب')
    .max(100, 'اسم الفرع يجب أن يكون أقل من 100 حرف'),
  location: z.string()
    .max(255, 'الموقع يجب أن يكون أقل من 255 حرف')
    .optional(),
  isActive: z.boolean().default(true),
});

// Zod schema for branch update
export const updateBranchSchema = createBranchSchema.partial();

// TypeScript types inferred from Zod schemas
export type CreateBranchDto = z.infer<typeof createBranchSchema>;
export type UpdateBranchDto = z.infer<typeof updateBranchSchema>;

// Response DTO
export interface BranchResponseDto {
  id: number;
  name: string;
  location: string | null;
  isActive: boolean;
  createdAt: Date;
}