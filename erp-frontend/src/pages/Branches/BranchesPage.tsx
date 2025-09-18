// src/pages/Branches/BranchesPage.tsx
import { useState } from 'react';
import { useGetBranches } from './hooks';
import BranchesTable from './BranchesTable';
import EmptyState from '../../components/EmptyState';
import BranchFormModal from './BranchFormModal'; // Import the new modal
import { PermissionGuard } from '../../components/auth/PermissionGuard';
import { PermissionNames } from '../../types';
import type { Branch } from '../../types'; // Import the type

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">إدارة الفروع</h1>
        <PermissionGuard permission={PermissionNames.MANAGE_BRANCHES}>
          <button 
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
            onClick={() => handleOpenModal()}
          >
            + إضافة فرع جديد
          </button>
        </PermissionGuard>
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

      <PermissionGuard permission={PermissionNames.MANAGE_BRANCHES}>
        <BranchFormModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          branchToEdit={branchToEdit}
        />
      </PermissionGuard>
    </div>
  );
}