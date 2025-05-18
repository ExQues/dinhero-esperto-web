import { supabase } from '@/client';

export type SharedAccount = {
  id?: string;
  nome: string;
  descricao?: string;
  membros: string[]; // array de user_ids ou emails
  saldo_total: number;
  data_criacao?: string;
  user_id?: string; // criador da conta compartilhada
};

export type SharedTransaction = {
  id?: string;
  shared_account_id: string;
  descricao: string;
  valor: number;
  pagador_id: string; // user_id de quem pagou
  data: string;
  divisao: {
    user_id: string;
    valor: number;
  }[];
  observacoes?: string;
};

export const sharedAccountService = {
  // Buscar todas as contas compartilhadas do usuário
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('shared_accounts')
      .select('*')
      .or(`user_id.eq.${userId},membros.cs.{${userId}}`);
    
    if (error) {
      console.error('Erro ao buscar contas compartilhadas:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar uma conta compartilhada específica
  async getById(id: string, userId: string) {
    const { data, error } = await supabase
      .from('shared_accounts')
      .select('*')
      .eq('id', id)
      .or(`user_id.eq.${userId},membros.cs.{${userId}}`)
      .single();
    
    if (error) {
      console.error('Erro ao buscar conta compartilhada:', error);
      throw error;
    }
    
    return data;
  },
  
  // Criar uma nova conta compartilhada
  async create(account: SharedAccount) {
    if (!account.data_criacao) {
      account.data_criacao = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('shared_accounts')
      .insert(account)
      .select();
    
    if (error) {
      console.error('Erro ao criar conta compartilhada:', error);
      throw error;
    }
    
    return data?.[0];
  },
  
  // Atualizar uma conta compartilhada existente
  async update(id: string, account: SharedAccount, userId: string) {
    const { data, error } = await supabase
      .from('shared_accounts')
      .update(account)
      .eq('id', id)
      .eq('user_id', userId) // Apenas o criador pode atualizar
      .select();
    
    if (error) {
      console.error('Erro ao atualizar conta compartilhada:', error);
      throw error;
    }
    
    return data?.[0];
  },
  
  // Excluir uma conta compartilhada
  async delete(id: string, userId: string) {
    const { error } = await supabase
      .from('shared_accounts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Apenas o criador pode excluir
    
    if (error) {
      console.error('Erro ao excluir conta compartilhada:', error);
      throw error;
    }
    
    return true;
  },
  
  // Adicionar membro a uma conta compartilhada
  async addMember(accountId: string, memberEmail: string, userId: string) {
    // Primeiro, buscar a conta atual
    const { data: account, error: fetchError } = await supabase
      .from('shared_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', userId)
      .single();
    
    if (fetchError) {
      console.error('Erro ao buscar conta para adicionar membro:', fetchError);
      throw fetchError;
    }
    
    if (!account) {
      throw new Error('Conta compartilhada não encontrada ou você não tem permissão');
    }
    
    // Buscar o usuário pelo email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', memberEmail)
      .single();
    
    if (userError && userError.code !== 'PGRST116') { // Ignorar erro de "não encontrado"
      console.error('Erro ao buscar usuário por email:', userError);
      throw userError;
    }
    
    const memberId = userData?.id || memberEmail;
    
    // Verificar se o membro já está na lista
    if (account.membros.includes(memberId)) {
      return account;
    }
    
    // Adicionar o novo membro
    const updatedMembers = [...account.membros, memberId];
    
    // Atualizar a conta
    const { data, error } = await supabase
      .from('shared_accounts')
      .update({ membros: updatedMembers })
      .eq('id', accountId)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      console.error('Erro ao adicionar membro:', error);
      throw error;
    }
    
    return data?.[0];
  },
  
  // Remover membro de uma conta compartilhada
  async removeMember(accountId: string, memberId: string, userId: string) {
    // Primeiro, buscar a conta atual
    const { data: account, error: fetchError } = await supabase
      .from('shared_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', userId)
      .single();
    
    if (fetchError) {
      console.error('Erro ao buscar conta para remover membro:', fetchError);
      throw fetchError;
    }
    
    if (!account) {
      throw new Error('Conta compartilhada não encontrada ou você não tem permissão');
    }
    
    // Remover o membro
    const updatedMembers = account.membros.filter(id => id !== memberId);
    
    // Atualizar a conta
    const { data, error } = await supabase
      .from('shared_accounts')
      .update({ membros: updatedMembers })
      .eq('id', accountId)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      console.error('Erro ao remover membro:', error);
      throw error;
    }
    
    return data?.[0];
  },
  
  // Buscar transações de uma conta compartilhada
  async getTransactions(accountId: string, userId: string) {
    // Verificar se o usuário tem acesso à conta
    const { data: account, error: accountError } = await supabase
      .from('shared_accounts')
      .select('*')
      .eq('id', accountId)
      .or(`user_id.eq.${userId},membros.cs.{${userId}}`)
      .single();
    
    if (accountError) {
      console.error('Erro ao verificar acesso à conta compartilhada:', accountError);
      throw accountError;
    }
    
    if (!account) {
      throw new Error('Conta compartilhada não encontrada ou você não tem acesso');
    }
    
    // Buscar transações
    const { data, error } = await supabase
      .from('shared_transactions')
      .select('*')
      .eq('shared_account_id', accountId)
      .order('data', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar transações compartilhadas:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Adicionar uma transação compartilhada
  async addTransaction(transaction: SharedTransaction, userId: string) {
    // Verificar se o usuário tem acesso à conta
    const { data: account, error: accountError } = await supabase
      .from('shared_accounts')
      .select('*')
      .eq('id', transaction.shared_account_id)
      .or(`user_id.eq.${userId},membros.cs.{${userId}}`)
      .single();
    
    if (accountError) {
      console.error('Erro ao verificar acesso à conta compartilhada:', accountError);
      throw accountError;
    }
    
    if (!account) {
      throw new Error('Conta compartilhada não encontrada ou você não tem acesso');
    }
    
    // Adicionar a transação
    const { data, error } = await supabase
      .from('shared_transactions')
      .insert(transaction)
      .select();
    
    if (error) {
      console.error('Erro ao adicionar transação compartilhada:', error);
      throw error;
    }
    
    // Atualizar o saldo da conta
    const novoSaldo = account.saldo_total + transaction.valor;
    
    await supabase
      .from('shared_accounts')
      .update({ saldo_total: novoSaldo })
      .eq('id', transaction.shared_account_id);
    
    return data?.[0];
  }
};
