// src/pages/Branches/BranchesPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useGetBranches } from './hooks';
import BranchesTable from './BranchesTable';
import EmptyState from '../../components/EmptyState';
import BranchFormModal from './BranchFormModal';
import { SimplePermissionGuard } from '../../components/auth/SimplePermissionGuard';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardTitle } from '../../components/ui/Card';
import type { Branch } from '../../types';

export default function BranchesPage() {
  const [showInactive, setShowInactive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branchToEdit, setBranchToEdit] = useState<Branch | null>(null);
  const { data: branches, isLoading, isError, error } = useGetBranches(showInactive);

  const handleOpenModal = (branch: Branch | null = null) => {
    setBranchToEdit(branch);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBranchToEdit(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">جاري تحميل الفروع...</p>
          </div>
        </motion.div>
      );
    }

    if (isError) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-red-600 mb-4">
                <Building2 className="w-12 h-12 mx-auto" />
              </div>
              <CardTitle className="text-red-900 mb-2">حدث خطأ</CardTitle>
              <CardDescription className="text-red-700">
                {error?.message || 'حدث خطأ أثناء تحميل الفروع'}
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    if (!branches || branches.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <EmptyState
            message="لا توجد فروع مسجلة بعد."
            actionText="+ إضافة فرع جديد"
            onActionClick={() => handleOpenModal()}
          />
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <BranchesTable branches={branches} onEdit={handleOpenModal} />
      </motion.div>
    );
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

  return (
    <SimplePermissionGuard
      permission="view_branches"
      fallback={
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6"
        >
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center">
                <Building2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <CardTitle className="text-red-900 mb-2">غير مصرح</CardTitle>
                <CardDescription className="text-red-700">
                  ليس لديك صلاحية لمشاهدة الفروع.
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      }
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 space-y-6"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 text-right">إدارة الفروع</h1>
            <p className="text-gray-600 mt-1 text-right">إدارة فروع الشركة والموقع</p>
          </div>
          <SimplePermissionGuard permission="manage_branches">
            <motion.div variants={itemVariants}>
              <Button
                onClick={() => handleOpenModal()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="w-5 h-5 ml-2" />
                إضافة فرع جديد
              </Button>
            </motion.div>
          </SimplePermissionGuard>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInactive(!showInactive)}
                    className="flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    {showInactive ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span>{showInactive ? 'إخفاء' : 'إظهار'} الفروع غير النشطة</span>
                  </Button>
                </div>
                <div className="text-sm text-gray-600 text-right">
                  إجمالي الفروع: {branches?.length || 0}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants}>
          {renderContent()}
        </motion.div>

        {/* Modal */}
        <SimplePermissionGuard permission="manage_branches">
          <BranchFormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            branchToEdit={branchToEdit}
          />
        </SimplePermissionGuard>
      </motion.div>
    </SimplePermissionGuard>
  );
}