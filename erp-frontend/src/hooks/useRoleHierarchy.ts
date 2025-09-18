// src/hooks/useRoleHierarchy.ts
import { useAuth } from '../contexts/AuthContext';
import { RoleLevel } from '../types';
import type { RoleLevelType } from '../types';

export const useRoleHierarchy = () => {
  const { user } = useAuth();

  const getUserRoleLevel = (): RoleLevelType | null => {
    if (!user?.role?.level) return null;
    return user.role.level;
  };

  const canManageUser = (targetUserRoleLevel: RoleLevelType): boolean => {
    const currentUserLevel = getUserRoleLevel();
    if (!currentUserLevel) return false;

    // المستخدم يمكنه إدارة المستخدمين الذين لديهم مستوى أعلى من مستواه
    // (الأرقام الأصغر = مستوى أعلى)
    return currentUserLevel < targetUserRoleLevel;
  };

  const canManageRole = (targetRoleLevel: RoleLevelType): boolean => {
    const currentUserLevel = getUserRoleLevel();
    if (!currentUserLevel) return false;

    // المستخدم يمكنه إدارة الأدوار التي لها مستوى أعلى من مستواه
    return currentUserLevel < targetRoleLevel;
  };

  const getManageableRoles = (allRoles: Array<{ level: RoleLevelType }>) => {
    const currentUserLevel = getUserRoleLevel();
    if (!currentUserLevel) return [];

    return allRoles.filter(role => canManageRole(role.level));
  };

  const getManageableUsers = (allUsers: Array<{ role?: { level: RoleLevelType } }>) => {
    const currentUserLevel = getUserRoleLevel();
    if (!currentUserLevel) return [];

    return allUsers.filter(user =>
      user.role?.level && canManageUser(user.role.level)
    );
  };

  const isSuperAdmin = (): boolean => {
    return getUserRoleLevel() === RoleLevel.SUPER_ADMIN;
  };

  const isAdmin = (): boolean => {
    return getUserRoleLevel() === RoleLevel.ADMIN;
  };

  const isManager = (): boolean => {
    return getUserRoleLevel() === RoleLevel.MANAGER;
  };

  const getRoleLevelName = (level: RoleLevelType): string => {
    const levelNames = {
      [RoleLevel.SUPER_ADMIN]: 'مدير عام',
      [RoleLevel.ADMIN]: 'مدير',
      [RoleLevel.MANAGER]: 'مدير قسم',
      [RoleLevel.SUPERVISOR]: 'مشرف',
      [RoleLevel.EMPLOYEE]: 'موظف',
      [RoleLevel.GUEST]: 'ضيف'
    };
    return levelNames[level] || 'غير محدد';
  };

  const getCurrentUserRoleName = (): string => {
    const level = getUserRoleLevel();
    return level ? getRoleLevelName(level) : 'غير محدد';
  };

  return {
    getUserRoleLevel,
    canManageUser,
    canManageRole,
    getManageableRoles,
    getManageableUsers,
    isSuperAdmin,
    isAdmin,
    isManager,
    getRoleLevelName,
    getCurrentUserRoleName
  };
};