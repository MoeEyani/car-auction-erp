// src/pages/Permissions/PermissionsPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Edit, Trash2, Key } from 'lucide-react';
import { SimplePermissionGuard } from '../../components/auth/SimplePermissionGuard';
import { Card, CardContent, CardDescription, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PermissionNames } from '../../types';

// Mock data for permissions - in real app this would come from API
const mockPermissions = [
  {
    id: 1,
    name: PermissionNames.VIEW_BRANCHES,
    description: 'عرض الفروع',
    module: 'branches',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 2,
    name: PermissionNames.MANAGE_BRANCHES,
    description: 'إدارة الفروع (إضافة، تعديل، حذف)',
    module: 'branches',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 3,
    name: PermissionNames.VIEW_USERS,
    description: 'عرض المستخدمين',
    module: 'users',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 4,
    name: PermissionNames.MANAGE_USERS,
    description: 'إدارة المستخدمين (إضافة، تعديل، حذف)',
    module: 'users',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 5,
    name: PermissionNames.VIEW_ROLES,
    description: 'عرض الأدوار',
    module: 'roles',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 6,
    name: PermissionNames.MANAGE_ROLES,
    description: 'إدارة الأدوار (إضافة، تعديل، حذف)',
    module: 'roles',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 7,
    name: PermissionNames.VIEW_DASHBOARD,
    description: 'عرض لوحة التحكم',
    module: 'dashboard',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export default function PermissionsPage() {
  const [permissions] = useState(mockPermissions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<any>(null);

  const handleEdit = (permission: any) => {
    setSelectedPermission(permission);
    setIsModalOpen(true);
  };

  const handleDelete = (permissionId: number) => {
    // In real app, this would call an API
    console.log('Delete permission:', permissionId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPermission(null);
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

  const getModuleColor = (module: string) => {
    const colors = {
      branches: 'bg-blue-100 text-blue-800',
      users: 'bg-green-100 text-green-800',
      roles: 'bg-purple-100 text-purple-800',
      dashboard: 'bg-orange-100 text-orange-800',
      system: 'bg-gray-100 text-gray-800'
    };
    return colors[module as keyof typeof colors] || colors.system;
  };

  return (
    <SimplePermissionGuard permission="manage_roles" fallback={
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-64"
      >
        <Card className="border-red-200 bg-red-50 max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-red-900 mb-2">غير مصرح</CardTitle>
              <CardDescription className="text-red-700">
                ليس لديك صلاحية لإدارة الأذونات
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
            <h1 className="text-3xl font-bold text-gray-900 text-right">إدارة الأذونات</h1>
            <p className="text-gray-600 mt-1 text-right">إدارة الأذونات والصلاحيات في النظام</p>
          </div>
          <motion.div variants={itemVariants}>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5 ml-2" />
              إضافة صلاحية جديدة
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Key className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">إجمالي الأذونات</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{permissions.length}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">الوحدات</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(permissions.map(p => p.module)).size}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Edit className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">أذونات قابلة للتعديل</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{permissions.length}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Permissions Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الصلاحية
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الوصف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الوحدة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {permissions.map((permission) => (
                      <motion.tr
                        key={permission.id}
                        variants={itemVariants}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 text-right">
                            {permission.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 text-right">
                            {permission.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getModuleColor(permission.module)}>
                            {permission.module}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(permission)}
                              className="flex items-center space-x-1 rtl:space-x-reverse"
                            >
                              <Edit className="w-4 h-4" />
                              <span>تعديل</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(permission.id)}
                              className="flex items-center space-x-1 rtl:space-x-reverse text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>حذف</span>
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Permission Form Modal - Placeholder for now */}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4 text-right">
                {selectedPermission ? 'تعديل الصلاحية' : 'إضافة صلاحية جديدة'}
              </h3>
              <p className="text-gray-600 text-right mb-4">
                هذه الميزة ستكون متاحة قريباً
              </p>
              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button variant="outline" onClick={handleCloseModal}>
                  إلغاء
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </SimplePermissionGuard>
  );
}