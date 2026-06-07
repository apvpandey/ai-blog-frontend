import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';


export function UserProtectedRoute({ children }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/welcome" replace />;
  return children;
}

export function AdminProtectedRoute({ children }) {
  const { isAdmin } = useApp();
  if (!isAdmin) return <Navigate to="/admin-login" replace />;
  return children;
}
