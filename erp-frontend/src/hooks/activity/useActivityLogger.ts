// src/hooks/activity/useActivityLogger.ts
import { useCallback } from 'react';
import { ActivityAction, ActivityResource } from '../../types/activity';
import type { ActivityActionType, ActivityResourceType } from '../../types/activity';

interface LogActivityParams {
  action: ActivityActionType;
  resource: ActivityResourceType;
  resourceId?: number;
  details?: string;
}

export const useActivityLogger = () => {
  const logActivity = useCallback(async (params: LogActivityParams) => {
    try {
      // In a real app, this would make an API call
      const activityData = {
        ...params,
        timestamp: new Date().toISOString(),
        // Additional data would be gathered from the current session
      };

      console.log('Activity logged:', activityData);

      // Simulate API call
      // await apiClient.post('/activities', activityData);

    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }, []);

  const logUserAction = useCallback((action: ActivityActionType, resourceId?: number, details?: string) => {
    logActivity({
      action,
      resource: ActivityResource.USER,
      resourceId,
      details
    });
  }, [logActivity]);

  const logRoleAction = useCallback((action: ActivityActionType, resourceId?: number, details?: string) => {
    logActivity({
      action,
      resource: ActivityResource.ROLE,
      resourceId,
      details
    });
  }, [logActivity]);

  const logBranchAction = useCallback((action: ActivityActionType, resourceId?: number, details?: string) => {
    logActivity({
      action,
      resource: ActivityResource.BRANCH,
      resourceId,
      details
    });
  }, [logActivity]);

  const logAuthAction = useCallback((action: ActivityActionType, details?: string) => {
    logActivity({
      action,
      resource: ActivityResource.AUTH,
      details
    });
  }, [logActivity]);

  const logPermissionAction = useCallback((action: ActivityActionType, resourceId?: number, details?: string) => {
    logActivity({
      action,
      resource: ActivityResource.PERMISSION,
      resourceId,
      details
    });
  }, [logActivity]);

  return {
    logActivity,
    logUserAction,
    logRoleAction,
    logBranchAction,
    logAuthAction,
    logPermissionAction
  };
};