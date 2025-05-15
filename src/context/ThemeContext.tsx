import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isSystemDark: boolean; // Adicionado para rastrear preferência do sistema
};

const initialState: ThemeProviderState = {
  theme: "dark", 
  setTheme: () => null,
  isSystemDark: false, // Inicializado como falso
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ 
  children, 
  defaultTheme = "dark", 
  storageKey = "dinhero-esperto-theme",
  ...props 
}: ThemeProviderProps) {
  const [isSystemDark, setIsSystemDark] = useState(false);

  useEffect(() => {
    // Verifica a preferência do sistema apenas no cliente
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsSystemDark(mediaQuery.matches);
      // Opcional: ouvir mudanças na preferência do sistema
      // mediaQuery.addEventListener('change', (e) => setIsSystemDark(e.matches));
      // return () => mediaQuery.removeEventListener('change', (e) => setIsSystemDark(e.matches));
    }
  }, []);

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
        if (storedTheme) {
          return storedTheme;
        }
        // Se não houver tema armazenado, usa defaultTheme. 
        // A classe no HTML será aplicada no useEffect abaixo.
        return defaultTheme;
      }
      return defaultTheme; // Fallback para SSR ou ambientes sem window
    } catch (e) {
      return defaultTheme;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      try {
        localStorage.setItem(storageKey, theme);
      } catch (e) {
        console.error("Failed to set theme in localStorage", e);
      }
    }
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
    isSystemDark, // Expor a preferência do sistema
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

