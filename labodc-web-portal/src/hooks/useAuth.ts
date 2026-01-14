// Custom Auth Hook
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { IUser, TUserRole } from '@/types/user.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const hasRole = (role: TUserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: TUserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    logout: handleLogout,
    hasRole,
    hasAnyRole,
  };
};
