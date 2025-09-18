// src/pages/Branches/BranchFormModal.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Check, X, Loader2 } from 'lucide-react';
import type { Branch } from '../../types';
import type { BranchFormData } from './branchSchema';
import { branchSchema } from './branchSchema';
import { useCreateBranch, useUpdateBranch } from './hooks';
import { useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

interface BranchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchToEdit?: Branch | null;
}

export default function BranchFormModal({ isOpen, onClose, branchToEdit }: BranchFormModalProps) {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
  });

  const createBranchMutation = useCreateBranch();
  const updateBranchMutation = useUpdateBranch();

  const isActive = watch('isActive');

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
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <DialogTitle className="text-center text-xl">
                  {branchToEdit ? 'تعديل فرع' : 'إضافة فرع جديد'}
                </DialogTitle>
                <DialogDescription className="text-center">
                  {branchToEdit
                    ? 'قم بتعديل بيانات الفرع أدناه'
                    : 'أدخل بيانات الفرع الجديد'
                  }
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-right block text-sm font-medium">
                    اسم الفرع *
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <Input
                      {...register('name')}
                      id="name"
                      className={`pl-10 pr-4 text-right ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
                      placeholder="أدخل اسم الفرع"
                      autoFocus
                    />
                  </div>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm text-right"
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Location Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="location" className="text-right block text-sm font-medium">
                    الموقع (اختياري)
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <Input
                      {...register('location')}
                      id="location"
                      className="pl-10 pr-4 text-right"
                      placeholder="أدخل موقع الفرع"
                    />
                  </div>
                </motion.div>

                {/* IsActive Field (only in edit mode) */}
                {branchToEdit && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-end space-x-2 rtl:space-x-reverse"
                  >
                    <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                      الفرع نشط
                    </Label>
                    <Checkbox
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={(checked: boolean | "indeterminate") => setValue('isActive', !!checked)}
                    />
                  </motion.div>
                )}

                {/* Action Buttons */}
                <DialogFooter className="flex gap-3 pt-4">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <X className="w-4 h-4" />
                      <span>إلغاء</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري الحفظ...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>حفظ</span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}