// src/pages/Branches/BranchesTable.tsx
import type { Branch } from '../../types';

interface BranchesTableProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void; // Add this prop
}

export default function BranchesTable({ branches, onEdit }: BranchesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b text-right">الاسم</th>
            <th className="py-2 px-4 border-b text-right">الموقع</th>
            <th className="py-2 px-4 border-b text-right">الحالة</th>
            <th className="py-2 px-4 border-b text-right">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => (
            <tr key={branch.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{branch.name}</td>
              <td className="py-2 px-4 border-b">{branch.location || '-'}</td>
              <td className="py-2 px-4 border-b">
                {branch.isActive ? (
                  <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">نشط</span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">غير نشط</span>
                )}
              </td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => onEdit(branch)} className="text-primary hover:underline">تعديل</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}