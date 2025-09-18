// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/Auth/LoginPage';
import BranchesPage from './pages/Branches/BranchesPage';
import RolesPage from './pages/Roles/RolesPage';
import UsersPage from './pages/Users/UsersPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import { SimplePermissionGuard } from './components/auth/SimplePermissionGuard';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

function DashboardPage() { 
  return (
    <SimplePermissionGuard permission="view_dashboard" fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">غير مصرح</h2>
          <p className="text-gray-600">ليس لديك صلاحية لعرض لوحة التحكم</p>
        </div>
      </div>
    }>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🏢</span>
                  </div>
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">الفروع</dt>
                    <dd className="text-lg font-medium text-gray-900">-</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">👤</span>
                  </div>
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">المستخدمين</dt>
                    <dd className="text-lg font-medium text-gray-900">-</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">👥</span>
                  </div>
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">الأدوار</dt>
                    <dd className="text-lg font-medium text-gray-900">-</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🚗</span>
                  </div>
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">المزادات</dt>
                    <dd className="text-lg font-medium text-gray-900">قريباً</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              الإجراءات السريعة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-right hover:bg-blue-100 transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl ml-3">🏢</span>
                  <div>
                    <h4 className="font-medium text-blue-900">إدارة الفروع</h4>
                    <p className="text-sm text-blue-700">إضافة وتعديل الفروع</p>
                  </div>
                </div>
              </button>

              <button className="bg-green-50 border border-green-200 rounded-lg p-4 text-right hover:bg-green-100 transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl ml-3">👤</span>
                  <div>
                    <h4 className="font-medium text-green-900">إدارة المستخدمين</h4>
                    <p className="text-sm text-green-700">إضافة وتعديل المستخدمين</p>
                  </div>
                </div>
              </button>

              <button className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-right hover:bg-purple-100 transition-colors">
                <div className="flex items-center">
                  <span className="text-2xl ml-3">👥</span>
                  <div>
                    <h4 className="font-medium text-purple-900">إدارة الأدوار</h4>
                    <p className="text-sm text-purple-700">تعديل الصلاحيات والأدوار</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              النشاطات الحديثة
            </h3>
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-4 block">📊</span>
              <p>لا توجد نشاطات حديثة</p>
              <p className="text-sm">ستظهر هنا آخر التحديثات والأنشطة</p>
            </div>
          </div>
        </div>
      </div>
    </SimplePermissionGuard>
  ); 
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div dir="rtl">
          <Toaster position="bottom-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/branches" element={<BranchesPage />} />
                  <Route path="/roles" element={<RolesPage />} />
                  <Route path="/users" element={<UsersPage />} />
                </Route>
              </Route>
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
