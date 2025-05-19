import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/client';
import { authService, User } from '@/services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isPremium: boolean;
  isLoading: boolean;
  loginError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isPremium: false,
  isLoading: true,
  loginError: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar autenticação atual
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          
          // Verificar se o usuário é premium (implementar lógica real)
          // Por enquanto, vamos considerar todos como não premium
          setIsPremium(false);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsPremium(false);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setUser(null);
        setIsAuthenticated(false);
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            setIsAuthenticated(true);
            
            // Verificar status premium
            setIsPremium(false); // Implementar lógica real
          } catch (error) {
            console.error('Erro ao obter usuário após login:', error);
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setIsPremium(false);
      }
    });

    checkAuth();

    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoginError(null);
    try {
      // Verificar se as variáveis de ambiente estão definidas
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Configuração do Supabase incompleta. Entre em contato com o administrador.');
      }
      
      await authService.login(email, password);
      // A atualização do estado será feita pelo listener onAuthStateChange
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      // Tratamento de erros específicos
      if (error.message?.includes('Invalid login credentials')) {
        setLoginError('Email ou senha incorretos');
      } else if (error.message?.includes('Email not confirmed')) {
        setLoginError('Email não confirmado. Verifique sua caixa de entrada');
      } else if (error.message?.includes('network')) {
        setLoginError('Erro de conexão. Verifique sua internet');
      } else {
        setLoginError(error.message || 'Erro ao fazer login. Tente novamente');
      }
      
      throw error;
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      await authService.register(email, password, name);
      // A atualização do estado será feita pelo listener onAuthStateChange
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      
      // Tratamento de erros específicos
      if (error.message?.includes('already registered')) {
        throw new Error('Este email já está registrado');
      } else if (error.message?.includes('network')) {
        throw new Error('Erro de conexão. Verifique sua internet');
      } else {
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      // A atualização do estado será feita pelo listener onAuthStateChange
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const updateProfile = async (data: { name?: string; avatar_url?: string }) => {
    if (!user) throw new Error('Usuário não autenticado');
    
    try {
      await authService.updateProfile(user.id, data);
      
      // Atualizar estado local
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          name: data.name || prev.name,
          avatar_url: data.avatar_url || prev.avatar_url
        };
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    isPremium,
    isLoading,
    loginError,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
