// src/pages/Users/UserFormModal.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useCreateUser, useUpdateUser, useBranches, useRolesForUsers } from './hooks';
import type { User } from './hooks';

const userSchema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  fullName: z.string().min(1, 'الاسم الكامل مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  password: z.string().optional().or(z.literal('')),
  roleId: z.number().min(1, 'الدور مطلوب'),
  branchId: z.number().optional(),
  preferredLanguage: z.enum(['ar', 'en']),
  isActive: z.boolean().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export default function UserFormModal({ isOpen, onClose, user }: UserFormModalProps) {
  const { data: branches } = useBranches();
  const { data: roles, isLoading: rolesLoading } = useRolesForUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      preferredLanguage: 'ar',
      isActive: true,
    },
  });

  useEffect(() => {
    if (user) {
      setValue('username', user.username);
      setValue('fullName', user.fullName);
      setValue('email', user.email || '');
      setValue('roleId', user.roleId);
      setValue('branchId', user.branchId);
      setValue('preferredLanguage', user.preferredLanguage as 'ar' | 'en');
      setValue('isActive', user.isActive);
    } else {
      reset({
        preferredLanguage: 'ar',
        isActive: true,
      });
    }
  }, [user, reset, setValue]);

  const onSubmit = (data: UserFormData) => {
    // Validate password for new users
    if (!user && (!data.password || data.password.length < 6)) {
      toast.error('كلمة المرور مطلوبة ويجب أن تكون 6 أحرف على الأقل');
      return;
    }
    
    // Validate password length if provided for existing users
    if (user && data.password && data.password.length > 0 && data.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    // Clean up data
    const cleanedData = {
      ...data,
      email: data.email || undefined,
      password: data.password || undefined,
      branchId: data.branchId || undefined,
    };

    if (user) {
      // For update, only send password if it's provided
      const updateData = { ...cleanedData };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      updateUser.mutate(
        { id: user.id, data: updateData },
        {
          onSuccess: () => {
            onClose();
            reset();
          },
        }
      );
    } else {
      // For create, password is required
      if (!cleanedData.password) {
        toast.error('كلمة المرور مطلوبة');
        return;
      }
      
      createUser.mutate(cleanedData as any, {
        onSuccess: () => {
          onClose();
          reset();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {user ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  {...register('username')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني (اختياري)
              </label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور {!user && '(مطلوب)'}
                {user && ' (اتركه فارغ إذا كنت لا تريد تغييره)'}
              </label>
              <input
                type="password"
                {...register('password')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">
                  الدور
                </label>
                <select
                  {...register('roleId', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                >
                  <option value="">اختر الدور</option>
                  {roles?.map((role: any) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {errors.roleId && (
                  <p className="mt-1 text-sm text-red-600">{errors.roleId.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="branchId" className="block text-sm font-medium text-gray-700">
                  الفرع (اختياري)
                </label>
                <select
                  {...register('branchId', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                >
                  <option value="">اختر الفرع</option>
                  {branches?.map((branch: any) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700">
                  اللغة المفضلة
                </label>
                <select
                  {...register('preferredLanguage')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>

              {user && (
                <div>
                  <label className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="mr-2 text-sm text-gray-700">المستخدم نشط</span>
                  </label>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  reset();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md ml-3"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={createUser.isPending || updateUser.isPending || rolesLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:bg-gray-400"
              >
                {createUser.isPending || updateUser.isPending
                  ? 'جاري الحفظ...'
                  : user
                  ? 'تحديث'
                  : 'إضافة'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}