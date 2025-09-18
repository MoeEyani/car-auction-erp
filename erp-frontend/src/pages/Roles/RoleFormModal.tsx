// src/pages/Roles/RoleFormModal.tsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRole, useUpdateRole, usePermissions } from './hooks';
import type { Role, Permission } from './hooks';

const roleSchema = z.object({
  name: z.string().min(1, 'اسم الدور مطلوب'),
  description: z.string().min(1, 'وصف الدور مطلوب'),
  permissionIds: z.array(z.number()).min(1, 'يجب اختيار صلاحية واحدة على الأقل'),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
}

export default function RoleFormModal({ isOpen, onClose, role }: RoleFormModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const { data: permissions, isLoading: permissionsLoading } = usePermissions();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  });

  useEffect(() => {
    if (role) {
      setValue('name', role.name);
      setValue('description', role.description);
      const permissionIds = role.permissions.map(p => p.permission.id);
      setSelectedPermissions(permissionIds);
      setValue('permissionIds', permissionIds);
    } else {
      reset();
      setSelectedPermissions([]);
    }
  }, [role, reset, setValue]);

  const handlePermissionChange = (permissionId: number) => {
    const newSelectedPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter(id => id !== permissionId)
      : [...selectedPermissions, permissionId];
    
    setSelectedPermissions(newSelectedPermissions);
    setValue('permissionIds', newSelectedPermissions);
  };

  const onSubmit = (data: RoleFormData) => {
    if (role) {
      updateRole.mutate(
        { id: role.id, data },
        {
          onSuccess: () => {
            onClose();
            reset();
            setSelectedPermissions([]);
          },
        }
      );
    } else {
      createRole.mutate(data, {
        onSuccess: () => {
          onClose();
          reset();
          setSelectedPermissions([]);
        },
      });
    }
  };

  if (!isOpen) return null;

  // Group permissions by category
  const groupedPermissions = permissions?.reduce((acc: Record<string, Permission[]>, permission: Permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>) || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {role ? 'تعديل الدور' : 'إضافة دور جديد'}
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                اسم الدور
              </label>
              <input
                type="text"
                {...register('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                الوصف
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الصلاحيات
              </label>
              {permissionsLoading ? (
                <div className="text-gray-500">جاري تحميل الصلاحيات...</div>
              ) : (
                <div className="space-y-4 max-h-60 overflow-y-auto border rounded p-4">
                  {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                    <div key={category}>
                      <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                      <div className="space-y-2">
                        {(categoryPermissions as Permission[]).map((permission) => (
                          <label key={permission.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(permission.id)}
                              onChange={() => handlePermissionChange(permission.id)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="mr-2 text-sm text-gray-700">
                              {permission.name} - {permission.description}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {errors.permissionIds && (
                <p className="mt-1 text-sm text-red-600">{errors.permissionIds.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  reset();
                  setSelectedPermissions([]);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md ml-3"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={createRole.isPending || updateRole.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:bg-gray-400"
              >
                {createRole.isPending || updateRole.isPending
                  ? 'جاري الحفظ...'
                  : role
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