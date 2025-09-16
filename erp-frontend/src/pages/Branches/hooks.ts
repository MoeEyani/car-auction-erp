// src/pages/Branches/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../services/api';
import type { Branch } from '../../types';
import toast from 'react-hot-toast';

// Custom hook to fetch all branches
export const useGetBranches = (includeInactive: boolean = false) => {
  return useQuery<Branch[], Error>({
    queryKey: ['branches', { includeInactive }],
    queryFn: async () => {
      const response = await apiClient.get('/branches', {
        params: { includeInactive },
      });
      return response.data;
    },
  });
};

// Custom hook to create a new branch
export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newBranch: { name: string; location?: string; isActive?: boolean }) => 
      apiClient.post('/branches', newBranch),
    onSuccess: () => {
      toast.success('تمت إضافة الفرع بنجاح!');
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
    onError: (error) => {
      toast.error(`حدث خطأ: ${error.message}`);
    }
  });
};

// Custom hook to update a branch
export const useUpdateBranch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number, data: Partial<Branch> }) =>
            apiClient.patch(`/branches/${id}`, data),
        onSuccess: () => {
            toast.success('تم تحديث الفرع بنجاح!');
            queryClient.invalidateQueries({ queryKey: ['branches'] });
        },
        onError: (error) => {
          toast.error(`حدث خطأ: ${error.message}`);
        }
    });
}