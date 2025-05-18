import { supabase } from '@/client';

export type Budget = {
  id?: string;
  nome: string;
  valor: number;
  categoria: string;
  mes: string; // formato: YYYY-MM
  gasto_atual?: number;
  user_id?: string;
};

export const budgetService = {
  // Buscar todos os orçamentos do usuário
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('mes', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar orçamentos:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar orçamentos por mês
  async getByMonth(userId: string, month: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('mes', month)
      .order('categoria', { ascending: true });
    
    if (error) {
      console.error(`Erro ao buscar orçamentos do mês ${month}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Criar um novo orçamento
  async create(budget: Budget) {
    const { data, error } = await supabase
      .from('budgets')
      .insert(budget)
      .select();
    
    if (error) {
      console.error('Erro ao criar orçamento:', error);
      throw error;
    }
    
    return data?.[0];
  },
  
  // Atualizar um orçamento existente
  async update(id: string, budget: Budget, userId: string) {
    const { data, error } = await supabase
      .from('budgets')
      .update(budget)
      .eq('id', id)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      console.error('Erro ao atualizar orçamento:', error);
      throw error;
    }
    
    return data?.[0];
  },
  
  // Excluir um orçamento
  async delete(id: string, userId: string) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Erro ao excluir orçamento:', error);
      throw error;
    }
    
    return true;
  },
  
  // Calcular gastos atuais para cada orçamento
  async calculateCurrentSpending(userId: string, month: string) {
    // Primeiro, buscar todos os orçamentos do mês
    const { data: budgets, error: budgetsError } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('mes', month);
    
    if (budgetsError) {
      console.error('Erro ao buscar orçamentos para cálculo:', budgetsError);
      throw budgetsError;
    }
    
    if (!budgets || budgets.length === 0) {
      return [];
    }
    
    // Extrair ano e mês do formato YYYY-MM
    const [year, monthNum] = month.split('-');
    const startDate = `${year}-${monthNum}-01`;
    const lastDay = new Date(parseInt(year), parseInt(monthNum), 0).getDate();
    const endDate = `${year}-${monthNum}-${lastDay}`;
    
    // Buscar todas as transações do mês
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('tipo', 'despesa')
      .gte('data', startDate)
      .lte('data', endDate);
    
    if (transactionsError) {
      console.error('Erro ao buscar transações para cálculo de orçamento:', transactionsError);
      throw transactionsError;
    }
    
    // Calcular gastos por categoria
    const spendingByCategory: Record<string, number> = {};
    
    transactions?.forEach(transaction => {
      if (!spendingByCategory[transaction.categoria]) {
        spendingByCategory[transaction.categoria] = 0;
      }
      spendingByCategory[transaction.categoria] += transaction.valor;
    });
    
    // Atualizar orçamentos com gastos atuais
    const updatedBudgets = budgets.map(budget => {
      const gastoAtual = spendingByCategory[budget.categoria] || 0;
      return {
        ...budget,
        gasto_atual: gastoAtual
      };
    });
    
    // Atualizar no banco de dados
    for (const budget of updatedBudgets) {
      await supabase
        .from('budgets')
        .update({ gasto_atual: budget.gasto_atual })
        .eq('id', budget.id)
        .eq('user_id', userId);
    }
    
    return updatedBudgets;
  }
};
