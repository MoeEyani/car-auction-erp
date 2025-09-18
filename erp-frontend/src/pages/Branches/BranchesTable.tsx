// src/pages/Branches/BranchesTable.tsx
import { motion } from 'framer-motion';
import { Edit, MapPin, CheckCircle, XCircle } from 'lucide-react';
import type { Branch } from '../../types';
import { SimplePermissionGuard } from '../../components/auth/SimplePermissionGuard';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface BranchesTableProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
}

export default function BranchesTable({ branches, onEdit }: BranchesTableProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الاسم</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الموقع</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الحالة</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {branches.map((branch) => (
                  <motion.tr
                    key={branch.id}
                    variants={itemVariants}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        <div className="text-sm font-medium text-gray-900">{branch.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end text-sm text-gray-600">
                        {branch.location ? (
                          <>
                            <MapPin className="w-4 h-4 ml-1 text-gray-400" />
                            {branch.location}
                          </>
                        ) : (
                          <span className="text-gray-400">غير محدد</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge
                        variant={branch.isActive ? "default" : "secondary"}
                        className={`flex items-center justify-end w-fit ${
                          branch.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {branch.isActive ? (
                          <CheckCircle className="w-3 h-3 ml-1" />
                        ) : (
                          <XCircle className="w-3 h-3 ml-1" />
                        )}
                        {branch.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <SimplePermissionGuard
                        permission="manage_branches"
                        fallback={
                          <span className="text-sm text-gray-400">لا يمكن التعديل</span>
                        }
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(branch)}
                          className="flex items-center space-x-1 rtl:space-x-reverse hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                          <span>تعديل</span>
                        </Button>
                      </SimplePermissionGuard>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {branches.map((branch) => (
          <motion.div
            key={branch.id}
            variants={itemVariants}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 text-right">
                    <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                    {branch.location && (
                      <div className="flex items-center justify-end text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 ml-1 text-gray-400" />
                        {branch.location}
                      </div>
                    )}
                  </div>
                  <Badge
                    variant={branch.isActive ? "default" : "secondary"}
                    className={`ml-3 ${
                      branch.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {branch.isActive ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>

                <div className="flex justify-end">
                  <SimplePermissionGuard
                    permission="manage_branches"
                    fallback={
                      <span className="text-sm text-gray-400">لا يمكن التعديل</span>
                    }
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(branch)}
                      className="flex items-center space-x-1 rtl:space-x-reverse"
                    >
                      <Edit className="w-4 h-4" />
                      <span>تعديل</span>
                    </Button>
                  </SimplePermissionGuard>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}