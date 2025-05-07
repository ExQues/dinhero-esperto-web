import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
// import { toast } from '@/components/ui/use-toast'; // Toast é tratado no AuthModal

type User = {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string, resend?: boolean) => Promise<{success: boolean, message?: string}>;
  verifyCode: (email: string, token: string) => Promise<{success: boolean, message?: string}>; // 'code' renomeado para 'token' para clareza com verifyOtp
  upgradeToPremium: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // O estado do usuário será atualizado pelo onAuthStateChange
    // if (data.user) {
    //   setUser({
    //     id: data.user.id,
    //     name: data.user.user_metadata.name || email.split('@')[0],
    //     email: data.user.email!,
    //     isPremium: false, // TODO: Fetch this from DB via onAuthStateChange
    //   });
    // }
  };

  const signup = async (name: string, email: string, password: string, resend: boolean = false): Promise<{success: boolean, message?: string}> => {
    try {
      if (resend) {
        const { error } = await supabase.auth.resend({
          type: 'signup', // Garanta que este tipo corresponda à configuração do seu projeto Supabase
          email: email,
        });
        
        if (error) {
            console.error("Resend error:", error);
            return { success: false, message: error.message };
        }
        return { success: true };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name, // Salvar o nome em user_metadata durante o signup
          },
          // emailRedirectTo é importante se você quiser que o usuário confirme clicando em um link.
          // Se você está usando apenas OTP digitável, isso pode ser opcional ou apontar para uma página genérica.
          emailRedirectTo: `${window.location.origin}/auth/callback`, 
        },
      });

      if (error) {
        console.error("Signup error:", error);
        return { success: false, message: error.message };
      }

      // O sucesso aqui significa que o processo de signup foi iniciado (e.g., email de confirmação enviado).
      // O AuthModal.tsx já lida com o toast para o usuário.
      return { success: true };
    } catch (error: any) {
      console.error("Error in signup:", error);
      return { success: false, message: error.message };
    }
  };
  
  const verifyCode = async (email: string, token: string): Promise<{success: boolean, message?: string}> => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup', // Este tipo deve corresponder ao tipo de OTP enviado (ex: 'signup', 'email_change')
      });
      
      if (error) {
        console.error("Verification OTP error:", error);
        return { success: false, message: error.message };
      }
      
      // Se a verificação for bem-sucedida, data.user e data.session não serão nulos.
      // O usuário é considerado verificado e logado.
      // O onAuthStateChange deve capturar essa mudança e atualizar o estado do 'user'.
      if (data.user && data.session) {
        return { success: true };
      }
      
      return { success: false, message: 'Falha ao verificar o código OTP. Dados de usuário ou sessão não retornados.' };

    } catch (error: any) {
      console.error("Error in OTP verification:", error);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // setUser(null); // onAuthStateChange cuidará disso
  };
  
  const upgradeToPremium = async () => {
    // Esta função deve, na realidade, chamar uma API (ex: Supabase Edge Function)
    // para processar o pagamento e atualizar o status do usuário no banco de dados.
    if (user) {
      console.log("Simulando upgrade para premium. Implementar lógica de backend.");
      // Exemplo: setUser({ ...user, isPremium: true }); // Apenas para UI, o real viria do DB
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          // TODO: Idealmente, buscar o perfil completo do usuário do seu banco de dados (ex: tabela 'profiles')
          // para obter informações como 'name' (se não estiver em user_metadata) e 'isPremium'.
          // Exemplo: const { data: profile } = await supabase.from('profiles').select('full_name, is_premium').eq('id', session.user.id).single();
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0], // Priorizar user_metadata.name
            email: session.user.email!,
            isPremium: false, // Substituir por: profile?.is_premium || false,
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isPremium: user?.isPremium || false,
        login,
        logout,
        signup,
        verifyCode,
        upgradeToPremium,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

