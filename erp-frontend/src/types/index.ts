// src/types/index.ts
export interface Branch {
  id: number;
  name: string;
  location?: string | null;
  isActive: boolean;
}