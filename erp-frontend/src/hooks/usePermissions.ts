// src/hooks/usePermissions.ts
import { useAuth } from '../contexts/AuthContext';
import { PermissionNames } from '../types';

export const usePermissions = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  return {
    // Direct permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Specific permission checkers for better type safety and readability
    canViewBranches: () => hasPermission(PermissionNames.VIEW_BRANCHES),
    canManageBranches: () => hasPermission(PermissionNames.MANAGE_BRANCHES),
    canViewUsers: () => hasPermission(PermissionNames.VIEW_USERS),
    canManageUsers: () => hasPermission(PermissionNames.MANAGE_USERS),
    canViewRoles: () => hasPermission(PermissionNames.VIEW_ROLES),
    canManageRoles: () => hasPermission(PermissionNames.MANAGE_ROLES),
    canViewSystemSettings: () => hasPermission(PermissionNames.VIEW_SYSTEM_SETTINGS),
    canManageSystemSettings: () => hasPermission(PermissionNames.MANAGE_SYSTEM_SETTINGS),
    canViewDashboard: () => hasPermission(PermissionNames.VIEW_DASHBOARD),

    // Combined permission checks
    canAccessBranches: () => hasAnyPermission([
      PermissionNames.VIEW_BRANCHES,
      PermissionNames.MANAGE_BRANCHES
    ]),
    canAccessUsers: () => hasAnyPermission([
      PermissionNames.VIEW_USERS,
      PermissionNames.MANAGE_USERS
    ]),
    canAccessRoles: () => hasAnyPermission([
      PermissionNames.VIEW_ROLES,
      PermissionNames.MANAGE_ROLES
    ]),
    canAccessSystemSettings: () => hasAnyPermission([
      PermissionNames.VIEW_SYSTEM_SETTINGS,
      PermissionNames.MANAGE_SYSTEM_SETTINGS
    ]),

    // Admin checks
    isAdmin: () => hasAllPermissions([
      PermissionNames.MANAGE_USERS,
      PermissionNames.MANAGE_ROLES,
      PermissionNames.MANAGE_SYSTEM_SETTINGS
    ]),
    isSuperUser: () => hasAllPermissions(Object.values(PermissionNames)),
  };
};