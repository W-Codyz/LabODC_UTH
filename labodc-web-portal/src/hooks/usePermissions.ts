// Permissions Hook
import { useAuth } from './useAuth';
import { hasPermission, canAccessRoute, PERMISSIONS } from '@/utils/permissions';

export const usePermissions = () => {
  const { user } = useAuth();

  const checkPermission = (permission: keyof typeof PERMISSIONS): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  const checkRouteAccess = (routePath: string): boolean => {
    if (!user) return false;
    return canAccessRoute(user.role, routePath);
  };

  return {
    checkPermission,
    checkRouteAccess,
  };
};
