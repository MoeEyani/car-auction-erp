// src/components/layout/Navigation.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { PermissionGuard } from '../auth/PermissionGuard';
import { PermissionNames } from '../../types';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const permissions = usePermissions();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'لوحة التحكم',
      permission: PermissionNames.VIEW_DASHBOARD,
    },
    {
      id: 'branches',
      label: 'الفروع',
      permission: PermissionNames.VIEW_BRANCHES,
    },
    {
      id: 'users',
      label: 'المستخدمين',
      permission: PermissionNames.VIEW_USERS,
    },
    {
      id: 'roles',
      label: 'الأدوار والصلاحيات',
      permission: PermissionNames.VIEW_ROLES,
    },
    {
      id: 'test-permissions',
      label: 'اختبار الصلاحيات',
      permission: '', // لا توجد صلاحية مطلوبة
    },
    {
      id: 'settings',
      label: 'إعدادات النظام',
      permission: PermissionNames.VIEW_SYSTEM_SETTINGS,
    },
  ];

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">نظام إدارة المؤسسات</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8" dir="rtl">
              {navigationItems.map((item) => {
                // إذا لم تكن هناك صلاحية مطلوبة، اعرض العنصر مباشرة
                if (!item.permission) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`${
                        currentPage === item.id
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                    >
                      {item.label}
                    </button>
                  );
                }
                
                // إذا كانت هناك صلاحية مطلوبة، استخدم PermissionGuard
                return (
                  <PermissionGuard key={item.id} permission={item.permission}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      className={`${
                        currentPage === item.id
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                    >
                      {item.label}
                    </button>
                  </PermissionGuard>
                );
              })}
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center" dir="rtl">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user?.fullName}</span>
                <span className="text-gray-500 block text-xs">{user?.role?.name}</span>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1" dir="rtl">
          {navigationItems.map((item) => {
            // إذا لم تكن هناك صلاحية مطلوبة، اعرض العنصر مباشرة
            if (!item.permission) {
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`${
                    currentPage === item.id
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  } block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                >
                  {item.label}
                </button>
              );
            }
            
            // إذا كانت هناك صلاحية مطلوبة، استخدم PermissionGuard
            return (
              <PermissionGuard key={item.id} permission={item.permission}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`${
                    currentPage === item.id
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  } block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                >
                  {item.label}
                </button>
              </PermissionGuard>
            );
          })}
        </div>
      </div>
    </nav>
  );
};