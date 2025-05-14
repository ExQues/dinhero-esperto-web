import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./components/Dashboard";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AuthCallback from "./pages/AuthCallback";
import TransactionsPage from "./pages/TransactionsPage";
import { ThemeToggleButton } from "./components/ThemeToggleButton";
import PlaceholderPage from "./components/PlaceholderPage"; // Importar a página placeholder
import Sidebar from "./components/Sidebar"; // Importar Sidebar para o layout do painel

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Layout para as páginas do Dashboard que incluem a Sidebar
const DashboardLayout = () => (
  <div className="min-h-screen flex bg-background text-foreground">
    <Sidebar />
    <main className="ml-[70px] md:ml-[250px] flex-grow p-4 md:p-6 lg:p-8 overflow-auto">
      {/* O ThemeToggleButton foi movido para dentro do Dashboard ou Sidebar se necessário lá */}
      {/* Ou pode ser global se estiver fora do AuthProvider/ThemeProvider específico do painel */}
      <Outlet /> {/* Conteúdo da rota aninhada será renderizado aqui */}
    </main>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* ThemeProvider agora envolve toda a aplicação para consistência */}
        <ThemeProvider defaultTheme="dark" storageKey="dinhero-esperto-theme">
          <AuthProvider>
            {/* Div global para o tema escuro e min-h-screen */}
            {/* A classe dark:bg-blue-950 foi removida daqui para ser controlada pelo ThemeProvider no html tag */}
            <div className="min-h-screen bg-background text-foreground">
              {/* Botão de tema global, se necessário fora do painel */}
              {/* <div className="absolute top-4 right-4 z-50">
                <ThemeToggleButton />
              </div> */}
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  
                  {/* Rotas do Dashboard com Layout específico */}
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} /> {/* Página principal do dashboard */}
                    <Route path="transactions" element={<TransactionsPage />} />
                    <Route path="budgets" element={<PlaceholderPage title="Orçamentos" />} />
                    <Route path="reports" element={<PlaceholderPage title="Relatórios" />} />
                    <Route path="planning" element={<PlaceholderPage title="Planejamento" />} />
                    <Route path="shared" element={<PlaceholderPage title="Contas Compartilhadas" />} />
                    <Route path="inventory" element={<PlaceholderPage title="Estoque" />} /> {/* Adicionar verificação de premium aqui se necessário */}
                    <Route path="settings" element={<PlaceholderPage title="Configurações" />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

