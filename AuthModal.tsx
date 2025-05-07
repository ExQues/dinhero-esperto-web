import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { validatePassword } from '@/utils/passwordValidation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const [emailSent, setEmailSent] = useState(false); // Mantido para lógica de reenvio
  const [verificationState, setVerificationState] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login, signup, verifyCode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      // Resetar campos e erros para uma experiência limpa ao reabrir
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setPasswordErrors([]);
      setErrorMessage('');
      setShowVerification(false);
      // setEmailSent(false); // Decidir se deve resetar, pode ser útil manter para UI de reenvio
      setVerificationCode('');
      setVerificationState('idle');
      setIsLoading(false); // Garantir que o loading seja resetado
    }
  }, [initialMode, isOpen]);

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
    setErrorMessage('');
    
    try {
      if (mode === 'login') {
        await login(email, password);
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Bem-vindo de volta ao DinheroEsperto.',
        });
        onClose();
        navigate('/dashboard');
      } else {
        const { success, message } = await signup(name, email, password);
        if (success) {
          setShowVerification(true);
          setEmailSent(true);
          toast({
            title: 'Código de verificação enviado!',
            description: 'Por favor, verifique seu email e insira o código de verificação.',
          });
        } else {
          setErrorMessage(message || 'Ocorreu um erro ao processar sua solicitação.');
          // throw new Error(message); // Não precisa mais lançar, o toast já é mostrado abaixo
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || errorMessage || 'Ocorreu um erro ao processar sua solicitação.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setErrorMessage('O código deve conter 6 dígitos.');
      return;
    }

    setVerificationState('verifying');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const { success, message } = await verifyCode(email, verificationCode);
      if (success) {
        setVerificationState('success');
        toast({
          title: 'Email verificado com sucesso!',
          description: 'Sua conta foi ativada. Você pode fazer login agora.',
        });
        setTimeout(() => {
          onClose(); // Fechar o modal após sucesso
          // setMode('login'); // Não precisa mais, o modal será fechado
          // setShowVerification(false);
          // setVerificationState('idle');
          // setVerificationCode('');
        }, 1500);
      } else {
        setVerificationState('error');
        setErrorMessage(message || 'Código de verificação inválido.');
        toast({
          variant: 'destructive',
          title: 'Erro de verificação',
          description: message || 'Código de verificação inválido.',
        });
      }
    } catch (error: any) {
      setVerificationState('error');
      setErrorMessage(error.message || 'Ocorreu um erro ao verificar o código.');
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao verificar o código.',
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

  const handleResendCode = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      // Para reenviar, precisamos garantir que o usuário já tentou o signup uma vez.
      // A função signup no AuthContext foi ajustada para lidar com o reenvio.
      const { success, message } = await signup(name, email, password, true);
      if (success) {
        setEmailSent(true); // Manter o estado para UI
        toast({
          title: 'Código reenviado!',
          description: 'Um novo código de verificação foi enviado para o seu email.',
        });
      } else {
        setErrorMessage(message || 'Erro ao reenviar o código de verificação.');
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: message || 'Erro ao reenviar o código de verificação.',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao reenviar o código de verificação.',
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
            {showVerification ? 'Verificar Email' : mode === 'login' ? 'Entrar na sua conta' : 'Criar uma nova conta'}
          </DialogTitle>
          <DialogDescription>
            {showVerification 
              ? 'Digite o código de verificação de 6 dígitos enviado para seu email.' 
              : mode === 'login' 
                ? 'Entre com seu email e senha para acessar sua conta.'
                : 'Preencha os campos abaixo para criar sua conta gratuitamente.'}
          </DialogDescription>
        </DialogHeader>
        
        {showVerification ? (
          <form onSubmit={handleVerifyCode} className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <p className="text-sm text-center text-gray-600">
                  Enviamos um código de verificação para
                  <br />
                  <span className="font-medium">{email}</span>
                </p>
                
                <div className="flex justify-center my-4">
                  <InputOTP 
                    value={verificationCode} 
                    onChange={setVerificationCode} 
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                {errorMessage && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
            
            <div className="pt-2 space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={verificationCode.length !== 6 || verificationState === 'verifying' || verificationState === 'success' || isLoading}
              >
                {isLoading && verificationState === 'verifying' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando
                  </>
                ) : verificationState === 'success' ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Verificado
                  </>
                ) : (
                  'Verificar Código'
                )}
              </Button>
              
              <div className="text-center text-sm">
                <p className="text-gray-600">
                  Não recebeu o código?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline focus:outline-none"
                    onClick={handleResendCode}
                    disabled={isLoading}
                  >
                    Reenviar
                  </button>
                </p>
              </div>
              
              <div className="text-center text-sm">
                <button
                  type="button"
                  className="text-primary hover:underline focus:outline-none"
                  onClick={() => {
                    // Ao voltar para login, resetar estados específicos da verificação
                    setShowVerification(false);
                    setVerificationCode('');
                    setVerificationState('idle');
                    setErrorMessage('');
                    setMode('login');
                  }}
                >
                  Voltar para login
                </button>
              </div>
            </div>
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
            
            {errorMessage && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
                </>
              ) : mode === 'login' ? 'Entrar' : 'Criar Conta'}
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

