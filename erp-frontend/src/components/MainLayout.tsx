import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SimplePermissionGuard } from './auth/SimplePermissionGuard';

// We will create Sidebar and Header components later
export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'لوحة التحكم', icon: '🏠', permission: 'view_dashboard' },
    { path: '/branches', label: 'الفروع', icon: '🏢', permission: 'view_branches' },
    { path: '/roles', label: 'الأدوار', icon: '👥', permission: 'view_roles' },
    { path: '/users', label: 'المستخدمين', icon: '👤', permission: 'view_users' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold">نظام إدارة المزادات</h1>
          <p className="text-gray-300 text-sm">مرحباً، {user?.username}</p>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <SimplePermissionGuard key={item.path} permission={item.permission} fallback={null}>
                <li>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full text-right p-3 rounded flex items-center space-x-3 space-x-reverse transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              </SimplePermissionGuard>
            ))}
          </ul>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full text-right p-3 rounded text-gray-300 hover:bg-red-600 hover:text-white transition-colors flex items-center space-x-3 space-x-reverse"
          >
            <span className="text-lg">🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {menuItems.find(item => item.path === location.pathname)?.label || 'الصفحة الرئيسية'}
          </h2>
          <div className="flex items-center space-x-4 space-x-reverse">
            <span className="text-gray-600">مرحباً، {user?.username}</span>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
