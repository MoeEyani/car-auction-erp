// src/pages/Roles/RolesPage.tsx
import { useState } from 'react';
import { useRoles } from './hooks';
import RolesTable from './RolesTable';
import RoleFormModal from './RoleFormModal';
import { SimplePermissionGuard } from '../../components/auth/SimplePermissionGuard';
import type { Role } from './hooks';

export default function RolesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { data: roles, isLoading, error } = useRoles();

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">جاري تحميل الأدوار...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">حدث خطأ في تحميل الأدوار</div>
      </div>
    );
  }

  return (
    <SimplePermissionGuard permission="view_roles" fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">غير مصرح</h2>
          <p className="text-gray-600">ليس لديك صلاحية لعرض صفحة الأدوار</p>
        </div>
      </div>
    }>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">إدارة الأدوار والصلاحيات</h1>
          <SimplePermissionGuard permission="manage_roles" fallback={null}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              إضافة دور جديد
            </button>
          </SimplePermissionGuard>
        </div>

        <RolesTable roles={roles || []} onEdit={handleEdit} />

        <RoleFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          role={selectedRole}
        />
      </div>
    </SimplePermissionGuard>
  );
}
