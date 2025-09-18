// src/types/index.ts
export interface Branch {
  id: number;
  name: string;
  location?: string | null;
  isActive: boolean;
}

// Authentication and Authorization Types
export interface User {
  id: number;
  username: string;
  fullName: string;
  isActive: boolean;
  roleId?: number;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: RolePermission[];
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  module: string;
}

export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  permission: Permission;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// Permission names for type safety
export const PermissionNames = {
  VIEW_BRANCHES: 'view_branches',
  MANAGE_BRANCHES: 'manage_branches',
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users',
  VIEW_ROLES: 'view_roles',
  MANAGE_ROLES: 'manage_roles',
  VIEW_SYSTEM_SETTINGS: 'view_system_settings',
  MANAGE_SYSTEM_SETTINGS: 'manage_system_settings',
  VIEW_DASHBOARD: 'view_dashboard'
} as const;

export type PermissionName = typeof PermissionNames[keyof typeof PermissionNames];