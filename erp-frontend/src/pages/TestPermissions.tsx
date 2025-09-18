// src/pages/TestPermissions.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PermissionNames } from '../types';

const TestPermissions: React.FC = () => {
  const { user, hasPermission } = useAuth();

  const permissions = [
    PermissionNames.VIEW_DASHBOARD,
    PermissionNames.VIEW_USERS,
    PermissionNames.MANAGE_USERS,
    PermissionNames.VIEW_ROLES,
    PermissionNames.MANAGE_ROLES,
    PermissionNames.VIEW_BRANCHES,
    PermissionNames.MANAGE_BRANCHES,
  ];

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">اختبار الصلاحيات</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">معلومات المستخدم</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>المعرف:</strong> {user?.id}</div>
          <div><strong>اسم المستخدم:</strong> {user?.username}</div>
          <div><strong>الاسم الكامل:</strong> {user?.fullName}</div>
          <div><strong>الدور:</strong> {user?.role?.name}</div>
          <div><strong>وصف الدور:</strong> {user?.role?.description}</div>
          <div><strong>عدد الصلاحيات:</strong> {user?.role?.permissions?.length || 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">الصلاحيات المتاحة</h2>
        <div className="grid gap-2">
          {user?.role?.permissions?.map((rp) => (
            <div key={rp.permission.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>{rp.permission.name}</span>
              <span className="text-sm text-gray-600">{rp.permission.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">اختبار التحقق من الصلاحيات</h2>
        <div className="grid gap-2">
          {permissions.map((permission) => (
            <div key={permission} className="flex items-center justify-between p-2 border rounded">
              <span>{permission}</span>
              <span className={`px-2 py-1 rounded text-sm ${
                hasPermission(permission) 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {hasPermission(permission) ? 'مسموح' : 'مرفوض'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">بيانات localStorage</h2>
        <div className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          <div><strong>Token:</strong></div>
          <div className="mb-4 break-all">{localStorage.getItem('access_token')}</div>
          <div><strong>User Data:</strong></div>
          <pre className="whitespace-pre-wrap">{localStorage.getItem('user')}</pre>
        </div>
      </div>
    </div>
  );
};

export default TestPermissions;