import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Definição do contexto de tema
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Criação do contexto
import { createContext, useContext } from 'react';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook personalizado para usar o tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provedor de tema
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Verificar se há preferência salva no localStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Verificar preferência do sistema
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    // Verificar localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    return savedTheme || systemPreference;
  });

  // Efeito para aplicar a classe ao elemento html
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Função para alternar o tema
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Componente de botão para alternar tema
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
};
