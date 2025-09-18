// src/pages/Activities/ActivitiesPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, User, Shield, Eye, Loader2, AlertCircle } from 'lucide-react';
import { useActivities, useActivityStats } from '../../hooks/activity/useActivities';
import { SimplePermissionGuard } from '../../components/auth/SimplePermissionGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import type { ActivityLog } from '../../types/activity';

export default function ActivitiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: activities, isLoading, error } = useActivities(currentPage);
  const { data: stats } = useActivityStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const getActionColor = (action: string) => {
    const colors = {
      LOGIN: 'bg-green-100 text-green-800',
      LOGOUT: 'bg-gray-100 text-gray-800',
      CREATE: 'bg-blue-100 text-blue-800',
      UPDATE: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
      VIEW: 'bg-purple-100 text-purple-800',
      PERMISSION_CHANGE: 'bg-indigo-100 text-indigo-800',
      ROLE_CHANGE: 'bg-pink-100 text-pink-800',
      PASSWORD_CHANGE: 'bg-orange-100 text-orange-800',
      FAILED_LOGIN: 'bg-red-100 text-red-800'
    };
    return colors[action as keyof typeof colors] || colors.VIEW;
  };

  const getResourceIcon = (resource: string) => {
    const icons = {
      USER: User,
      ROLE: Shield,
      BRANCH: Activity,
      PERMISSION: Shield,
      AUTH: User,
      SYSTEM: Activity
    };
    return icons[resource as keyof typeof icons] || Activity;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الأنشطة...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-64"
      >
        <Card className="border-red-200 bg-red-50 max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-red-900 mb-2">حدث خطأ</CardTitle>
              <CardDescription className="text-red-700">
                {error?.message || 'حدث خطأ في تحميل الأنشطة'}
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <SimplePermissionGuard permission="view_dashboard" fallback={
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-64"
      >
        <Card className="border-red-200 bg-red-50 max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <Activity className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-red-900 mb-2">غير مصرح</CardTitle>
              <CardDescription className="text-red-700">
                ليس لديك صلاحية لعرض سجل الأنشطة
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    }>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 text-right">سجل الأنشطة</h1>
            <p className="text-gray-600 mt-1 text-right">تتبع جميع الأنشطة والعمليات في النظام</p>
          </div>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">إجمالي الأنشطة</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{stats.totalActivities}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">اليوم</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{stats.todayActivities}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">المستخدمين النشطين</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">5</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Shield className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">الأذونات المستخدمة</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">7</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Activities List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Activity className="w-5 h-5 ml-2" />
                الأنشطة الأخيرة
              </CardTitle>
              <CardDescription>
                قائمة بآخر الأنشطة والعمليات في النظام
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {activities && activities.length > 0 ? (
                  activities.map((activity: ActivityLog) => {
                    const ResourceIcon = getResourceIcon(activity.resource);
                    return (
                      <motion.div
                        key={activity.id}
                        variants={itemVariants}
                        className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4 rtl:space-x-reverse flex-1">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <ResourceIcon className="w-5 h-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="flex-1 text-right">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                              <Badge className={getActionColor(activity.action)}>
                                {activity.action}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">
                                {activity.user.fullName}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{activity.details}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أنشطة</h3>
                    <p className="text-gray-500">ستظهر هنا الأنشطة عند حدوثها في النظام</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pagination */}
        {activities && activities.length > 0 && (
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                السابق
              </Button>
              <span className="text-sm text-gray-600">
                صفحة {currentPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={activities.length < 20}
              >
                التالي
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </SimplePermissionGuard>
  );
}