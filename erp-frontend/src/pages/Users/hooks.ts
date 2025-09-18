// src/pages/Users/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../../services/api';

// Types for users
export interface Branch {
  id: number;
  name: string;
  code: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  isActive: boolean;
  roleId: number;
  branchId?: number;
  preferredLanguage: string;
  role: Role;
  branch?: Branch;
}

export interface CreateUserDto {
  username: string;
  fullName: string;
  email?: string;
  password: string;
  roleId: number;
  branchId?: number;
  preferredLanguage: string;
}

export interface UpdateUserDto {
  username?: string;
  fullName?: string;
  email?: string;
  password?: string;
  roleId?: number;
  branchId?: number;
  isActive?: boolean;
  preferredLanguage?: string;
}

// Hooks for users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get('/users');
      return response.data;
    },
  });
};

export const useBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await apiClient.get('/branches');
      return response.data;
    },
  });
};

export const useRolesForUsers = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await apiClient.get('/roles');
      return response.data;
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateUserDto) => {
      const response = await apiClient.post('/users', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('تم إنشاء المستخدم بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ في إنشاء المستخدم');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserDto }) => {
      const response = await apiClient.patch(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('تم تحديث المستخدم بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ في تحديث المستخدم');
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.patch(`/users/${id}`, { isActive: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('تم إلغاء تنشيط المستخدم بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ في إلغاء تنشيط المستخدم');
    },
  });
};