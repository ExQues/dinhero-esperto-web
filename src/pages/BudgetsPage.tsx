import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  PieChart, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight, 
  AlertTriangle,
  Check,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const BudgetsPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Dados de exemplo para orçamentos
  const budgets = [
    { 
      id: 1, 
      name: 'Moradia', 
      limit: 1200, 
      spent: 800, 
      remaining: 400,
      percentage: 66.7,
      color: 'bg-sky-500',
      transactions: [
        { id: 1, description: 'Aluguel', amount: 700, date: '2025-05-05', category: 'Moradia' },
        { id: 2, description: 'Condomínio', amount: 100, date: '2025-05-10', category: 'Moradia' },
      ]
    },
    { 
      id: 2, 
      name: 'Alimentação', 
      limit: 800, 
      spent: 500, 
      remaining: 300,
      percentage: 62.5,
      color: 'bg-blue-500',
      transactions: [
        { id: 3, description: 'Supermercado', amount: 350, date: '2025-05-08', category: 'Alimentação' },
        { id: 4, description: 'Restaurante', amount: 150, date: '2025-05-15', category: 'Alimentação' },
      ]
    },
    { 
      id: 3, 
      name: 'Transporte', 
      limit: 400, 
      spent: 375, 
      remaining: 25,
      percentage: 93.75,
      color: 'bg-amber-500',
      transactions: [
        { id: 5, description: 'Combustível', amount: 250, date: '2025-05-12', category: 'Transporte' },
        { id: 6, description: 'Estacionamento', amount: 75, date: '2025-05-18', category: 'Transporte' },
        { id: 7, description: 'Uber', amount: 50, date: '2025-05-20', category: 'Transporte' },
      ]
    },
    { 
      id: 4, 
      name: 'Lazer', 
      limit: 300, 
      spent: 250, 
      remaining: 50,
      percentage: 83.3,
      color: 'bg-purple-500',
      transactions: [
        { id: 8, description: 'Cinema', amount: 80, date: '2025-05-14', category: 'Lazer' },
        { id: 9, description: 'Assinatura Streaming', amount: 70, date: '2025-05-16', category: 'Lazer' },
        { id: 10, description: 'Happy Hour', amount: 100, date: '2025-05-22', category: 'Lazer' },
      ]
    },
    { 
      id: 5, 
      name: 'Outros', 
      limit: 700, 
      spent: 625, 
      remaining: 75,
      percentage: 89.3,
      color: 'bg-slate-500',
      transactions: [
        { id: 11, description: 'Presente Aniversário', amount: 200, date: '2025-05-11', category: 'Outros' },
        { id: 12, description: 'Material Escritório', amount: 125, date: '2025-05-19', category: 'Outros' },
        { id: 13, description: 'Assinatura Revista', amount: 50, date: '2025-05-21', category: 'Outros' },
        { id: 14, description: 'Corte de Cabelo', amount: 80, date: '2025-05-23', category: 'Outros' },
        { id: 15, description: 'Farmácia', amount: 170, date: '2025-05-25', category: 'Outros' },
      ]
    },
  ];

  // Dados de exemplo para resumo de orçamento
  const budgetSummary = {
    totalBudget: 3400,
    totalSpent: 2550,
    totalRemaining: 850,
    percentageSpent: 75,
    monthProgress: 80, // Porcentagem do mês que já passou
  };

  // Dados de exemplo para categorias
  const categories = [
    { id: 1, name: 'Moradia', color: 'bg-sky-500' },
    { id: 2, name: 'Alimentação', color: 'bg-blue-500' },
    { id: 3, name: 'Transporte', color: 'bg-amber-500' },
    { id: 4, name: 'Lazer', color: 'bg-purple-500' },
    { id: 5, name: 'Saúde', color: 'bg-green-500' },
    { id: 6, name: 'Educação', color: 'bg-pink-500' },
    { id: 7, name: 'Vestuário', color: 'bg-indigo-500' },
    { id: 8, name: 'Outros', color: 'bg-slate-500' },
  ];

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Orçamentos</h1>
        <p className="text-muted-foreground">Gerencie e acompanhe seus orçamentos por categoria</p>
      </header>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="budgets" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Meus Orçamentos</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Categorias</span>
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo da aba Visão Geral */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Resumo do Orçamento Mensal</CardTitle>
                <CardDescription>Visão geral dos seus orçamentos para este mês</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Orçamento Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">R$ {budgetSummary.totalBudget.toFixed(2)}</div>
                      <p className="text-sm text-muted-foreground">Definido para este mês</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Gasto Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400">R$ {budgetSummary.totalSpent.toFixed(2)}</div>
                      <p className="text-sm text-muted-foreground">
                        {budgetSummary.percentageSpent}% do orçamento utilizado
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Saldo Restante</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">R$ {budgetSummary.totalRemaining.toFixed(2)}</div>
                      <p className="text-sm text-muted-foreground">
                        {100 - budgetSummary.percentageSpent}% do orçamento disponível
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-medium">Progresso do Orçamento</h3>
                      <p className="text-sm text-muted-foreground">
                        {budgetSummary.percentageSpent}% do orçamento utilizado com {budgetSummary.monthProgress}% do mês decorrido
                      </p>
                    </div>
                    <div className="text-sm">
                      {budgetSummary.percentageSpent <= budgetSummary.monthProgress ? (
                        <span className="text-green-600 dark:text-green-400 flex items-center">
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                          Abaixo do esperado
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400 flex items-center">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          Acima do esperado
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Gasto</span>
                      <span>Meta</span>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-800">
                            {budgetSummary.percentageSpent}%
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-800">
                            {budgetSummary.monthProgress}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div style={{ width: `${budgetSummary.percentageSpent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                        <div style={{ width: `${budgetSummary.monthProgress - budgetSummary.percentageSpent > 0 ? budgetSummary.monthProgress - budgetSummary.percentageSpent : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Orçamentos por Categoria</h3>
                  <div className="space-y-4">
                    {budgets.map((budget) => (
                      <div key={budget.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${budget.color}`}></div>
                            <span className="font-medium">{budget.name}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">R$ {budget.spent.toFixed(2)}</span>
                            <span className="mx-1 text-muted-foreground">/</span>
                            <span>R$ {budget.limit.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-full rounded-full ${budget.color} ${budget.percentage > 90 ? 'animate-pulse' : ''}`}
                            style={{ width: `${budget.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {budget.percentage > 90 ? (
                              <span className="text-red-600 dark:text-red-400 flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Quase no limite
                              </span>
                            ) : budget.percentage > 75 ? (
                              <span className="text-amber-600 dark:text-amber-400">
                                {budget.remaining.toFixed(2)} restantes
                              </span>
                            ) : (
                              <span>
                                {budget.remaining.toFixed(2)} restantes
                              </span>
                            )}
                          </span>
                          <span>{budget.percentage.toFixed(1)}% utilizado</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Orçamento
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo da aba Meus Orçamentos */}
        <TabsContent value="budgets">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Meus Orçamentos</CardTitle>
                  <CardDescription>Gerencie seus orçamentos por categoria</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Orçamento
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Input placeholder="Buscar orçamentos..." className="max-w-sm" />
                    <Button variant="outline">Filtrar</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map((budget) => (
                      <Card key={budget.id} className="border">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${budget.color}`}></div>
                              <CardTitle className="text-lg">{budget.name}</CardTitle>
                            </div>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </div>
                          <CardDescription>
                            {budget.transactions.length} transações neste mês
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Progresso</span>
                              <span className="text-sm font-medium">
                                {budget.percentage > 90 ? (
                                  <Badge variant="outline" className="bg-red-500/20 text-red-600 border-red-300">
                                    Crítico
                                  </Badge>
                                ) : budget.percentage > 75 ? (
                                  <Badge variant="outline" className="bg-amber-500/20 text-amber-600 border-amber-300">
                                    Atenção
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-300">
                                    Adequado
                                  </Badge>
                                )}
                              </span>
                            </div>
                            <Progress value={budget.percentage} className={budget.color} />
                            <div className="flex justify-between text-sm">
                              <div>
                                <p className="font-medium">R$ {budget.spent.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">Gasto</p>
                              </div>
                              <div>
                                <p className="font-medium">R$ {budget.remaining.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">Restante</p>
                              </div>
                              <div>
                                <p className="font-medium">R$ {budget.limit.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">Limite</p>
                              </div>
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
                    
                    {/* Card para adicionar novo orçamento */}
                    <Card className="border border-dashed bg-muted/20 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-muted/30 transition-colors">
                      <Plus className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground font-medium">Adicionar Novo Orçamento</p>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo da aba Categorias */}
        <TabsContent value="categories">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Categorias de Despesas</CardTitle>
                  <CardDescription>Gerencie as categorias para seus orçamentos e transações</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Categoria
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Input placeholder="Buscar categorias..." className="max-w-sm" />
                    <Button variant="outline">Filtrar</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-3 ${category.color}`}></div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Card para adicionar nova categoria */}
                    <div className="flex items-center justify-center p-4 border border-dashed rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors">
                      <Plus className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-muted-foreground font-medium">Nova Categoria</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Importar Categorias</Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Gerenciar Subcategorias
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetsPage;
