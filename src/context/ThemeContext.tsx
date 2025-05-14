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
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ 
  children, 
  defaultTheme = "dark", 
  storageKey = "dinhero-esperto-theme", // Chave de armazenamento unificada e semântica
  ...props 
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Força o tema para 'dark' na primeira carga se nenhuma preferência válida for encontrada ou para garantir o padrão.
    // No entanto, para garantir que o padrão seja SEMPRE escuro na primeira visita após esta atualização,
    // e permitir que o usuário altere depois, vamos inicializar diretamente com 'dark'.
    // A lógica anterior de ler do localStorage na inicialização do estado foi removida para forçar 'dark'.
    return defaultTheme; // defaultTheme aqui será 'dark' conforme App.tsx ou o próprio valor padrão.
  });

  useEffect(() => {
    // Garante que o tema seja 'dark' na montagem inicial se o estado for 'dark'.
    // Isso é um pouco redundante com o useState inicializando para 'dark',
    // mas reforça a intenção e lida com a atualização do localStorage.
    if (theme === "dark") {
      const root = window.document.documentElement;
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem(storageKey, "dark");
    }
  }, [storageKey]); // Executa apenas uma vez na montagem para definir o padrão inicial escuro, se necessário.

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]); // Este useEffect reage às MUDANÇAS de tema pelo usuário.

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
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

