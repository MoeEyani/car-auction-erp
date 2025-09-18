// src/components/auth/RoleHierarchyGuard.tsx
import React from 'react';
import { useRoleHierarchy } from '../../hooks/useRoleHierarchy';
import type { RoleLevelType } from '../../types';

interface RoleHierarchyGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireLevel?: RoleLevelType;
  requireHigherThan?: RoleLevelType;
  requireLowerThan?: RoleLevelType;
}

/**
 * Component that protects content based on role hierarchy
 *
 * @param children - Content to render when hierarchy check passes
 * @param fallback - Component to render when hierarchy check fails
 * @param requireLevel - Require exact role level
 * @param requireHigherThan - Require role level higher than specified (lower number)
 * @param requireLowerThan - Require role level lower than specified (higher number)
 */
export const RoleHierarchyGuard: React.FC<RoleHierarchyGuardProps> = ({
  children,
  fallback = null,
  requireLevel,
  requireHigherThan,
  requireLowerThan,
}) => {
  const { getUserRoleLevel } = useRoleHierarchy();

  const currentLevel = getUserRoleLevel();

  if (!currentLevel) {
    return <>{fallback}</>;
  }

  let hasAccess = false;

  if (requireLevel !== undefined) {
    hasAccess = currentLevel === requireLevel;
  } else if (requireHigherThan !== undefined) {
    hasAccess = currentLevel < requireHigherThan;
  } else if (requireLowerThan !== undefined) {
    hasAccess = currentLevel > requireLowerThan;
  } else {
    // If no specific requirement, allow access
    hasAccess = true;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};