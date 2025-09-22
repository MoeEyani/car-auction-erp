// src/pages/Roles/components/TemplateManager.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import apiClient from '../../../services/api';
import type { RoleTemplate, Permission } from '../hooks';

const templateSchema = z.object({
  id: z.string().min(1, 'معرف القالب مطلوب'),
  name: z.string().min(1, 'اسم القالب مطلوب'),
  description: z.string().min(1, 'وصف القالب مطلوب'),
  category: z.enum(['management', 'operations', 'support', 'finance']),
  permissions: z.array(z.string()).min(1, 'يجب اختيار صلاحية واحدة على الأقل'),
  branchScope: z.enum(['global', 'branch']),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface TemplateData {
  defaultTemplates: RoleTemplate[];
  customTemplates: RoleTemplate[];
}

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateManager({ isOpen, onClose }: TemplateManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<RoleTemplate | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: templateData, isLoading: templatesLoading } = useQuery({
    queryKey: ['manageable-templates'],
    queryFn: async () => {
      const response = await apiClient.get('/roles/templates/manage');
      return response.data as TemplateData;
    },
    enabled: isOpen,
  });

  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const response = await apiClient.get('/roles/permissions');
      return response.data as Permission[];
    },
    enabled: isOpen,
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data: TemplateFormData) => {
      const response = await apiClient.post('/roles/templates/manage', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manageable-templates'] });
      queryClient.invalidateQueries({ queryKey: ['role-templates'] });
      toast.success('تم إنشاء القالب بنجاح');
      setIsCreating(false);
      reset();
    },
    onError: () => {
      toast.error('حدث خطأ في إنشاء القالب');
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ templateId, data }: { templateId: string; data: Partial<TemplateFormData> }) => {
      const response = await apiClient.put(`/roles/templates/manage/${templateId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manageable-templates'] });
      queryClient.invalidateQueries({ queryKey: ['role-templates'] });
      toast.success('تم تحديث القالب بنجاح');
      setEditingTemplate(null);
      reset();
    },
    onError: () => {
      toast.error('حدث خطأ في تحديث القالب');
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const response = await apiClient.delete(`/roles/templates/manage/${templateId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manageable-templates'] });
      queryClient.invalidateQueries({ queryKey: ['role-templates'] });
      toast.success('تم حذف القالب بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ في حذف القالب');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
  });

  const handlePermissionChange = (permissionName: string) => {
    const newSelectedPermissions = selectedPermissions.includes(permissionName)
      ? selectedPermissions.filter(p => p !== permissionName)
      : [...selectedPermissions, permissionName];
    
    setSelectedPermissions(newSelectedPermissions);
    setValue('permissions', newSelectedPermissions);
  };

  const startEditing = (template: RoleTemplate) => {
    setEditingTemplate(template);
    setValue('id', template.id);
    setValue('name', template.name);
    setValue('description', template.description);
    setValue('category', template.category);
    setValue('branchScope', template.branchScope);
    setValue('permissions', template.permissions);
    setSelectedPermissions(template.permissions);
  };

  const cancelEditing = () => {
    setEditingTemplate(null);
    setIsCreating(false);
    setSelectedPermissions([]);
    reset();
  };

  const onSubmit = (data: TemplateFormData) => {
    if (editingTemplate) {
      updateTemplateMutation.mutate({
        templateId: editingTemplate.id,
        data: { ...data, permissions: selectedPermissions }
      });
    } else {
      createTemplateMutation.mutate({ ...data, permissions: selectedPermissions });
    }
  };

  const handleDelete = (templateId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا القالب؟')) {
      deleteTemplateMutation.mutate(templateId);
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
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900">
              إدارة قوالب الأدوار
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {templatesLoading || permissionsLoading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Templates List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">القوالب المتاحة</h3>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    إضافة قالب جديد
                  </button>
                </div>

                {/* Default Templates */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">القوالب الافتراضية</h4>
                  <div className="space-y-2">
                    {templateData?.defaultTemplates.map((template) => (
                      <div key={template.id} className="p-3 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{template.name}</h5>
                            <p className="text-sm text-gray-600">{template.description}</p>
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
                              {template.category} - {template.branchScope}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">افتراضي</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Templates */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">القوالب المخصصة</h4>
                  <div className="space-y-2">
                    {templateData?.customTemplates.length === 0 ? (
                      <p className="text-gray-500 text-sm">لا توجد قوالب مخصصة</p>
                    ) : (
                      templateData?.customTemplates.map((template) => (
                        <div key={template.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{template.name}</h5>
                              <p className="text-sm text-gray-600">{template.description}</p>
                              <span className="text-xs bg-blue-100 px-2 py-1 rounded mt-1 inline-block">
                                {template.category} - {template.branchScope}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditing(template)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                تعديل
                              </button>
                              <button
                                onClick={() => handleDelete(template.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                حذف
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Template Form */}
              {(isCreating || editingTemplate) && (
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    {editingTemplate ? 'تعديل القالب' : 'إضافة قالب جديد'}
                  </h3>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        معرف القالب
                      </label>
                      <input
                        type="text"
                        {...register('id')}
                        disabled={!!editingTemplate}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                      />
                      {errors.id && (
                        <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        اسم القالب
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
                      <label className="block text-sm font-medium text-gray-700">
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          الفئة
                        </label>
                        <select
                          {...register('category')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        >
                          <option value="management">الإدارة</option>
                          <option value="operations">العمليات</option>
                          <option value="support">الدعم</option>
                          <option value="finance">المالية</option>
                        </select>
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          نطاق الفرع
                        </label>
                        <select
                          {...register('branchScope')}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        >
                          <option value="branch">فرع واحد</option>
                          <option value="global">عام</option>
                        </select>
                        {errors.branchScope && (
                          <p className="mt-1 text-sm text-red-600">{errors.branchScope.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الصلاحيات
                      </label>
                      <div className="space-y-4 max-h-60 overflow-y-auto border rounded p-4">
                        {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                          <div key={category}>
                            <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                            <div className="space-y-2">
                              {categoryPermissions.map((permission) => (
                                <label key={permission.id} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedPermissions.includes(permission.name)}
                                    onChange={() => handlePermissionChange(permission.name)}
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
                      {errors.permissions && (
                        <p className="mt-1 text-sm text-red-600">{errors.permissions.message}</p>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={createTemplateMutation.isPending || updateTemplateMutation.isPending}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {editingTemplate ? 'تحديث القالب' : 'إنشاء القالب'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}