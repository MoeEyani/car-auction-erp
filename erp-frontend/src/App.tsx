// src/App.tsx
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Navigation } from './components/layout/Navigation';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { AppToaster } from './components/ui/Toast';
import BranchesPage from './pages/Branches/BranchesPage';
import TestPermissions from './pages/TestPermissions';
import { PermissionNames } from './types';

const queryClient = new QueryClient();

// Main app content component
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return <LoadingSpinner fullScreen message="جاري تحميل التطبيق..." />;
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <ProtectedRoute permission={PermissionNames.VIEW_DASHBOARD}>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">لوحة التحكم</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">📊</span>
                        </div>
                      </div>
                      <div className="mr-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            إجمالي الفروع
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">12</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        );
      case 'branches':
        return (
          <ProtectedRoute permission={PermissionNames.VIEW_BRANCHES}>
            <BranchesPage />
          </ProtectedRoute>
        );
      case 'users':
        return (
          <ProtectedRoute permission={PermissionNames.VIEW_USERS}>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">إدارة المستخدمين</h1>
              <p className="text-gray-600">صفحة إدارة المستخدمين قيد التطوير...</p>
            </div>
          </ProtectedRoute>
        );
      case 'roles':
        return (
          <ProtectedRoute permission={PermissionNames.VIEW_ROLES}>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">إدارة الأدوار والصلاحيات</h1>
              <p className="text-gray-600">صفحة إدارة الأدوار والصلاحيات قيد التطوير...</p>
            </div>
          </ProtectedRoute>
        );
      case 'test-permissions':
        return <TestPermissions />;
      case 'settings':
        return (
          <ProtectedRoute permission={PermissionNames.VIEW_SYSTEM_SETTINGS}>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">إعدادات النظام</h1>
              <p className="text-gray-600">صفحة إعدادات النظام قيد التطوير...</p>
            </div>
          </ProtectedRoute>
        );
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">الصفحة غير موجودة</h1>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>{renderPage()}</main>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div dir="rtl">
          <AppToaster />
          <AppContent />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
