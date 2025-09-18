// src/hooks/usePermissions.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: permissions = [], isLoading, error, refetch } = useQuery<string[]>({
    queryKey: ['user-permissions', user?.id],
    queryFn: async () => {
      const response = await apiClient.get('/auth/permissions');
      return response.data;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Function to manually refresh permissions
  const refreshPermissions = async () => {
    await refetch();
  };

  // Function to invalidate permissions cache
  const invalidatePermissions = () => {
    queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
  };

  // Function to prefetch permissions
  const prefetchPermissions = () => {
    if (isAuthenticated && user) {
      queryClient.prefetchQuery({
        queryKey: ['user-permissions', user.id],
        queryFn: async () => {
          const response = await apiClient.get('/auth/permissions');
          return response.data;
        },
        staleTime: 5 * 60 * 1000,
      });
    }
  };

  const hasPermission = (permissionName: string): boolean => {
    if (!permissions || permissions.length === 0) return false;
    return permissions.includes(permissionName);
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    if (!permissions || permissions.length === 0) return false;
    return permissionNames.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (permissionNames: string[]): boolean => {
    if (!permissions || permissions.length === 0) return false;
    return permissionNames.every(permission => permissions.includes(permission));
  };

  // Optimized permission checkers with caching
  const canViewBranches = () => hasPermission('view_branches');
  const canManageBranches = () => hasPermission('manage_branches');
  const canViewUsers = () => hasPermission('view_users');
  const canManageUsers = () => hasPermission('manage_users');
  const canViewRoles = () => hasPermission('view_roles');
  const canManageRoles = () => hasPermission('manage_roles');
  const canViewDashboard = () => hasPermission('view_dashboard');

  return {
    permissions,
    isLoading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshPermissions,
    invalidatePermissions,
    prefetchPermissions,
    // Specific permission checkers
    canViewBranches,
    canManageBranches,
    canViewUsers,
    canManageUsers,
    canViewRoles,
    canManageRoles,
    canViewDashboard,
  };
};