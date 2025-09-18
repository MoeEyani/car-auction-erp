// src/hooks/activity/useActivities.ts
import { useQuery } from '@tanstack/react-query';
import type { ActivityLog, ActivityStats } from '../../types/activity';

export const useActivities = (page = 1, limit = 20) => {
  return useQuery<ActivityLog[]>({
    queryKey: ['activities', { page, limit }],
    queryFn: async () => {
      // In a real app, this would make an API call
      // const response = await apiClient.get('/activities', { params: { page, limit } });
      // return response.data;

      // Mock data for now
      return [
        {
          id: 1,
          userId: 1,
          user: { id: 1, username: 'admin', fullName: 'المدير العام' },
          action: 'LOGIN',
          resource: 'AUTH',
          details: 'تم تسجيل الدخول بنجاح',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          userId: 1,
          user: { id: 1, username: 'admin', fullName: 'المدير العام' },
          action: 'CREATE',
          resource: 'USER',
          resourceId: 2,
          details: 'تم إنشاء مستخدم جديد: أحمد محمد',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useActivityStats = () => {
  return useQuery<ActivityStats>({
    queryKey: ['activity-stats'],
    queryFn: async () => {
      // In a real app, this would make an API call
      // const response = await apiClient.get('/activities/stats');
      // return response.data;

      // Mock data for now
      return {
        totalActivities: 150,
        todayActivities: 12,
        recentActivities: [],
        activitiesByAction: {
          LOGIN: 45,
          CREATE: 23,
          UPDATE: 34,
          DELETE: 8,
          VIEW: 40,
          LOGOUT: 12,
          PERMISSION_CHANGE: 5,
          ROLE_CHANGE: 8,
          PASSWORD_CHANGE: 3,
          FAILED_LOGIN: 2
        },
        activitiesByResource: {
          USER: 50,
          ROLE: 30,
          BRANCH: 25,
          PERMISSION: 15,
          AUTH: 30,
          SYSTEM: 0
        }
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};