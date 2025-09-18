// src/hooks/useOptimizedPermissions.ts
import { useMemo, useCallback } from 'react';
import { usePermissions } from './usePermissions';
import { useAuth } from '../contexts/AuthContext';
import { permissionCache, getPermissionCacheKey } from '../utils/permissionCache';

export const useOptimizedPermissions = () => {
  const permissionsHook = usePermissions();
  const { user } = useAuth();

  // Memoized permission check functions
  const hasPermission = useCallback((permissionName: string): boolean => {
    if (!permissionsHook.permissions || permissionsHook.permissions.length === 0) return false;

    // Check cache first
    const cacheKey = getPermissionCacheKey(user?.id || 0, permissionName);
    const cached = permissionCache.get<boolean>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Calculate and cache
    const result = permissionsHook.permissions.includes(permissionName);
    permissionCache.set(cacheKey, result);
    return result;
  }, [permissionsHook.permissions, user?.id]);

  const hasAnyPermission = useCallback((permissionNames: string[]): boolean => {
    if (!permissionsHook.permissions || permissionsHook.permissions.length === 0) return false;

    return permissionNames.some(permission => hasPermission(permission));
  }, [permissionsHook.permissions, hasPermission]);

  const hasAllPermissions = useCallback((permissionNames: string[]): boolean => {
    if (!permissionsHook.permissions || permissionsHook.permissions.length === 0) return false;

    return permissionNames.every(permission => hasPermission(permission));
  }, [permissionsHook.permissions, hasPermission]);

  // Memoized specific permission checkers
  const permissionCheckers = useMemo(() => ({
    canViewBranches: () => hasPermission('view_branches'),
    canManageBranches: () => hasPermission('manage_branches'),
    canViewUsers: () => hasPermission('view_users'),
    canManageUsers: () => hasPermission('manage_users'),
    canViewRoles: () => hasPermission('view_roles'),
    canManageRoles: () => hasPermission('manage_roles'),
    canViewDashboard: () => hasPermission('view_dashboard'),
  }), [hasPermission]);

  // Bulk permission check for better performance
  const checkBulkPermissions = useCallback((permissions: string[]): Record<string, boolean> => {
    const results: Record<string, boolean> = {};

    permissions.forEach(permission => {
      results[permission] = hasPermission(permission);
    });

    return results;
  }, [hasPermission]);

  // Get permissions by module
  const getPermissionsByModule = useCallback((module: string): string[] => {
    if (!permissionsHook.permissions) return [];

    const cacheKey = `module_permissions:${module}`;
    const cached = permissionCache.get<string[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const modulePermissions = permissionsHook.permissions.filter(p => p.includes(module));
    permissionCache.set(cacheKey, modulePermissions);
    return modulePermissions;
  }, [permissionsHook.permissions]);

  return {
    ...permissionsHook,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    checkBulkPermissions,
    getPermissionsByModule,
    ...permissionCheckers,
  };
};