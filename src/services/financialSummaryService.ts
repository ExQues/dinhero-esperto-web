import { supabase } from '@/client';

export type FinancialSummary = {
  id?: string;
  user_id: string;
  total_balance: number;
  total_income: number;
  total_expenses: number;
  total_savings: number;
  month: string; // formato YYYY-MM
  last_updated?: string;
};

export const financialSummaryService = {
  // Buscar resumo financeiro do mês atual
  async getCurrentMonthSummary(userId: string) {
    const today = new Date();
    const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    return this.getMonthSummary(userId, month);
  },
  
  // Buscar resumo financeiro de um mês específico
  async getMonthSummary(userId: string, month: string) {
    const { data, error } = await supabase
      .from('financial_summary')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Ignorar erro de "não encontrado"
      console.error('Erro ao buscar resumo financeiro:', error);
      throw error;
    }
    
    if (data) {
      return data;
    }
    
    // Se não encontrou, calcular e criar um novo resumo
    return this.calculateAndCreateSummary(userId, month);
  },
  
  // Calcular e criar um novo resumo financeiro
  async calculateAndCreateSummary(userId: string, month: string) {
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
      .gte('data', startDate)
      .lte('data', endDate);
    
    if (transactionsError) {
      console.error('Erro ao buscar transações para cálculo de resumo:', transactionsError);
      throw transactionsError;
    }
    
    // Calcular totais
    const totalIncome = transactions
      ?.filter(t => t.tipo === 'receita')
      .reduce((sum, t) => sum + t.valor, 0) || 0;
    
    const totalExpenses = transactions
      ?.filter(t => t.tipo === 'despesa')
      .reduce((sum, t) => sum + t.valor, 0) || 0;
    
    const totalBalance = totalIncome - totalExpenses;
    
    // Calcular economia (diferença entre receita e despesa)
    const totalSavings = Math.max(0, totalBalance);
    
    // Criar o resumo financeiro
    const summary: FinancialSummary = {
      user_id: userId,
      total_balance: totalBalance,
      total_income: totalIncome,
      total_expenses: totalExpenses,
      total_savings: totalSavings,
      month: month,
      last_updated: new Date().toISOString()
    };
    
    // Salvar no banco de dados
    const { data, error } = await supabase
      .from('financial_summary')
      .upsert(summary)
      .select();
    
    if (error) {
      console.error('Erro ao salvar resumo financeiro:', error);
      throw error;
    }
    
    return data?.[0];
  },
  
  // Atualizar resumo financeiro
  async updateSummary(userId: string, month: string) {
    return this.calculateAndCreateSummary(userId, month);
  }
};
