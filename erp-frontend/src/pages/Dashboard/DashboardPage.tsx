// src/pages/Dashboard/DashboardPage.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  Shield,
  Gavel,
  TrendingUp,
  Activity,
  BarChart3,
  Clock
} from 'lucide-react';
import { SimplePermissionGuard } from '../../components/auth/SimplePermissionGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function DashboardPage() {
  const navigate = useNavigate();

  const statsCards = [
    {
      title: 'الفروع',
      value: '-',
      icon: Building2,
      color: 'blue',
      description: 'عدد الفروع النشطة'
    },
    {
      title: 'المستخدمين',
      value: '-',
      icon: Users,
      color: 'green',
      description: 'إجمالي المستخدمين'
    },
    {
      title: 'الأدوار',
      value: '-',
      icon: Shield,
      color: 'purple',
      description: 'عدد الأدوار المعرفة'
    },
    {
      title: 'المزادات',
      value: 'قريباً',
      icon: Gavel,
      color: 'orange',
      description: 'المزادات النشطة'
    }
  ];

  const quickActions = [
    {
      title: 'إدارة الفروع',
      description: 'إضافة وتعديل الفروع',
      icon: Building2,
      color: 'blue',
      permission: 'view_branches',
      path: '/branches'
    },
    {
      title: 'إدارة المستخدمين',
      description: 'إضافة وتعديل المستخدمين',
      icon: Users,
      color: 'green',
      permission: 'view_users',
      path: '/users'
    },
    {
      title: 'إدارة الأدوار',
      description: 'تعديل الصلاحيات والأدوار',
      icon: Shield,
      color: 'purple',
      permission: 'view_roles',
      path: '/roles'
    },
    {
      title: 'إدارة الأذونات',
      description: 'إدارة الأذونات والصلاحيات',
      icon: Shield,
      color: 'red',
      permission: 'manage_roles',
      path: '/permissions'
    },
    {
      title: 'سجل الأنشطة',
      description: 'مراقبة الأنشطة والعمليات',
      icon: Activity,
      color: 'teal',
      permission: 'view_dashboard',
      path: '/activities'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150 text-blue-900',
      green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-150 text-green-900',
      purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150 text-purple-900',
      orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-150 text-orange-900'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconColor = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

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

  return (
    <SimplePermissionGuard permission="view_dashboard" fallback={
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center h-64"
      >
        <Card className="text-center p-8">
          <div className="mb-4">
            <Shield className="w-16 h-16 text-gray-400 mx-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-4">غير مصرح</CardTitle>
          <CardDescription className="text-gray-600">
            ليس لديك صلاحية لعرض لوحة التحكم
          </CardDescription>
        </Card>
      </motion.div>
    }>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
          <p className="text-gray-600">مرحباً بك في نظام إدارة المزادات</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statsCards.map((stat) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.description}</p>
                    </div>
                    <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                      <stat.icon className={`w-6 h-6 ${getIconColor(stat.color)}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Activity className="w-5 h-5 ml-2" />
                الإجراءات السريعة
              </CardTitle>
              <CardDescription>
                اختر المهمة التي تريد العمل عليها
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <SimplePermissionGuard key={action.path} permission={action.permission} fallback={null}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => navigate(action.path)}
                        variant="outline"
                        className={`h-auto p-6 border-2 text-right transition-all duration-200 ${getColorClasses(action.color)} hover:shadow-lg`}
                      >
                        <div className="flex items-center w-full">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{action.title}</h4>
                            <p className="text-sm opacity-80">{action.description}</p>
                          </div>
                          <div className={`p-2 rounded-full ml-4 ${getColorClasses(action.color)}`}>
                            <action.icon className={`w-6 h-6 ${getIconColor(action.color)}`} />
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  </SimplePermissionGuard>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Clock className="w-5 h-5 ml-2" />
                النشاطات الحديثة
              </CardTitle>
              <CardDescription>
                آخر التحديثات والأنشطة في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-12"
              >
                <div className="mb-4">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نشاطات حديثة</h3>
                <p className="text-gray-500 mb-4">ستظهر هنا آخر التحديثات والأنشطة</p>
                <Button variant="outline" className="text-right">
                  <TrendingUp className="w-4 h-4 ml-2" />
                  عرض التقارير
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </SimplePermissionGuard>
  );
}
