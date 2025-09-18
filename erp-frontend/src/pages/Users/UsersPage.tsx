// src/pages/Users/UsersPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Loader2, AlertCircle, Shield, UserCheck } from 'lucide-react';
import { useUsers } from './hooks';
import UsersTable from './UsersTable';
import UserFormModal from './UserFormModal';
import { SimplePermissionGuard } from '../../components/auth/SimplePermissionGuard';
import { useRoleHierarchy } from '../../hooks/useRoleHierarchy';
import { RoleHierarchyGuard } from '../../components/auth/RoleHierarchyGuard';
import { Card, CardContent, CardDescription, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { User } from './hooks';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { data: users, isLoading, error } = useUsers();
  const { getManageableUsers, getCurrentUserRoleName } = useRoleHierarchy();

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل المستخدمين...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-64"
      >
        <Card className="border-red-200 bg-red-50 max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-red-900 mb-2">حدث خطأ</CardTitle>
              <CardDescription className="text-red-700">
                {error?.message || 'حدث خطأ في تحميل المستخدمين'}
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <SimplePermissionGuard permission="view_users" fallback={
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-64"
      >
        <Card className="border-red-200 bg-red-50 max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-red-900 mb-2">غير مصرح</CardTitle>
              <CardDescription className="text-red-700">
                ليس لديك صلاحية لعرض صفحة المستخدمين
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    }>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 text-right">إدارة المستخدمين</h1>
            <p className="text-gray-600 mt-1 text-right">إدارة مستخدمي النظام وصلاحياتهم</p>
          </div>
          <SimplePermissionGuard permission="manage_users">
            <motion.div variants={itemVariants}>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="w-5 h-5 ml-2" />
                إضافة مستخدم جديد
              </Button>
            </motion.div>
          </SimplePermissionGuard>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">إجمالي المستخدمين</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{users?.length || 0}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">مستواك الحالي</span>
                  </div>
                  <div className="text-sm font-bold text-green-600">{getCurrentUserRoleName()}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">قابل للإدارة</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {users ? getManageableUsers(users).length : 0}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div variants={itemVariants}>
          <UsersTable users={users || []} onEdit={handleEdit} />
        </motion.div>

        {/* User Form Modal */}
        <SimplePermissionGuard permission="manage_users">
          <UserFormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            user={selectedUser}
          />
        </SimplePermissionGuard>
      </motion.div>
    </SimplePermissionGuard>
  );
}
