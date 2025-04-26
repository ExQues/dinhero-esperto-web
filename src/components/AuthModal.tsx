
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { validatePassword } from '@/utils/passwordValidation';
import { Alert, AlertDescription } from '@/components/ui/alert';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
};

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const validateForm = () => {
    if (mode === 'signup') {
      const { isValid, errors } = validatePassword(password);
      setPasswordErrors(errors);
      
      if (!isValid) return false;
      
      if (password !== confirmPassword) {
        setPasswordErrors(['As senhas não conferem']);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        await login(email, password);
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Bem-vindo de volta ao DinheroEsperto.',
        });
        onClose();
      } else {
        await signup(name, email, password);
        setShowVerification(true);
        toast({
          title: 'Código de verificação enviado!',
          description: 'Por favor, verifique seu email e insira o código de verificação.',
        });
      }
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (mode === 'signup') {
      const { errors } = validatePassword(newPassword);
      setPasswordErrors(errors);
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
        
        {showVerification ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Código de Verificação</Label>
              <Input 
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Digite o código recebido por email"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              Verificar Código
            </Button>
          </form>
        ) : (
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
                onChange={handlePasswordChange}
                placeholder="******" 
                required 
              />
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="******" 
                  required 
                />
              </div>
            )}
            
            {passwordErrors.length > 0 && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
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
                    onClick={() => setMode('signup')}
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
                    onClick={() => setMode('login')}
                  >
                    Entrar
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
