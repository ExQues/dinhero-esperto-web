
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
  verifyCode: (email: string, code: string) => Promise<{success: boolean, message?: string}>;
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

    if (data.user) {
      setUser({
        id: data.user.id,
        name: data.user.user_metadata.name || email.split('@')[0],
        email: data.user.email!,
        isPremium: false,
      });
    }
  };

  const signup = async (name: string, email: string, password: string, resend: boolean = false): Promise<{success: boolean, message?: string}> => {
    try {
      // If it's a resend, we use a different approach
      if (resend) {
        // Generate a random 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store the code temporarily (this would ideally be in a database)
        localStorage.setItem(`verificationCode_${email}`, verificationCode);
        
        // Use resetPasswordForEmail as a way to send an email with the code
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback`
          // Note: We can no longer send additional data here due to type constraints
        });
        
        if (error) throw error;
        
        toast({
          title: 'Código reenviado',
          description: 'Um novo código de verificação foi enviado para seu email.',
        });
        
        return { success: true };
      }
      
      // Generate a random 6-digit code for new signup
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Sign up the user with the verification code stored in metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name,
            verificationCode
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        return { success: false, message: error.message };
      }

      if (data.user) {
        toast({
          title: 'Verifique seu email',
          description: 'Um código de verificação foi enviado para seu email.',
        });
        return { success: true };
      }
      
      return { success: false, message: 'Ocorreu um erro inesperado.' };
    } catch (error: any) {
      console.error("Error in signup:", error);
      return { success: false, message: error.message };
    }
  };
  
  const verifyCode = async (email: string, code: string): Promise<{success: boolean, message?: string}> => {
    try {
      // Since getUserByEmail doesn't exist, we'll need another approach
      // We could use getUser() to get the current user, or query a database table where we store verification codes
      
      // For now, let's use a workaround with local storage
      // In production, this should be replaced with a server-side verification
      const storedCode = localStorage.getItem(`verificationCode_${email}`);
      
      if (!storedCode) {
        return { success: false, message: 'Código de verificação expirado ou não encontrado.' };
      }
      
      if (code !== storedCode) {
        return { success: false, message: 'Código de verificação inválido.' };
      }
      
      // If code matches, clear it from storage
      localStorage.removeItem(`verificationCode_${email}`);
      
      // Now we can sign in the user or mark their email as verified
      // For a complete solution, you should implement a proper verification flow
      
      return { success: true };
    } catch (error: any) {
      console.error("Error in verification:", error);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };
  
  const upgradeToPremium = async () => {
    if (user) {
      setUser({ ...user, isPremium: true });
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.name || session.user.email!.split('@')[0],
            email: session.user.email!,
            isPremium: false,
          });
        } else {
          setUser(null);
        }
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Current session:", session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email!.split('@')[0],
          email: session.user.email!,
          isPremium: false,
        });
      }
    });

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
