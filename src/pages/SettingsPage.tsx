import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  LogOut, 
  Moon, 
  Sun, 
  Smartphone,
  Mail,
  Save,
  Upload
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Navigate } from 'react-router-dom';

const SettingsPage = () => {
  const { isAuthenticated, user, isPremium } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Estados para formulários
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Usuário',
    email: user?.email || 'usuario@email.com',
    phone: '(11) 98765-4321',
    bio: 'Profissional de finanças pessoais apaixonado por organização e planejamento financeiro.'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    budgetAlerts: true,
    weeklyReports: true,
    marketingEmails: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: '30'
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSecurityChange = (setting, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta</p>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 space-y-2">
          <Button 
            variant={activeTab === 'profile' ? 'default' : 'ghost'} 
            className="w-full justify-start" 
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-4 w-4 mr-2" />
            Perfil
          </Button>
          <Button 
            variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
            className="w-full justify-start" 
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </Button>
          <Button 
            variant={activeTab === 'security' ? 'default' : 'ghost'} 
            className="w-full justify-start" 
            onClick={() => setActiveTab('security')}
          >
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </Button>
          <Button 
            variant={activeTab === 'appearance' ? 'default' : 'ghost'} 
            className="w-full justify-start" 
            onClick={() => setActiveTab('appearance')}
          >
            <Moon className="h-4 w-4 mr-2" />
            Aparência
          </Button>
          {isPremium && (
            <Button 
              variant={activeTab === 'billing' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveTab('billing')}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Assinatura
            </Button>
          )}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <div className="flex-1">
          {/* Perfil */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>Atualize suas informações pessoais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-xl bg-primary/20 text-primary">
                        {profileForm.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar Foto
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={profileForm.name} 
                          onChange={handleProfileChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={profileForm.email} 
                          onChange={handleProfileChange} 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={profileForm.phone} 
                          onChange={handleProfileChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Moeda Padrão</Label>
                        <Select defaultValue="BRL">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a moeda" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                            <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Sobre Você</Label>
                      <Textarea 
                        id="bio" 
                        name="bio" 
                        value={profileForm.bio} 
                        onChange={handleProfileChange} 
                        rows={4} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Notificações */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>Controle como e quando você recebe notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Canais de Notificação</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="emailNotifications">Notificações por Email</Label>
                      </div>
                      <Switch 
                        id="emailNotifications" 
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="pushNotifications">Notificações Push</Label>
                      </div>
                      <Switch 
                        id="pushNotifications" 
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tipos de Notificação</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="transactionAlerts" className="font-medium">Alertas de Transação</Label>
                        <p className="text-sm text-muted-foreground">Receba alertas sobre novas transações</p>
                      </div>
                      <Switch 
                        id="transactionAlerts" 
                        checked={notificationSettings.transactionAlerts}
                        onCheckedChange={() => handleNotificationToggle('transactionAlerts')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="budgetAlerts" className="font-medium">Alertas de Orçamento</Label>
                        <p className="text-sm text-muted-foreground">Receba alertas quando se aproximar dos limites de orçamento</p>
                      </div>
                      <Switch 
                        id="budgetAlerts" 
                        checked={notificationSettings.budgetAlerts}
                        onCheckedChange={() => handleNotificationToggle('budgetAlerts')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weeklyReports" className="font-medium">Relatórios Semanais</Label>
                        <p className="text-sm text-muted-foreground">Receba um resumo semanal das suas finanças</p>
                      </div>
                      <Switch 
                        id="weeklyReports" 
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={() => handleNotificationToggle('weeklyReports')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketingEmails" className="font-medium">Emails de Marketing</Label>
                        <p className="text-sm text-muted-foreground">Receba dicas, promoções e novidades</p>
                      </div>
                      <Switch 
                        id="marketingEmails" 
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Preferências
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Segurança */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>Gerencie as configurações de segurança da sua conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactorAuth" className="font-medium">Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança à sua conta</p>
                    </div>
                    <Switch 
                      id="twoFactorAuth" 
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="loginNotifications" className="font-medium">Notificações de Login</Label>
                      <p className="text-sm text-muted-foreground">Receba alertas quando sua conta for acessada</p>
                    </div>
                    <Switch 
                      id="loginNotifications" 
                      checked={securitySettings.loginNotifications}
                      onCheckedChange={(checked) => handleSecurityChange('loginNotifications', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout" className="font-medium">Tempo Limite da Sessão</Label>
                    <p className="text-sm text-muted-foreground mb-2">Defina quanto tempo sua sessão permanece ativa sem atividade</p>
                    <Select 
                      value={securitySettings.sessionTimeout}
                      onValueChange={(value) => handleSecurityChange('sessionTimeout', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tempo limite" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alterar Senha</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Redefinir</Button>
                <Button className="bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Aparência */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>Personalize a aparência do aplicativo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card 
                      className={`border cursor-pointer ${theme === 'light' ? 'border-primary ring-2 ring-primary' : ''}`}
                      onClick={() => setTheme('light')}
                    >
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="w-full h-24 bg-white border rounded-md mb-4 flex items-center justify-center">
                          <Sun className="h-8 w-8 text-amber-500" />
                        </div>
                        <p className="font-medium">Claro</p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`border cursor-pointer ${theme === 'dark' ? 'border-primary ring-2 ring-primary' : ''}`}
                      onClick={() => setTheme('dark')}
                    >
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="w-full h-24 bg-slate-900 border rounded-md mb-4 flex items-center justify-center">
                          <Moon className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="font-medium">Escuro</p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`border cursor-pointer ${theme === 'system' ? 'border-primary ring-2 ring-primary' : ''}`}
                      onClick={() => setTheme('system')}
                    >
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="w-full h-24 bg-gradient-to-r from-white to-slate-900 border rounded-md mb-4 flex items-center justify-center">
                          <div className="flex">
                            <Sun className="h-8 w-8 text-amber-500" />
                            <Moon className="h-8 w-8 text-slate-400" />
                          </div>
                        </div>
                        <p className="font-medium">Sistema</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferências de Exibição</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="compactMode" className="font-medium">Modo Compacto</Label>
                        <p className="text-sm text-muted-foreground">Reduz o espaçamento entre elementos</p>
                      </div>
                      <Switch id="compactMode" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="animationsEnabled" className="font-medium">Animações</Label>
                        <p className="text-sm text-muted-foreground">Ativa ou desativa animações na interface</p>
                      </div>
                      <Switch id="animationsEnabled" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Preferências
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Assinatura (Premium) */}
          {activeTab === 'billing' && isPremium && (
            <Card>
              <CardHeader>
                <CardTitle>Assinatura Premium</CardTitle>
                <CardDescription>Gerencie sua assinatura e métodos de pagamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-primary">Plano Premium Ativo</h3>
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">Ativo</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Sua próxima cobrança será em 15/06/2025</p>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">R$ 29,90 / mês</p>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      Gerenciar Plano
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Método de Pagamento</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expira em 12/2026</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Histórico de Pagamentos</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Data</th>
                          <th className="text-left py-3 px-4 font-medium">Descrição</th>
                          <th className="text-right py-3 px-4 font-medium">Valor</th>
                          <th className="text-right py-3 px-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-muted/20">
                          <td className="py-3 px-4">15/05/2025</td>
                          <td className="py-3 px-4">Assinatura Premium - Mensal</td>
                          <td className="py-3 px-4 text-right">R$ 29,90</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-300">Pago</Badge>
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-muted/20">
                          <td className="py-3 px-4">15/04/2025</td>
                          <td className="py-3 px-4">Assinatura Premium - Mensal</td>
                          <td className="py-3 px-4 text-right">R$ 29,90</td>
                          <td className="py-3 px-4 text-right">
                            <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-300">Pago</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                  Cancelar Assinatura
                </Button>
                <Button variant="outline">
                  Baixar Recibos
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
