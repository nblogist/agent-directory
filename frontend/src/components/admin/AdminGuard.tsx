import { Navigate, Outlet } from 'react-router-dom';
import { useAdminStore } from '../../lib/adminStore';

export function AdminGuard() {
  const token = useAdminStore((s) => s.token);
  if (!token) {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
}
