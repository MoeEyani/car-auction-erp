// src/hooks/usePermissions.ts
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  const { data: permissions = [], isLoading, error } = useQuery<string[]>({
    queryKey: ['user-permissions', user?.id],
    queryFn: async () => {
      const response = await apiClient.get('/auth/permissions');
      return response.data;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on auth errors
  });

  const hasPermission = (permissionName: string): boolean => {
    if (!permissions || permissions.length === 0) return false;
    return permissions.includes(permissionName);
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    return permissionNames.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissionNames: string[]): boolean => {
    return permissionNames.every(permission => hasPermission(permission));
  };

  return {
    permissions: permissions,
    isLoading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    // Specific permission checkers
    canViewBranches: () => hasPermission('view_branches'),
    canManageBranches: () => hasPermission('manage_branches'),
    canViewUsers: () => hasPermission('view_users'),
    canManageUsers: () => hasPermission('manage_users'),
    canViewRoles: () => hasPermission('view_roles'),
    canManageRoles: () => hasPermission('manage_roles'),
    canViewDashboard: () => hasPermission('view_dashboard'),
  };
};