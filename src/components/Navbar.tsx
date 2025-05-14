import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggleButton } from "@/components/ThemeToggleButton";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const openLoginModal = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
    closeMenu();
  };
  
  const openSignupModal = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
    closeMenu();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    closeMenu();
  };

  const isDashboard = location.pathname.startsWith('/dashboard'); // Verifica se a rota começa com /dashboard

  return (
    <nav className="bg-background shadow-md sticky top-0 z-50 text-foreground py-3">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" aria-label="Página Inicial Dinhero Esperto">
          <span className="font-bold text-2xl sm:text-3xl bg-clip-text text-transparent hero-gradient">DinheroEsperto</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-x-5 lg:gap-x-6">
          <Link to="/#features" className="text-sm lg:text-base hover:text-primary transition-colors duration-200">
            Funcionalidades
          </Link>
          <Link to="/#pricing" className="text-sm lg:text-base hover:text-primary transition-colors duration-200">
            Planos
          </Link>
          <Link to="/#testimonials" className="text-sm lg:text-base hover:text-primary transition-colors duration-200">
            Depoimentos
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3 lg:gap-4">
              {isDashboard ? (
                <Link to="/">
                  <Button variant="outline" size="sm" className="text-sm">Página Inicial</Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="text-sm">Meu Painel</Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-sm">Sair</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 lg:gap-4">
              <Button variant="outline" size="sm" onClick={openLoginModal} className="text-sm">Entrar</Button>
              <Button size="sm" onClick={openSignupModal} className="text-sm">Começar Grátis</Button>
            </div>
          )}
          <ThemeToggleButton />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggleButton />
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border py-4 absolute w-full shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
            <Link to="/#features" className="py-2 text-sm hover:text-primary transition-colors duration-200" onClick={closeMenu}>
              Funcionalidades
            </Link>
            <Link to="/#pricing" className="py-2 text-sm hover:text-primary transition-colors duration-200" onClick={closeMenu}>
              Planos
            </Link>
            <Link to="/#testimonials" className="py-2 text-sm hover:text-primary transition-colors duration-200" onClick={closeMenu}>
              Depoimentos
            </Link>
            
            <hr className="border-border my-2" />

            {isAuthenticated ? (
              <>
                {isDashboard ? (
                  <Link to="/" onClick={closeMenu}>
                    <Button className="w-full text-sm" variant="outline">Página Inicial</Button>
                  </Link>
                ) : (
                  <Link to="/dashboard" onClick={closeMenu}>
                    <Button className="w-full text-sm" variant="outline">Meu Painel</Button>
                  </Link>
                )}
                <Button className="w-full text-sm" variant="ghost" onClick={handleLogout}>Sair</Button>
              </>
            ) : (
              <>
                <Button className="w-full text-sm" variant="outline" onClick={openLoginModal}>
                  Entrar
                </Button>
                <Button className="w-full text-sm" onClick={openSignupModal}>
                  Começar Grátis
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authMode} 
      />
    </nav>
  );
};

export default Navbar;

