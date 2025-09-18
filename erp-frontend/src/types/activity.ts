// src/types/activity.ts
export interface ActivityLog {
  id: number;
  userId: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
  action: ActivityActionType;
  resource: ActivityResourceType;
  resourceId?: number;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export const ActivityAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VIEW: 'VIEW',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  PERMISSION_CHANGE: 'PERMISSION_CHANGE',
  ROLE_CHANGE: 'ROLE_CHANGE',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  FAILED_LOGIN: 'FAILED_LOGIN'
} as const;

export type ActivityActionType = typeof ActivityAction[keyof typeof ActivityAction];

export const ActivityResource = {
  USER: 'USER',
  ROLE: 'ROLE',
  BRANCH: 'BRANCH',
  PERMISSION: 'PERMISSION',
  SYSTEM: 'SYSTEM',
  AUTH: 'AUTH'
} as const;

export type ActivityResourceType = typeof ActivityResource[keyof typeof ActivityResource];

export interface ActivityStats {
  totalActivities: number;
  todayActivities: number;
  recentActivities: ActivityLog[];
  activitiesByAction: Record<ActivityActionType, number>;
  activitiesByResource: Record<ActivityResourceType, number>;
}