// src/pages/Dashboard/DashboardPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SimplePermissionGuard } from '../../components/auth/SimplePermissionGuard';

export default function DashboardPage() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'إدارة الفروع',
      description: 'إضافة وتعديل الفروع',
      icon: '🏢',
      color: 'blue',
      permission: 'view_branches',
      path: '/branches'
    },
    {
      title: 'إدارة المستخدمين',
      description: 'إضافة وتعديل المستخدمين',
      icon: '👤',
      color: 'green',
      permission: 'view_users',
      path: '/users'
    },
    {
      title: 'إدارة الأدوار',
      description: 'تعديل الصلاحيات والأدوار',
      icon: '👥',
      color: 'purple',
      permission: 'view_roles',
      path: '/roles'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-900',
      green: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-900',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-900'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getDescriptionColor = (color: string) => {
    const colorMap = {
      blue: 'text-blue-700',
      green: 'text-green-700',
      purple: 'text-purple-700'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

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
              {quickActions.map((action) => (
                <SimplePermissionGuard key={action.path} permission={action.permission} fallback={null}>
                  <button 
                    onClick={() => navigate(action.path)}
                    className={`border rounded-lg p-4 text-right transition-colors ${getColorClasses(action.color)}`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl ml-3">{action.icon}</span>
                      <div>
                        <h4 className="font-medium">{action.title}</h4>
                        <p className={`text-sm ${getDescriptionColor(action.color)}`}>{action.description}</p>
                      </div>
                    </div>
                  </button>
                </SimplePermissionGuard>
              ))}
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
