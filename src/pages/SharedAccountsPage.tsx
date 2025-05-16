import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, DollarSign, PieChart, Plus, ChevronRight, Edit, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const SharedAccountsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('accounts');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Dados de exemplo para contas compartilhadas
  const sharedAccounts = [
    { 
      id: 1, 
      name: 'Apartamento', 
      members: [
        { id: 1, name: 'Você', email: user?.email || 'seu@email.com', avatar: null, isOwner: true },
        { id: 2, name: 'Ana Silva', email: 'ana.silva@email.com', avatar: null },
        { id: 3, name: 'Carlos Mendes', email: 'carlos.mendes@email.com', avatar: null },
      ],
      balance: 1250.00,
      pendingExpenses: 2,
    },
    { 
      id: 2, 
      name: 'Viagem Férias', 
      members: [
        { id: 1, name: 'Você', email: user?.email || 'seu@email.com', avatar: null },
        { id: 4, name: 'Mariana Costa', email: 'mariana.costa@email.com', avatar: null, isOwner: true },
        { id: 5, name: 'Pedro Santos', email: 'pedro.santos@email.com', avatar: null },
      ],
      balance: 3500.00,
      pendingExpenses: 0,
    },
  ];

  // Dados de exemplo para despesas compartilhadas
  const sharedExpenses = [
    { 
      id: 1, 
      description: 'Aluguel Maio', 
      amount: 1800.00, 
      date: '2025-05-05', 
      paidBy: 'Você', 
      account: 'Apartamento',
      category: 'Moradia',
      status: 'settled',
      splits: [
        { member: 'Você', amount: 600.00, status: 'paid' },
        { member: 'Ana Silva', amount: 600.00, status: 'paid' },
        { member: 'Carlos Mendes', amount: 600.00, status: 'paid' },
      ]
    },
    { 
      id: 2, 
      description: 'Conta de Luz', 
      amount: 150.00, 
      date: '2025-05-10', 
      paidBy: 'Ana Silva', 
      account: 'Apartamento',
      category: 'Utilidades',
      status: 'pending',
      splits: [
        { member: 'Você', amount: 50.00, status: 'pending' },
        { member: 'Ana Silva', amount: 50.00, status: 'paid' },
        { member: 'Carlos Mendes', amount: 50.00, status: 'pending' },
      ]
    },
    { 
      id: 3, 
      description: 'Compras Supermercado', 
      amount: 320.00, 
      date: '2025-05-15', 
      paidBy: 'Carlos Mendes', 
      account: 'Apartamento',
      category: 'Alimentação',
      status: 'pending',
      splits: [
        { member: 'Você', amount: 106.67, status: 'pending' },
        { member: 'Ana Silva', amount: 106.67, status: 'pending' },
        { member: 'Carlos Mendes', amount: 106.66, status: 'paid' },
      ]
    },
    { 
      id: 4, 
      description: 'Reserva Hotel', 
      amount: 2100.00, 
      date: '2025-06-20', 
      paidBy: 'Mariana Costa', 
      account: 'Viagem Férias',
      category: 'Hospedagem',
      status: 'settled',
      splits: [
        { member: 'Você', amount: 700.00, status: 'paid' },
        { member: 'Mariana Costa', amount: 700.00, status: 'paid' },
        { member: 'Pedro Santos', amount: 700.00, status: 'paid' },
      ]
    },
  ];

  // Dados de exemplo para convites pendentes
  const pendingInvites = [
    { 
      id: 1, 
      accountName: 'Despesas Escritório', 
      invitedBy: 'Juliana Martins', 
      date: '2025-05-18',
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Contas Compartilhadas</h1>
        <p className="text-muted-foreground">Gerencie despesas compartilhadas com amigos, família ou colegas</p>
      </header>

      <Tabs defaultValue="accounts" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Minhas Contas</span>
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Despesas</span>
          </TabsTrigger>
          <TabsTrigger value="invites" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Convites</span>
            {pendingInvites.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {pendingInvites.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo da aba Minhas Contas */}
        <TabsContent value="accounts">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Minhas Contas Compartilhadas</CardTitle>
                  <CardDescription>Gerencie suas contas e grupos de despesas compartilhadas</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Conta
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sharedAccounts.map((account) => (
                    <Card key={account.id} className="border">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{account.name}</CardTitle>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription>
                          {account.members.length} membros • 
                          {account.pendingExpenses > 0 ? (
                            <span className="text-amber-500"> {account.pendingExpenses} despesas pendentes</span>
                          ) : (
                            <span className="text-green-500"> Tudo em dia</span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Membros:</p>
                            <div className="flex -space-x-2">
                              {account.members.map((member, index) => (
                                <Avatar key={member.id} className={`border-2 border-background ${member.isOwner ? 'ring-2 ring-primary' : ''}`}>
                                  <AvatarFallback className="bg-primary/20 text-primary">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground border-2 border-background">
                                <UserPlus className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Saldo da conta:</p>
                            <p className="text-xl font-semibold">R$ {account.balance.toFixed(2)}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                          Ver Detalhes
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {/* Card para adicionar nova conta */}
                  <Card className="border border-dashed bg-muted/20 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-muted/30 transition-colors">
                    <Plus className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground font-medium">Criar Nova Conta Compartilhada</p>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo da aba Despesas */}
        <TabsContent value="expenses">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Despesas Compartilhadas</CardTitle>
                  <CardDescription>Gerencie e acompanhe suas despesas compartilhadas</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Despesa
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Input placeholder="Buscar despesas..." className="max-w-sm" />
                    <Button variant="outline">Filtrar</Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Descrição</th>
                          <th className="text-left py-3 px-4 font-medium">Conta</th>
                          <th className="text-left py-3 px-4 font-medium">Data</th>
                          <th className="text-left py-3 px-4 font-medium">Pago por</th>
                          <th className="text-right py-3 px-4 font-medium">Valor</th>
                          <th className="text-center py-3 px-4 font-medium">Status</th>
                          <th className="text-right py-3 px-4 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sharedExpenses.map((expense) => (
                          <tr key={expense.id} className="border-b hover:bg-muted/20">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{expense.description}</p>
                                <p className="text-xs text-muted-foreground">{expense.category}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">{expense.account}</td>
                            <td className="py-3 px-4">{expense.date}</td>
                            <td className="py-3 px-4">{expense.paidBy}</td>
                            <td className="py-3 px-4 text-right">R$ {expense.amount.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center">
                                <Badge variant={expense.status === 'settled' ? 'outline' : 'secondary'} className={expense.status === 'settled' ? 'bg-green-500/20 text-green-600 hover:bg-green-500/20' : 'bg-amber-500/20 text-amber-600 hover:bg-amber-500/20'}>
                                  {expense.status === 'settled' ? 'Quitado' : 'Pendente'}
                                </Badge>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-end space-x-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo da aba Convites */}
        <TabsContent value="invites">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Convites Pendentes</CardTitle>
                <CardDescription>Gerencie convites para contas compartilhadas</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingInvites.length > 0 ? (
                  <div className="space-y-4">
                    {pendingInvites.map((invite) => (
                      <div key={invite.id} className="flex justify-between items-center p-4 border rounded-lg bg-card">
                        <div>
                          <p className="font-medium">{invite.accountName}</p>
                          <p className="text-sm text-muted-foreground">
                            Convidado por {invite.invitedBy} em {invite.date}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10">
                            <X className="h-4 w-4 mr-1" />
                            Recusar
                          </Button>
                          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                            <Check className="h-4 w-4 mr-1" />
                            Aceitar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Você não tem convites pendentes</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Convidar Amigos</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SharedAccountsPage;
