// src/pages/Branches/SimpleBranchesPage.tsx
import { useState } from 'react';

interface Branch {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
}

export default function SimpleBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([
    { id: 1, name: 'الفرع الرئيسي', location: 'الرياض', isActive: true },
    { id: 2, name: 'فرع جدة', location: 'جدة', isActive: true },
    { id: 3, name: 'فرع الدمام', location: 'الدمام', isActive: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      const newBranch: Branch = {
        id: Date.now(), // استخدام timestamp كـ ID مؤقت
        name: formData.name,
        location: formData.location,
        isActive: formData.isActive
      };
      setBranches([...branches, newBranch]);
      setFormData({ name: '', location: '', isActive: true });
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id: number) => {
    setBranches(branches.filter(branch => branch.id !== id));
  };

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">إدارة الفروع</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          + إضافة فرع جديد
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الاسم
              </th>
              <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الموقع
              </th>
              <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branches.map((branch) => (
              <tr key={branch.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 text-sm font-medium text-gray-900">
                  {branch.name}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {branch.location}
                </td>
                <td className="py-4 px-6 text-sm">
                  {branch.isActive ? (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      نشط
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      غير نشط
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 text-sm">
                  <button className="text-blue-600 hover:text-blue-900 ml-4">
                    تعديل
                  </button>
                  <button 
                    onClick={() => handleDelete(branch.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {branches.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فروع</h3>
          <p className="text-gray-500">ابدأ بإضافة فرع جديد لنظامك</p>
        </div>
      )}

      {/* Modal إضافة فرع */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-lg mx-4">
            <h2 className="text-xl font-bold mb-4">إضافة فرع جديد</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الفرع *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="ml-2"
                  />
                  <span className="text-sm text-gray-700">فرع نشط</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}