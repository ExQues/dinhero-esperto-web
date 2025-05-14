import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { BarChart, PieChart, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { isAuthenticated, user, isPremium } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  const balanceData = {
    total: 5840,
    income: 3500,
    expenses: 1250,
    savings: 1090,
  };
  
  const expenseCategories = [
    { name: 'Moradia', amount: 800, percentage: 30, color: 'bg-money' },
    { name: 'Alimentação', amount: 500, percentage: 20, color: 'bg-finance' },
    { name: 'Transporte', amount: 375, percentage: 15, color: 'bg-amber-500' },
    { name: 'Lazer', amount: 250, percentage: 10, color: 'bg-purple-500' },
    { name: 'Outros', amount: 625, percentage: 25, color: 'bg-gray-500' },
  ];
  
  const upcomingTransactions = [
    { id: 1, name: 'Aluguel', amount: -800, date: '2025-05-10', category: 'Moradia' },
    { id: 2, name: 'Salário', amount: 3500, date: '2025-05-15', category: 'Receita' },
    { id: 3, name: 'Internet', amount: -100, date: '2025-05-20', category: 'Utilidades' },
    { id: 4, name: 'Assinatura Netflix', amount: -45, date: '2025-05-25', category: 'Entretenimento' },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      
      <div className="ml-[250px] w-[calc(100%-250px)] p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Bem-vindo de volta, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-300">Aqui está um resumo das suas finanças</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {balanceData.total.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Atualizado hoje</p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Receitas</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-money">R$ {balanceData.income.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Despesas</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">R$ {balanceData.expenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Economia</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">R$ {balanceData.savings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Este mês</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dark:text-gray-200">Distribuição de Despesas</CardTitle>
              <CardDescription className="dark:text-gray-400">Como você tem gasto seu dinheiro este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseCategories.map((category) => (
                  <div key={category.name} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">R$ {category.amount.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 dark:bg-gray-800 rounded-full mt-1">
                        <div
                          className={`h-full rounded-full ${category.color}`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{category.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 dark:border-blue-600">Ver Detalhes</Button>
            </CardFooter>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dark:text-gray-200">Próximas Transações</CardTitle>
              <CardDescription className="dark:text-gray-400">Transações agendadas para os próximos dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-2 hover:bg-gray-800/60 dark:hover:bg-blue-900/30 rounded-md">
                    <div>
                      <p className="font-medium">{transaction.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date} • {transaction.category}</p>
                    </div>
                    <span className={`font-medium ${transaction.amount > 0 ? 'text-money' : 'text-red-500'}`}>
                      {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 dark:border-blue-600">Ver Todas Transações</Button>
            </CardFooter>
          </Card>
        </div>
        
        {isPremium && (
          <Card className="mt-6 bg-gray-800/30 dark:bg-blue-900/50 border-gray-700 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="dark:text-gray-200">Recursos Premium Ativados</CardTitle>
              <CardDescription className="dark:text-gray-400">Você tem acesso a todos os recursos avançados</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 dark:bg-blue-950 p-4 rounded-md shadow-sm border-gray-700 dark:border-blue-800">
                <h3 className="font-medium mb-2">Gestão de Estoque</h3>
                <p className="text-sm text-gray-400 dark:text-gray-300">Controle seu inventário e monitore vendas em tempo real.</p>
                <Button variant="outline" size="sm" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-800 dark:hover:bg-blue-700 dark:border-blue-700">Acessar Estoque</Button>
              </div>
              <div className="bg-gray-800 dark:bg-blue-950 p-4 rounded-md shadow-sm border-gray-700 dark:border-blue-800">
                <h3 className="font-medium mb-2">Relatórios Avançados</h3>
                <p className="text-sm text-gray-400 dark:text-gray-300">Análises detalhadas e exportação de dados para seu negócio.</p>
                <Button variant="outline" size="sm" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-800 dark:hover:bg-blue-700 dark:border-blue-700">Ver Relatórios</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

