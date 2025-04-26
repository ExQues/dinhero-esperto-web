
import { createContext, useContext, useState, ReactNode } from 'react';

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
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
  upgradeToPremium: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login functionality
    const mockUser = {
      id: '123',
      name: email.split('@')[0],
      email,
      isPremium: false,
    };
    
    setUser(mockUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup functionality
    const mockUser = {
      id: '123',
      name,
      email,
      isPremium: false,
    };
    
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };
  
  const upgradeToPremium = async () => {
    if (user) {
      setUser({ ...user, isPremium: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isPremium: user?.isPremium || false,
        login,
        logout,
        signup,
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
