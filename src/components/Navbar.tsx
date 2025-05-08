import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggleButton } from "@/components/ThemeToggleButton"; // Import the theme toggle button

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
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

  return (
    <nav className="bg-background shadow-sm sticky top-0 z-50 text-foreground">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-2xl bg-clip-text text-transparent hero-gradient">DinheroEsperto</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/#features" className="hover:text-primary transition-colors">
            Funcionalidades
          </Link>
          <Link to="/#pricing" className="hover:text-primary transition-colors">
            Planos
          </Link>
          <Link to="/#testimonials" className="hover:text-primary transition-colors">
            Depoimentos
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="outline">Meu Painel</Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>Sair</Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={openLoginModal}>Entrar</Button>
              <Button onClick={openSignupModal}>Começar Grátis</Button>
            </div>
          )}
          <ThemeToggleButton /> {/* Add theme toggle button to desktop menu */}
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggleButton /> {/* Add theme toggle button to mobile menu controls */}
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t py-4">
          <div className="container mx-auto px-6 flex flex-col gap-4">
            <Link to="/#features" className="py-2" onClick={closeMenu}>
              Funcionalidades
            </Link>
            <Link to="/#pricing" className="py-2" onClick={closeMenu}>
              Planos
            </Link>
            <Link to="/#testimonials" className="py-2" onClick={closeMenu}>
              Depoimentos
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={closeMenu}>
                  <Button className="w-full" variant="outline">Meu Painel</Button>
                </Link>
                <Button className="w-full" variant="ghost" onClick={handleLogout}>Sair</Button>
              </>
            ) : (
              <>
                <Button className="w-full" variant="outline" onClick={openLoginModal}>
                  Entrar
                </Button>
                <Button className="w-full" onClick={openSignupModal}>
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

