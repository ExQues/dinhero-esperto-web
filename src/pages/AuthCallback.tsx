
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error in auth callback:', error);
        setError("Ocorreu um erro durante a autenticação. Por favor, tente novamente.");
        setTimeout(() => {
          navigate('/');
        }, 2000);
        return;
      }

      if (data.session) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {!error ? (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-2xl font-medium mb-2">Autenticando...</h2>
          <p className="text-gray-600">Por favor, aguarde enquanto processamos sua autenticação.</p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-medium mb-2 text-red-500">Erro de Autenticação</h2>
          <p className="text-gray-600">{error}</p>
          <p className="mt-4">Redirecionando para a página inicial...</p>
        </>
      )}
    </div>
  );
};

export default AuthCallback;
