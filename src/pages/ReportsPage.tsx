import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  BarChart, 
  PieChart, 
  LineChart, 
  Download, 
  Calendar, 
  Filter, 
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Share2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const ReportsPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Dados de exemplo para relatórios
  const overviewData = {
    totalIncome: 3500,
    totalExpenses: 2550,
    totalSavings: 950,
    incomeChange: 5.2, // porcentagem de aumento em relação ao período anterior
    expensesChange: -2.8, // porcentagem de redução em relação ao período anterior
    savingsChange: 12.5, // porcentagem de aumento em relação ao período anterior
  };

  // Dados de exemplo para categorias de despesas
  const expenseCategories = [
    { name: 'Moradia', amount: 800, percentage: 31.4, color: 'bg-sky-500' },
    { name: 'Alimentação', amount: 500, percentage: 19.6, color: 'bg-blue-500' },
    { name: 'Transporte', amount: 375, percentage: 14.7, color: 'bg-amber-500' },
    { name: 'Lazer', amount: 250, percentage: 9.8, color: 'bg-purple-500' },
    { name: 'Outros', amount: 625, percentage: 24.5, color: 'bg-slate-500' },
  ];

  // Dados de exemplo para tendências mensais
  const monthlyTrends = [
    { month: 'Janeiro', income: 3200, expenses: 2400, savings: 800 },
    { month: 'Fevereiro', income: 3300, expenses: 2500, savings: 800 },
    { month: 'Março', income: 3400, expenses: 2600, savings: 800 },
    { month: 'Abril', income: 3450, expenses: 2650, savings: 800 },
    { month: 'Maio', income: 3500, expenses: 2550, savings: 950 },
  ];

  // Dados de exemplo para maiores despesas
  const topExpenses = [
    { description: 'Aluguel', amount: 700, date: '2025-05-05', category: 'Moradia' },
    { description: 'Supermercado', amount: 350, date: '2025-05-08', category: 'Alimentação' },
    { description: 'Presente Aniversário', amount: 200, date: '2025-05-11', category: 'Outros' },
    { description: 'Combustível', amount: 250, date: '2025-05-12', category: 'Transporte' },
    { description: 'Farmácia', amount: 170, date: '2025-05-25', category: 'Outros' },
  ];

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground">Analise suas finanças com relatórios detalhados</p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mês</SelectItem>
            <SelectItem value="quarter">Este Trimestre</SelectItem>
            <SelectItem value="year">Este Ano</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>

        {selectedPeriod === 'custom' && (
          <div className="flex items-center space-x-2">
            <Input type="date" className="w-[150px]" />
            <span>até</span>
            <Input type="date" className="w-[150px]" />
          </div>
        )}

        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Despesas</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Tendências</span>
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Fluxo de Caixa</span>
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo da aba Visão Geral */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Resumo Financeiro</CardTitle>
                <CardDescription>Visão geral das suas finanças para {selectedPeriod === 'month' ? 'este mês' : selectedPeriod === 'week' ? 'esta semana' : selectedPeriod === 'quarter' ? 'este trimestre' : 'este ano'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Receitas</CardTitle>
                        <DollarSign className="h-5 w-5 text-green-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        R$ {overviewData.totalIncome.toFixed(2)}
                      </div>
                      <div className="flex items-center mt-2">
                        {overviewData.incomeChange > 0 ? (
                          <span className="text-green-600 dark:text-green-400 flex items-center text-sm">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            {overviewData.incomeChange}% em relação ao período anterior
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 flex items-center text-sm">
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                            {Math.abs(overviewData.incomeChange)}% em relação ao período anterior
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Despesas</CardTitle>
                        <PieChart className="h-5 w-5 text-red-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                        R$ {overviewData.totalExpenses.toFixed(2)}
                      </div>
                      <div className="flex items-center mt-2">
                        {overviewData.expensesChange < 0 ? (
                          <span className="text-green-600 dark:text-green-400 flex items-center text-sm">
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                            {Math.abs(overviewData.expensesChange)}% em relação ao período anterior
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 flex items-center text-sm">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            {overviewData.expensesChange}% em relação ao período anterior
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Economia</CardTitle>
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        R$ {overviewData.totalSavings.toFixed(2)}
                      </div>
                      <div className="flex items-center mt-2">
                        {overviewData.savingsChange > 0 ? (
                          <span className="text-green-600 dark:text-green-400 flex items-center text-sm">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            {overviewData.savingsChange}% em relação ao período anterior
                          </span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 flex items-center text-sm">
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                            {Math.abs(overviewData.savingsChange)}% em relação ao período anterior
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Distribuição de Despesas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="w-full md:w-1/2 h-[200px] flex items-center justify-center">
                          {/* Aqui entraria um gráfico de pizza real */}
                          <div className="relative w-[180px] h-[180px] rounded-full bg-slate-200 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <PieChart className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div className="absolute" style={{ top: '30px', left: '30px', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--sky-500)' }}></div>
                            <div className="absolute" style={{ top: '50px', left: '100px', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--blue-500)' }}></div>
                            <div className="absolute" style={{ top: '100px', left: '80px', width: '50px', height: '50px', borderRadius: '50%', background: 'var(--amber-500)' }}></div>
                            <div className="absolute" style={{ top: '110px', left: '30px', width: '30px', height: '30px', borderRadius: '50%', background: 'var(--purple-500)' }}></div>
                            <div className="absolute" style={{ top: '70px', left: '20px', width: '55px', height: '55px', borderRadius: '50%', background: 'var(--slate-500)' }}></div>
                          </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-3 mt-4 md:mt-0">
                          {expenseCategories.map((category) => (
                            <div key={category.name} className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${category.color}`}></div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">{category.name}</span>
                                  <span className="text-sm text-muted-foreground">R$ {category.amount.toFixed(2)}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">{category.percentage}%</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Maiores Despesas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topExpenses.map((expense, index) => (
                          <div key={index} className="flex justify-between items-center p-2 hover:bg-muted/20 rounded-md">
                            <div>
                              <p className="font-medium">{expense.description}</p>
                              <p className="text-xs text-muted-foreground">{expense.date} • {expense.category}</p>
                            </div>
                            <span className="font-medium text-red-600 dark:text-red-400">
                              R$ {expense.amount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" className="flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo da aba Despesas */}
        <TabsContent value="expenses">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Análise de Despesas</CardTitle>
                <CardDescription>Análise detalhada das suas despesas por categoria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-[300px] bg-muted/20 rounded-lg border border-dashed flex items-center justify-center">
                  {/* Aqui entraria um gráfico de barras real */}
                  <BarChart className="h-12 w-12 text-muted-foreground" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Despesas por Categoria</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Categoria</th>
                          <th className="text-right py-3 px-4 font-medium">Valor</th>
                          <th className="text-right py-3 px-4 font-medium">% do Total</th>
                          <th className="text-right py-3 px-4 font-medium">Comparação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenseCategories.map((category) => (
                          <tr key={category.name} className="border-b hover:bg-muted/20">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${category.color}`}></div>
                                <span>{category.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">R$ {category.amount.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right">{category.percentage}%</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end">
                                {Math.random() > 0.5 ? (
                                  <span className="text-green-600 dark:text-green-400 flex items-center">
                                    <ArrowDownRight className="h-4 w-4 mr-1" />
                                    {(Math.random() * 10).toFixed(1)}%
                                  </span>
                                ) : (
                                  <span className="text-red-600 dark:text-red-400 flex items-center">
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                    {(Math.random() * 10).toFixed(1)}%
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Ver Detalhes</Button>
                <Button variant="outline" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo da aba Tendências */}
        <TabsContent value="trends">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Tendências Financeiras</CardTitle>
                <CardDescription>Acompanhe a evolução das suas finanças ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-[300px] bg-muted/20 rounded-lg border border-dashed flex items-center justify-center">
                  {/* Aqui entraria um gráfico de linha real */}
                  <LineChart className="h-12 w-12 text-muted-foreground" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Evolução Mensal</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Mês</th>
                          <th className="text-right py-3 px-4 font-medium">Receitas</th>
                          <th className="text-right py-3 px-4 font-medium">Despesas</th>
                          <th className="text-right py-3 px-4 font-medium">Economia</th>
                          <th className="text-right py-3 px-4 font-medium">Taxa de Economia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyTrends.map((month) => (
                          <tr key={month.month} className="border-b hover:bg-muted/20">
                            <td className="py-3 px-4">{month.month}</td>
                            <td className="py-3 px-4 text-right text-green-600 dark:text-green-400">
                              R$ {month.income.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right text-red-600 dark:text-red-400">
                              R$ {month.expenses.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400">
                              R$ {month.savings.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {((month.savings / month.income) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Tendência de Receitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                        <div className="text-lg font-bold">+2.3%</div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Crescimento médio mensal</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Tendência de Despesas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-red-500 mr-2" />
                        <div className="text-lg font-bold">+1.5%</div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Crescimento médio mensal</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Tendência de Economia</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                        <div className="text-lg font-bold">+4.7%</div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Crescimento médio mensal</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Análise Avançada</Button>
                <Button variant="outline" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Dados
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo da aba Fluxo de Caixa */}
        <TabsContent value="cashflow">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Fluxo de Caixa</CardTitle>
                <CardDescription>Visualize o fluxo de entrada e saída de dinheiro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-[300px] bg-muted/20 rounded-lg border border-dashed flex items-center justify-center">
                  {/* Aqui entraria um gráfico de fluxo de caixa real */}
                  <BarChart className="h-12 w-12 text-muted-foreground" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Entradas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-2 bg-green-500/10 rounded-md">
                          <div>
                            <p className="font-medium">Salário</p>
                            <p className="text-xs text-muted-foreground">15/05/2025</p>
                          </div>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            R$ 3.500,00
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-500/10 rounded-md">
                          <div>
                            <p className="font-medium">Freelance</p>
                            <p className="text-xs text-muted-foreground">22/05/2025</p>
                          </div>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            R$ 800,00
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-500/10 rounded-md">
                          <div>
                            <p className="font-medium">Rendimentos</p>
                            <p className="text-xs text-muted-foreground">28/05/2025</p>
                          </div>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            R$ 120,00
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Saídas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-2 bg-red-500/10 rounded-md">
                          <div>
                            <p className="font-medium">Aluguel</p>
                            <p className="text-xs text-muted-foreground">05/05/2025</p>
                          </div>
                          <span className="font-medium text-red-600 dark:text-red-400">
                            R$ 700,00
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-red-500/10 rounded-md">
                          <div>
                            <p className="font-medium">Supermercado</p>
                            <p className="text-xs text-muted-foreground">08/05/2025</p>
                          </div>
                          <span className="font-medium text-red-600 dark:text-red-400">
                            R$ 350,00
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-red-500/10 rounded-md">
                          <div>
                            <p className="font-medium">Combustível</p>
                            <p className="text-xs text-muted-foreground">12/05/2025</p>
                          </div>
                          <span className="font-medium text-red-600 dark:text-red-400">
                            R$ 250,00
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="p-4 border rounded-lg bg-card">
                  <h3 className="font-medium mb-2">Resumo do Fluxo de Caixa</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Entradas</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">R$ 4.420,00</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Saídas</p>
                      <p className="text-xl font-bold text-red-600 dark:text-red-400">R$ 2.550,00</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Saldo Final</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">R$ 1.870,00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Ver Transações</Button>
                <Button variant="outline" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
