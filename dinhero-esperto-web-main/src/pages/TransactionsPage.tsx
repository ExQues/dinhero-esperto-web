
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const TransactionsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If authenticated, redirect to dashboard after a short delay
    if (isAuthenticated) {
      const redirectTimeout = setTimeout(() => {
        navigate('/dashboard');
      }, 100);
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [isAuthenticated, navigate]);
  
  // If not authenticated, redirect to home
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="ml-3">Redirecionando para o Dashboard...</p>
    </div>
  );
};

export default TransactionsPage;
