// src/pages/Auth/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema } from './loginSchema';
import type { LoginFormData } from './loginSchema';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ 
    resolver: zodResolver(loginSchema) 
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginFormData) => login(credentials),
    onSuccess: () => {
      toast.success('تم تسجيل الدخول بنجاح!');
      navigate('/dashboard'); // Navigate to a default protected page
    },
    onError: () => {
      toast.error('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">تسجيل الدخول</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="username">اسم المستخدم</label>
            <input 
              {...register('username')} 
              id="username" 
              className="w-full p-2 border rounded mt-1" 
              autoFocus 
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="password">كلمة المرور</label>
            <input 
              type="password" 
              {...register('password')} 
              id="password" 
              className="w-full p-2 border rounded mt-1" 
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <button 
            type="submit" 
            disabled={loginMutation.isPending} 
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loginMutation.isPending ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
