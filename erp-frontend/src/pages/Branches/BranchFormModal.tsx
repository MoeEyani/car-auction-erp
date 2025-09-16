// src/pages/Branches/BranchFormModal.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Branch } from '../../types';
import type { BranchFormData } from './branchSchema';
import { branchSchema } from './branchSchema';
import { useCreateBranch, useUpdateBranch } from './hooks';
import { useEffect } from 'react';

interface BranchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchToEdit?: Branch | null;
}

export default function BranchFormModal({ isOpen, onClose, branchToEdit }: BranchFormModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
  });

  const createBranchMutation = useCreateBranch();
  const updateBranchMutation = useUpdateBranch();

  useEffect(() => {
    if (branchToEdit) {
      reset({
        name: branchToEdit.name,
        location: branchToEdit.location || '',
        isActive: branchToEdit.isActive,
      });
    } else {
      reset({ name: '', location: '', isActive: true });
    }
  }, [branchToEdit, isOpen, reset]);

  if (!isOpen) return null;
  
  const onSubmit = (data: BranchFormData) => {
    if (branchToEdit) {
        updateBranchMutation.mutate({ id: branchToEdit.id, data });
    } else {
        createBranchMutation.mutate(data);
    }
    onClose();
  };

  const isSubmitting = createBranchMutation.isPending || updateBranchMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{branchToEdit ? 'تعديل فرع' : 'إضافة فرع جديد'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">اسم الفرع</label>
            <input {...register('name')} id="name" className="w-full p-2 border rounded" />
            {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Location Field */}
          <div className="mb-4">
            <label htmlFor="location" className="block mb-1">الموقع (اختياري)</label>
            <input {...register('location')} id="location" className="w-full p-2 border rounded" />
          </div>

          {/* IsActive Field (only in edit mode) */}
          {branchToEdit && (
            <div className="mb-4">
              <label className="flex items-center">
                <input type="checkbox" {...register('isActive')} className="mr-2" />
                <span>نشط</span>
              </label>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 rtl:space-x-reverse">
            <button type="button" onClick={onClose} className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-hover">
              إلغاء
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover disabled:bg-gray-400">
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}