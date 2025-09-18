// src/pages/Roles/RolesTable.tsx
import { useState } from 'react';
import { useDeleteRole } from './hooks';
import { SimplePermissionGuard } from '../../components/auth/SimplePermissionGuard';
import type { Role } from './hooks';

interface RolesTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
}

export default function RolesTable({ roles, onEdit }: RolesTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const deleteRole = useDeleteRole();

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الدور؟')) {
      deleteRole.mutate(id);
    }
    setDeleteId(null);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              اسم الدور
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الوصف
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              عدد الصلاحيات
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{role.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{role.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {role.permissions.length} صلاحية
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <SimplePermissionGuard permission="manage_roles" fallback={null}>
                  <button
                    onClick={() => onEdit(role)}
                    className="text-indigo-600 hover:text-indigo-900 ml-4"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={deleteRole.isPending && deleteId === role.id}
                  >
                    {deleteRole.isPending && deleteId === role.id ? 'جاري الحذف...' : 'حذف'}
                  </button>
                </SimplePermissionGuard>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {roles.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          لا توجد أدوار متاحة
        </div>
      )}
    </div>
  );
}