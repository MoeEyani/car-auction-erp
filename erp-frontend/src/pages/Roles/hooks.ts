// src/pages/Roles/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../../services/api';

// Types for roles and permissions
export interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
}

export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  category: 'management' | 'operations' | 'support' | 'finance';
  permissions: string[];
  branchScope: 'global' | 'branch';
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: {
    permission: Permission;
  }[];
}

export interface CreateRoleDto {
  name: string;
  description: string;
  permissionIds: number[];
  templateId?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissionIds?: number[];
  templateId?: string;
}

// Hooks for roles
export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await apiClient.get('/roles');
      return response.data;
    },
  });
};

export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const response = await apiClient.get('/roles/permissions');
      return response.data;
    },
  });
};

export const useRoleTemplates = () => {
  return useQuery({
    queryKey: ['role-templates'],
    queryFn: async () => {
      const response = await apiClient.get('/roles/templates');
      return response.data as RoleTemplate[];
    },
  });
};

export const useRoleTemplate = (templateId: string) => {
  return useQuery({
    queryKey: ['role-template', templateId],
    queryFn: async () => {
      const response = await apiClient.get(`/roles/templates/${templateId}`);
      return response.data as RoleTemplate;
    },
    enabled: !!templateId,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateRoleDto) => {
      const response = await apiClient.post('/roles', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('تم إنشاء الدور بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ في إنشاء الدور');
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateRoleDto }) => {
      const response = await apiClient.patch(`/roles/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('تم تحديث الدور بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ في تحديث الدور');
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/roles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('تم حذف الدور بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ في حذف الدور');
    },
  });
};