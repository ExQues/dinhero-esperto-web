import { supabase } from '@/client';

export type Transaction = {
  id?: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  data: string;
  recorrente: boolean;
  observacoes?: string;
  user_id?: string;
};

export const transactionService = {
  // Buscar todas as transações do usuário
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar uma transação específica
  async getById(id: string, userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Erro ao buscar transação:', error);
      throw error;
    }
    
    return data;
  },
  
  // Criar uma nova transação
  async create(transaction: Transaction) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select();
    
    if (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
    
    return data?.[0];
  },
  
  // Atualizar uma transação existente
  async update(id: string, transaction: Transaction, userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
    
    return data?.[0];
  },
  
  // Excluir uma transação
  async delete(id: string, userId: string) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Erro ao excluir transação:', error);
      throw error;
    }
    
    return true;
  },
  
  // Buscar transações por período
  async getByPeriod(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('data', startDate)
      .lte('data', endDate)
      .order('data', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar transações por período:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar resumo financeiro (total de receitas, despesas e saldo)
  async getFinancialSummary(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);
    
    if (startDate) {
      query = query.gte('data', startDate);
    }
    
    if (endDate) {
      query = query.lte('data', endDate);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar resumo financeiro:', error);
      throw error;
    }
    
    // Calcular totais
    const receitas = data?.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0) || 0;
    const despesas = data?.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0) || 0;
    const saldo = receitas - despesas;
    
    return {
      receitas,
      despesas,
      saldo
    };
  }
};
