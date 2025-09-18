// src/pages/Auth/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, Building2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema } from './loginSchema';
import type { LoginFormData } from './loginSchema';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginFormData) => login(credentials),
    onSuccess: () => {
      toast.success('تم تسجيل الدخول بنجاح!');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-right">نظام إدارة المزادات</h1>
          <p className="text-gray-600 text-right">يرجى تسجيل الدخول للمتابعة</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-semibold text-gray-900 text-right">تسجيل الدخول</CardTitle>
              <CardDescription className="text-gray-500 text-right">أدخل بياناتك للوصول إلى النظام</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Username Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="username" className="text-right block text-sm font-medium text-gray-700">
                    اسم المستخدم
                  </Label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                    <Input
                      {...register('username')}
                      id="username"
                      type="text"
                      autoComplete="username"
                      className={`pl-10 pr-4 text-right ${errors.username ? 'border-red-300 focus:ring-red-500' : ''}`}
                      placeholder="أدخل اسم المستخدم"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const passwordField = document.getElementById('password') as HTMLInputElement;
                          if (passwordField) passwordField.focus();
                        }
                      }}
                    />
                  </div>
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm text-right flex items-center justify-end"
                    >
                      {errors.username.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-right block text-sm font-medium text-gray-700">
                    كلمة المرور
                  </Label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input
                      {...register('password')}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className={`pl-10 pr-12 text-right ${errors.password ? 'border-red-300 focus:ring-red-500' : ''}`}
                      placeholder="أدخل كلمة المرور"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSubmit(onSubmit)();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm text-right flex items-center justify-end"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loginMutation.isPending ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري تسجيل الدخول...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Lock className="w-5 h-5" />
                        <span>تسجيل الدخول</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-center pt-4 border-t"
              >
                <p className="text-sm text-gray-500 text-right">
                  نظام إدارة شامل للمزادات والفروع
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <h3 className="text-sm font-medium text-blue-900 mb-2 text-right">بيانات تجريبية:</h3>
          <div className="text-xs text-blue-800 space-y-1 text-right">
            <p><strong>مدير:</strong> admin / admin123</p>
            <p><strong>مستخدم محدود:</strong> not admin / 123123</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
