// src/pages/Branches/BranchesPage.tsx
import { useState } from 'react';
import { useGetBranches } from './hooks';
import BranchesTable from './BranchesTable';
import EmptyState from '../../components/EmptyState';
import BranchFormModal from './BranchFormModal'; 
import { SimplePermissionGuard } from '../../components/auth/SimplePermissionGuard';
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
    if (isLoading) return <p>جاري التحميل...</p>;
    if (isError) return <p className="text-error">حدث خطأ: {error.message}</p>;
    if (!branches || branches.length === 0) {
      return (
        <EmptyState 
          message="لا توجد فروع مسجلة بعد."
          actionText="+ إضافة فرع جديد"
          onActionClick={() => handleOpenModal()}
        />
      );
    }
    return <BranchesTable branches={branches} onEdit={handleOpenModal} />;
  };

  return (
    <SimplePermissionGuard 
      permission="view_branches" 
      fallback={
        <div className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>غير مصرح:</strong> ليس لديك صلاحية لمشاهدة الفروع.
          </div>
        </div>
      }
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">إدارة الفروع</h1>
          <SimplePermissionGuard permission="manage_branches">
            <button 
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
              onClick={() => handleOpenModal()}
            >
              + إضافة فرع جديد
            </button>
          </SimplePermissionGuard>
        </div>
      
      <div className="mb-4">
        <label className="flex items-center space-x-2 rtl:space-x-reverse">
          <input 
            type="checkbox" 
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          <span>إظهار الفروع غير النشطة</span>
        </label>
      </div>

        <div className="mt-6">
          {renderContent()}
        </div>

        <SimplePermissionGuard permission="manage_branches">
          <BranchFormModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            branchToEdit={branchToEdit}
          />
        </SimplePermissionGuard>
      </div>
    </SimplePermissionGuard>
  );
}