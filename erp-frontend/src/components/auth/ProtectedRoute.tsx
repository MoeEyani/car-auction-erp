// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UnauthorizedPage } from '../../pages/Unauthorized';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
  showUnauthorizedPage?: boolean;
  children: React.ReactNode;
}

/**
 * Component that protects routes based on authentication and permissions
 * 
 * @param permission - Single permission required to access the route
 * @param permissions - Array of permissions to check
 * @param requireAll - If true, user must have ALL permissions. If false, user needs ANY permission (default: false)
 * @param requireAuth - If true, user must be authenticated (default: true)
 * @param fallback - Component to render when access is denied
 * @param showUnauthorizedPage - If true, shows custom unauthorized page instead of fallback (default: true)
 * @param children - Protected content
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permission,
  permissions = [],
  requireAll = false,
  requireAuth = true,
  fallback,
  showUnauthorizedPage = true,
  children,
}) => {
  const { isAuthenticated, hasAnyPermission, hasAllPermissions, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner fullScreen message="جاري التحقق من الصلاحيات..." />;
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-center text-gray-600">
            Please log in to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Build permissions array
  const permissionsToCheck = permission ? [permission, ...permissions] : permissions;

  // If no permissions specified, just check authentication
  if (permissionsToCheck.length === 0) {
    return <>{children}</>;
  }

  // Check permissions
  let hasAccess = false;
  if (requireAll) {
    hasAccess = hasAllPermissions(permissionsToCheck);
  } else {
    hasAccess = hasAnyPermission(permissionsToCheck);
  }

  // Handle unauthorized access
  if (!hasAccess) {
    if (showUnauthorizedPage) {
      return (
        <UnauthorizedPage 
          requiredPermission={permission || permissionsToCheck.join(', ')}
        />
      );
    }
    return <>{fallback || <div className="p-4 text-center text-red-600">الوصول مرفوض</div>}</>;
  }

  return <>{children}</>;
};