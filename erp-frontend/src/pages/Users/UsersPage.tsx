// src/pages/Users/UsersPage.tsx
import { useState } from 'react';
import { useUsers } from './hooks';
import UsersTable from './UsersTable';
import UserFormModal from './UserFormModal';
import { SimplePermissionGuard } from '../../components/auth/SimplePermissionGuard';
import type { User } from './hooks';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data: users, isLoading, error } = useUsers();

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">جاري تحميل المستخدمين...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">حدث خطأ في تحميل المستخدمين</div>
      </div>
    );
  }

  return (
    <SimplePermissionGuard permission="view_users" fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">غير مصرح</h2>
          <p className="text-gray-600">ليس لديك صلاحية لعرض صفحة المستخدمين</p>
        </div>
      </div>
    }>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <SimplePermissionGuard permission="manage_users" fallback={null}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              إضافة مستخدم جديد
            </button>
          </SimplePermissionGuard>
        </div>

        <UsersTable users={users || []} onEdit={handleEdit} />

        <UserFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      </div>
    </SimplePermissionGuard>
  );
}
