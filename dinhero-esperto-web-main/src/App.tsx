import { useState } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme, ThemeToggle } from './context/ThemeContext';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import TransactionsPage from './pages/TransactionsPage';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './components/Dashboard';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  
  return (
    <div className={`app ${theme}`}>
      <div className="theme-toggle-container absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/transactions" 
          element={isAuthenticated ? <TransactionsPage /> : <Navigate to="/" replace />} 
        />
        {/* Redirecionar rotas não implementadas para o dashboard */}
        <Route path="/budgets" element={<Navigate to="/dashboard" replace />} />
        <Route path="/reports" element={<Navigate to="/dashboard" replace />} />
        <Route path="/planning" element={<Navigate to="/dashboard" replace />} />
        <Route path="/shared" element={<Navigate to="/dashboard" replace />} />
        <Route path="/inventory" element={<Navigate to="/dashboard" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard" replace />} />
        <Route path="/pricing" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster />
    </div>
  );
}

export default App;
