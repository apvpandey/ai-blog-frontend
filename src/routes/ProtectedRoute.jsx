import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Protects routes that require a logged-in user
export function UserProtectedRoute({ children }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" replace />;
  return children;
}

// Protects routes that require admin access
export function AdminProtectedRoute({ children }) {
  const { isAdmin } = useApp();
  if (!isAdmin) return <Navigate to="/admin-login" replace />;
  return children;
}
