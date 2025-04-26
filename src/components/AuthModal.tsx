
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
};

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        await login(email, password);
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Bem-vindo de volta ao DinheroEsperto.',
        });
      } else {
        await signup(name, email, password);
        toast({
          title: 'Conta criada com sucesso!',
          description: 'Bem-vindo ao DinheroEsperto.',
        });
      }
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro ao processar sua solicitação.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Entrar na sua conta' : 'Criar uma nova conta'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? 'Entre com seu email e senha para acessar sua conta.'
              : 'Preencha os campos abaixo para criar sua conta gratuitamente.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo" 
                required 
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******" 
              required 
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </Button>
          
          <div className="text-center text-sm">
            {mode === 'login' ? (
              <p>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  className="text-primary hover:underline focus:outline-none"
                  onClick={toggleMode}
                >
                  Criar uma conta
                </button>
              </p>
            ) : (
              <p>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  className="text-primary hover:underline focus:outline-none"
                  onClick={toggleMode}
                >
                  Entrar
                </button>
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
