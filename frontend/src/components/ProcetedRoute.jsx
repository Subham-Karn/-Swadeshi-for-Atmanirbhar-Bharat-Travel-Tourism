import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = ({ children  , requiredRoles}) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  if(!user) return <Navigate to="/auth/login" state={{from: location}} replace />;
  if(!requiredRoles.includes(user.role.toLowerCase())) return <Navigate to="/unauthorized" state={{from: location}} replace />;
  return children;
};

export default ProtectedRoute;