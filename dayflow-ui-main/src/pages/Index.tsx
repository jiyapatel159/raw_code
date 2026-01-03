import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Index page redirects based on auth state
const Index = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;
