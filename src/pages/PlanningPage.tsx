import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, TrendingUp, Plus, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const PlanningPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('calendar');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Dados de exemplo para metas financeiras
  const financialGoals = [
    { 
      id: 1, 
      name: 'Fundo de emergência', 
      targetAmount: 10000, 
      currentAmount: 5840, 
      deadline: '2025-12-31',
      category: 'Poupança',
      color: 'bg-blue-500'
    },
    { 
      id: 2, 
      name: 'Viagem para Europa', 
      targetAmount: 15000, 
      currentAmount: 3500, 
      deadline: '2026-07-15',
      category: 'Lazer',
      color: 'bg-purple-500'
    },
    { 
      id: 3, 
      name: 'Entrada do apartamento', 
      targetAmount: 50000, 
      currentAmount: 12500, 
      deadline: '2027-01-10',
      category: 'Moradia',
      color: 'bg-sky-500'
    },
  ];

  // Dados de exemplo para eventos financeiros no calendário
  const financialEvents = [
    { id: 1, name: 'Pagamento de Aluguel', amount: -800, date: '2025-05-10', category: 'Moradia', type: 'expense' },
    { id: 2, name: 'Recebimento de Salário', amount: 3500, date: '2025-05-15', category: 'Receita', type: 'income' },
    { id: 3, name: 'Pagamento de Internet', amount: -100, date: '2025-05-20', category: 'Utilidades', type: 'expense' },
    { id: 4, name: 'Assinatura Netflix', amount: -45, date: '2025-05-25', category: 'Entretenimento', type: 'expense' },
    { id: 5, name: 'Pagamento de Cartão de Crédito', amount: -1200, date: '2025-06-05', category: 'Dívidas', type: 'expense' },
    { id: 6, name: 'Recebimento de Freelance', amount: 1500, date: '2025-06-10', category: 'Receita', type: 'income' },
  ];

  // Dados de exemplo para projeções financeiras
  const financialProjections = [
    { month: 'Maio 2025', income: 5000, expenses: 3500, savings: 1500 },
    { month: 'Junho 2025', income: 5200, expenses: 3600, savings: 1600 },
    { month: 'Julho 2025', income: 5300, expenses: 3700, savings: 1600 },
    { month: 'Agosto 2025', income: 5400, expenses: 3800, savings: 1600 },
    { month: 'Setembro 2025', income: 5500, expenses: 3900, savings: 1600 },
    { month: 'Outubro 2025', income: 5600, expenses: 4000, savings: 1600 },
  ];

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Planejamento Financeiro</h1>
        <p className="text-muted-foreground">Gerencie suas metas, calendário financeiro e projeções</p>
      </header>

      <Tabs defaultValue="calendar" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Calendário</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Metas</span>
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Projeções</span>
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo da aba Calendário */}
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Calendário Financeiro</CardTitle>
                  <CardDescription>Visualize e gerencie seus eventos financeiros</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Evento
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card border rounded-lg p-4">
                    {/* Aqui entraria um componente de calendário real */}
                    <div className="text-center p-8 border border-dashed rounded-md bg-muted/20">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Visualização de calendário</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Próximos Eventos</h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {financialEvents.map((event) => (
                        <div key={event.id} className="flex justify-between items-center p-3 bg-card border rounded-md hover:bg-muted/20 transition-colors">
                          <div>
                            <p className="font-medium">{event.name}</p>
                            <p className="text-xs text-muted-foreground">{event.date} • {event.category}</p>
                          </div>
                          <div className="flex items-center">
                            <span className={`font-medium ${event.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} mr-4`}>
                              {event.type === 'income' ? '+' : ''}R$ {Math.abs(event.amount).toFixed(2)}
                            </span>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo da aba Metas */}
        <TabsContent value="goals">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Metas Financeiras</CardTitle>
                  <CardDescription>Acompanhe o progresso das suas metas</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Meta
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {financialGoals.map((goal) => (
                    <Card key={goal.id} className="border">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{goal.name}</CardTitle>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription>{goal.category} • Prazo: {goal.deadline}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progresso</span>
                            <span className="font-medium">{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                          </div>
                          <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className={goal.color} />
                          <div className="flex justify-between text-sm pt-2">
                            <span className="text-muted-foreground">R$ {goal.currentAmount.toFixed(2)}</span>
                            <span className="text-muted-foreground">R$ {goal.targetAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                          Adicionar Fundos
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  
                  {/* Card para adicionar nova meta */}
                  <Card className="border border-dashed bg-muted/20 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-muted/30 transition-colors">
                    <Plus className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground font-medium">Adicionar Nova Meta</p>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo da aba Projeções */}
        <TabsContent value="projections">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Projeções Financeiras</CardTitle>
                <CardDescription>Visualize suas projeções de receitas, despesas e economias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Aqui entraria um gráfico de projeções */}
                  <div className="h-[300px] bg-muted/20 rounded-lg border border-dashed flex items-center justify-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground" />
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Mês</th>
                          <th className="text-right py-3 px-4 font-medium">Receitas</th>
                          <th className="text-right py-3 px-4 font-medium">Despesas</th>
                          <th className="text-right py-3 px-4 font-medium">Economia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financialProjections.map((projection, index) => (
                          <tr key={index} className="border-b hover:bg-muted/20">
                            <td className="py-3 px-4">{projection.month}</td>
                            <td className="py-3 px-4 text-right text-green-600 dark:text-green-400">R$ {projection.income.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right text-red-600 dark:text-red-400">R$ {projection.expenses.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400">R$ {projection.savings.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Exportar Dados</Button>
                <Button className="bg-primary hover:bg-primary/90">Atualizar Projeções</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanningPage;
