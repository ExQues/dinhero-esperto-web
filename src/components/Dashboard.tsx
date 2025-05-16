import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Sidebar from './Sidebar'; // Ajuste o caminho se necessário
import { useAuth } from '@/context/AuthContext';
import { BarChart, PieChart, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';
import { cn } from '@/lib/utils'; // Importar cn

const Dashboard = () => {
  const { isAuthenticated, user, isPremium } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Dados de exemplo (manter como no original)
  const balanceData = {
    total: 5840,
    income: 3500,
    expenses: 1250,
    savings: 1090,
  };
  
  const expenseCategories = [
    { name: 'Moradia', amount: 800, percentage: 30, color: 'bg-sky-500' }, // Ajustado para cores do tema
    { name: 'Alimentação', amount: 500, percentage: 20, color: 'bg-blue-500' },
    { name: 'Transporte', amount: 375, percentage: 15, color: 'bg-amber-500' },
    { name: 'Lazer', amount: 250, percentage: 10, color: 'bg-purple-500' },
    { name: 'Outros', amount: 625, percentage: 25, color: 'bg-slate-500' },
  ];
  
  const upcomingTransactions = [
    { id: 1, name: 'Aluguel', amount: -800, date: '2025-05-10', category: 'Moradia' },
    { id: 2, name: 'Salário', amount: 3500, date: '2025-05-15', category: 'Receita' },
    { id: 3, name: 'Internet', amount: -100, date: '2025-05-20', category: 'Utilidades' },
    { id: 4, name: 'Assinatura Netflix', amount: -45, date: '2025-05-25', category: 'Entretenimento' },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <main 
        className={cn(
          "flex-grow p-6 transition-all duration-300",
          sidebarCollapsed ? "ml-[70px]" : "ml-[250px]"
        )}
      >
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Bem-vindo de volta, {user?.name}!</h1>
          <p className="text-muted-foreground">Aqui está um resumo das suas finanças</p>
        </header>
        
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
              <div className="space-y-4">
                {upcomingTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-2 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-md">
                    <div>
                      <p className="font-medium text-foreground">{transaction.name}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date} • {transaction.category}</p>
                    </div>
                    <span className={`font-medium ${transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
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
      </main>
    </div>
  );
};

export default Dashboard;

