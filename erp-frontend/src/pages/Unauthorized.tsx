// src/pages/Unauthorized.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UnauthorizedProps {
  requiredPermission?: string;
  message?: string;
}

export const UnauthorizedPage: React.FC<UnauthorizedProps> = ({
  requiredPermission,
  message
}) => {
  const { user } = useAuth();

  const defaultMessage = requiredPermission 
    ? `عذراً، ليس لديك الصلاحية "${requiredPermission}" للوصول إلى هذه الصفحة.`
    : 'عذراً، ليس لديك الصلاحية للوصول إلى هذه الصفحة.';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m0 0v2m0-2h2m-2 0H10m12-8V9a4 4 0 00-4-4H6a4 4 0 00-4 4v2m16 0v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6m16 0H4"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">
            الوصول مرفوض
          </h2>

          {/* Message */}
          <div className="text-center text-gray-600 mb-6">
            <p className="text-sm leading-relaxed">
              {message || defaultMessage}
            </p>
            <p className="text-xs mt-2 text-gray-500">
              إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع مدير النظام.
            </p>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">معلومات المستخدم:</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-medium">الاسم:</span> {user.fullName}</p>
                <p><span className="font-medium">اسم المستخدم:</span> {user.username}</p>
                <p><span className="font-medium">الدور:</span> {user.role?.name || 'غير محدد'}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              العودة للصفحة السابقة
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              الذهاب إلى لوحة التحكم
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              هل تحتاج مساعدة؟ 
              <br />
              <span className="font-medium">تواصل مع الدعم التقني</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};