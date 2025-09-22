// src/pages/Roles/RolesPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Loader2, AlertCircle, Settings } from 'lucide-react';
import { useRoles } from './hooks';
import RolesTable from './RolesTable';
import RoleFormModal from './RoleFormModal';
import TemplateManager from './components/TemplateManager';
import { SimplePermissionGuard } from '../../components/auth/SimplePermissionGuard';
import { Card, CardContent, CardDescription, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import type { Role } from './hooks';

export default function RolesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
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
          <p className="text-gray-600">جاري تحميل الأدوار...</p>
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
                {error?.message || 'حدث خطأ في تحميل الأدوار'}
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <SimplePermissionGuard permission="view_roles" fallback={
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
                ليس لديك صلاحية لعرض صفحة الأدوار
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
            <h1 className="text-3xl font-bold text-gray-900 text-right">إدارة الأدوار والصلاحيات</h1>
            <p className="text-gray-600 mt-1 text-right">إدارة الأدوار وتخصيص الصلاحيات</p>
          </div>
          <SimplePermissionGuard permission="manage_roles">
            <motion.div variants={itemVariants} className="flex gap-3">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="w-5 h-5 ml-2" />
                إضافة دور جديد
              </Button>
              <SimplePermissionGuard permission="system_admin">
                <Button
                  onClick={() => setIsTemplateManagerOpen(true)}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Settings className="w-5 h-5 ml-2" />
                  إدارة القوالب
                </Button>
              </SimplePermissionGuard>
            </motion.div>
          </SimplePermissionGuard>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">إجمالي الأدوار</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">{roles?.length || 0}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Roles Table */}
        <motion.div variants={itemVariants}>
          <RolesTable roles={roles || []} onEdit={handleEdit} />
        </motion.div>

        {/* Role Form Modal */}
        <SimplePermissionGuard permission="manage_roles">
          <RoleFormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            role={selectedRole}
          />
        </SimplePermissionGuard>

        {/* Template Manager Modal */}
        <SimplePermissionGuard permission="system_admin">
          <TemplateManager
            isOpen={isTemplateManagerOpen}
            onClose={() => setIsTemplateManagerOpen(false)}
          />
        </SimplePermissionGuard>
      </motion.div>
    </SimplePermissionGuard>
  );
}
