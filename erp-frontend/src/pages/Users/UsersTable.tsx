// src/pages/Users/UsersTable.tsx
import { useState } from 'react';
import { useDeactivateUser } from './hooks';
import { SimplePermissionGuard } from '../../components/auth/SimplePermissionGuard';
import type { User } from './hooks';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

export default function UsersTable({ users, onEdit }: UsersTableProps) {
  const [deactivateId, setDeactivateId] = useState<number | null>(null);
  const deactivateUser = useDeactivateUser();

  const handleDeactivate = async (id: number) => {
    if (window.confirm('هل أنت متأكد من إلغاء تنشيط هذا المستخدم؟')) {
      setDeactivateId(id);
      deactivateUser.mutate(id);
    }
    setDeactivateId(null);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              اسم المستخدم
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الاسم الكامل
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              البريد الإلكتروني
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الدور
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الفرع
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الحالة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.username}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.fullName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.email || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.role.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.branch?.name || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <SimplePermissionGuard permission="manage_users" fallback={null}>
                  <button
                    onClick={() => onEdit(user)}
                    className="text-indigo-600 hover:text-indigo-900 ml-4"
                  >
                    تعديل
                  </button>
                  {user.isActive && (
                    <button
                      onClick={() => handleDeactivate(user.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={deactivateUser.isPending && deactivateId === user.id}
                    >
                      {deactivateUser.isPending && deactivateId === user.id
                        ? 'جاري الإلغاء...'
                        : 'إلغاء التنشيط'}
                    </button>
                  )}
                </SimplePermissionGuard>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          لا توجد مستخدمين متاحين
        </div>
      )}
    </div>
  );
}