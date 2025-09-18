import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  UserCheck,
  BarChart3,
  LogOut,
  Bell,
  Menu,
  X,
  Shield,
  Activity,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SimplePermissionGuard } from './auth/SimplePermissionGuard';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      path: '/dashboard',
      label: 'لوحة التحكم',
      icon: BarChart3,
      permission: 'view_dashboard'
    },
    {
      path: '/branches',
      label: 'الفروع',
      icon: Building2,
      permission: 'view_branches'
    },
    {
      path: '/users',
      label: 'المستخدمين',
      icon: Users,
      permission: 'view_users'
    },
    {
      path: '/roles',
      label: 'الأدوار',
      icon: UserCheck,
      permission: 'view_roles'
    },
    {
      path: '/permissions',
      label: 'الأذونات',
      icon: Shield,
      permission: 'manage_roles'
    },
    {
      path: '/activities',
      label: 'الأنشطة',
      icon: Activity,
      permission: 'view_dashboard'
    },
    {
      path: '/performance',
      label: 'الأداء',
      icon: TrendingUp,
      permission: 'view_dashboard'
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" }
  };

  const overlayVariants = {
    open: { opacity: 1, display: "block" },
    closed: { opacity: 0, display: "none" }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed lg:static inset-y-0 right-0 z-50 w-72 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl lg:shadow-none"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-blue-700">
            <div className="flex items-center justify-between lg:justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3 space-x-reverse"
              >
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">مزاد السيارات</h1>
                  <p className="text-blue-200 text-sm">نظام إدارة شامل</p>
                </div>
              </motion.div>

              {/* Mobile Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white hover:bg-opacity-10"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* User Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 mx-4 mt-4 bg-white bg-opacity-10 rounded-xl border border-blue-700"
          >
            <p className="text-blue-100 text-sm mb-1">مرحباً،</p>
            <p className="font-semibold text-white text-lg">{user?.username}</p>
            <div className="flex items-center mt-2 text-xs text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full ml-2"></div>
              متصل الآن
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <SimplePermissionGuard key={item.path} permission={item.permission} fallback={null}>
                    <Button
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                      variant="ghost"
                      className={cn(
                        "w-full text-right p-4 rounded-xl flex items-center space-x-4 space-x-reverse transition-all duration-300 group",
                        location.pathname === item.path
                          ? 'bg-white bg-opacity-20 text-white shadow-lg transform scale-105'
                          : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white hover:shadow-md'
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                        location.pathname === item.path
                          ? 'bg-blue-600'
                          : 'bg-blue-800 group-hover:bg-blue-700'
                      )}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  </SimplePermissionGuard>
                </motion.li>
              ))}
            </motion.ul>
          </nav>

          {/* Logout Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="p-4 border-t border-blue-700"
          >
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-right p-4 rounded-xl text-red-300 hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center space-x-4 space-x-reverse group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-medium">تسجيل الخروج</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-lg border-b border-gray-200 px-6 py-4"
        >
          <div className="flex justify-between items-center">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center space-x-4 space-x-reverse flex-1 lg:flex-none">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-gray-800"
              >
                {menuItems.find(item => item.path === location.pathname)?.label || 'لوحة التحكم'}
              </motion.h2>
              <div className="hidden lg:block h-8 w-px bg-gray-300"></div>
              <p className="hidden lg:block text-gray-500 text-sm">نظام إدارة المزادات</p>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              {/* Notifications */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-gray-600">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </Button>
              </motion.div>

              {/* User Profile */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center space-x-3 space-x-reverse"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500">مدير النظام</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 overflow-y-auto bg-gray-50 p-6"
        >
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
