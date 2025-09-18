// src/components/auth/SimplePermissionGuard.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';

interface SimplePermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SimplePermissionGuard({ permission, children, fallback = null }: SimplePermissionGuardProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  
  // If not authenticated, don't show content
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }
  
  // If still loading auth or permissions, show loading state
  if (authLoading || permissionsLoading) {
    return <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>;
  }
  
  // Check permission
  if (hasPermission(permission)) {
    return <>{children}</>;
  }
  
  // No permission, show fallback
  return <>{fallback}</>;
}