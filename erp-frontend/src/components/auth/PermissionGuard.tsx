// src/components/auth/PermissionGuard.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 * 
 * @param permission - Single permission to check
 * @param permissions - Array of permissions to check
 * @param requireAll - If true, user must have ALL permissions. If false, user needs ANY permission (default: false)
 * @param fallback - Component to render when permission check fails
 * @param children - Content to render when permission check passes
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { hasAnyPermission, hasAllPermissions } = useAuth();

  // Build permissions array
  const permissionsToCheck = permission ? [permission, ...permissions] : permissions;

  if (permissionsToCheck.length === 0) {
    // No permissions specified, render children
    return <>{children}</>;
  }

  let hasAccess = false;

  if (requireAll) {
    hasAccess = hasAllPermissions(permissionsToCheck);
  } else {
    hasAccess = hasAnyPermission(permissionsToCheck);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};