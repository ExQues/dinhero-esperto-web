import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { BarChart, PieChart, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/client';

const Dashboard = () => {
  const { isAuthenticated, user, isPremium } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para dados reais
  const [balanceData, setBalanceData] = useState({
    total: 0,
    income: 0,
    expenses: 0,
    savings: 0,
  });
  
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [upcomingTransactions, setUpcomingTransactions] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Buscar saldo e resumo financeiro
      const { data: balanceData, error: balanceError } = await supabase
        .from('financial_summary')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (balanceError) throw balanceError;
      
      if (balanceData) {
        setBalanceData({
          total: balanceData.total_balance || 0,
          income: balanceData.total_income || 0,
          expenses: balanceData.total_expenses || 0,
          savings: balanceData.total_savings || 0,
        });
      }
      
      // Buscar categorias de despesas
      const { data: categories, error: categoriesError } = await supabase
        .from('expense_categories')
        .select('*')
        .eq('user_id', user.id);
      
      if (categoriesError) throw categoriesError;
      
      if (categories && categories.length > 0) {
        setExpenseCategories(categories.map(cat => ({
          name: cat.name,
          amount: cat.amount,
          percentage: cat.percentage,
          color: cat.color || 'bg-slate-500'
        })));
      }
      
      // Buscar próximas transações
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);
      
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', today.toISOString().split('T')[0])
        .lte('date', nextMonth.toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(5);
      
      if (transactionsError) throw transactionsError;
      
      if (transactions) {
        setUpcomingTransactions(transactions);
      }
      
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <main 
        className={cn(
          "flex-grow p-6 transition-all duration-300",
          sidebarCollapsed ? "ml-[70px]" : "ml-[250px]"
        )}
      >
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Bem-vindo de volta, {user?.name || 'Usuário'}!</h1>
          <p className="text-muted-foreground">Aqui está um resumo das suas finanças</p>
        </header>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-card text-card-foreground border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {balanceData.total.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Atualizado hoje</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card text-card-foreground border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">R$ {balanceData.income.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Este mês</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card text-card-foreground border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">R$ {balanceData.expenses.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Este mês</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card text-card-foreground border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Economia</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">R$ {balanceData.savings.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Este mês</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Distribuição de Despesas e Próximas Transações */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card text-card-foreground border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Distribuição de Despesas</CardTitle>
                  <CardDescription className="text-muted-foreground">Como você tem gasto seu dinheiro este mês</CardDescription>
                </CardHeader>
                <CardContent>
                  {expenseCategories.length > 0 ? (
                    <div className="space-y-4">
                      {expenseCategories.map((category) => (
                        <div key={category.name} className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-foreground">{category.name}</span>
                              <span className="text-sm text-muted-foreground">R$ {category.amount.toFixed(2)}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
                              <div
                                className={`h-full rounded-full ${category.color}`}
                                style={{ width: `${category.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="ml-2 text-xs text-muted-foreground">{category.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhuma despesa registrada neste mês.</p>
                      <Button variant="outline" className="mt-4">Adicionar Despesa</Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">Ver Detalhes</Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-card text-card-foreground border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Próximas Transações</CardTitle>
                  <CardDescription className="text-muted-foreground">Transações agendadas para os próximos dias</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingTransactions.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex justify-between items-center p-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-md">
                          <div>
                            <p className="font-medium text-foreground">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date} • {transaction.category}</p>
                          </div>
                          <span className={`font-medium ${transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhuma transação agendada para os próximos dias.</p>
                      <Button variant="outline" className="mt-4">Agendar Transação</Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">Ver Todas Transações</Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Seção Premium */}
            {isPremium && (
              <Card className="mt-6 bg-card text-card-foreground border-primary/50">
                <CardHeader>
                  <CardTitle className="text-primary">Recursos Premium Ativados</CardTitle>
                  <CardDescription className="text-muted-foreground">Você tem acesso a todos os recursos avançados</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background/50 dark:bg-slate-800/50 p-4 rounded-md shadow-sm border-border">
                    <h3 className="font-medium mb-2 text-foreground">Gestão de Estoque</h3>
                    <p className="text-sm text-muted-foreground">Controle seu inventário e monitore vendas em tempo real.</p>
                    <Button variant="outline" size="sm" className="mt-4 border-primary text-primary hover:bg-primary/10">Acessar Estoque</Button>
                  </div>
                  <div className="bg-background/50 dark:bg-slate-800/50 p-4 rounded-md shadow-sm border-border">
                    <h3 className="font-medium mb-2 text-foreground">Relatórios Avançados</h3>
                    <p className="text-sm text-muted-foreground">Análises detalhadas e exportação de dados para seu negócio.</p>
                    <Button variant="outline" size="sm" className="mt-4 border-primary text-primary hover:bg-primary/10">Ver Relatórios</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
