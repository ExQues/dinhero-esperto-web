import { supabase } from '@/client';

export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
};

export const authService = {
  // Obter usuário atual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Buscar perfil do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return {
      id: user.id,
      email: user.email,
      name: profile?.name || user.email?.split('@')[0],
      avatar_url: profile?.avatar_url
    };
  },
  
  // Login com email e senha
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    return data;
  },
  
  // Cadastro com email e senha
  async register(email: string, password: string, name?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });
    
    if (error) throw error;
    
    // Criar perfil do usuário
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        name: name || email.split('@')[0],
        updated_at: new Date()
      });
      
      // Inicializar categorias padrão
      await this.initializeUserData(data.user.id);
    }
    
    return data;
  },
  
  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  // Atualizar perfil do usuário
  async updateProfile(userId: string, data: { name?: string; avatar_url?: string }) {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...data,
        updated_at: new Date()
      });
    
    if (error) throw error;
    
    return true;
  },
  
  // Inicializar dados padrão para um novo usuário
  async initializeUserData(userId: string) {
    try {
      // Inicializar categorias padrão
      const defaultIncomeCategories = [
        { name: 'Salário', type: 'receita', color: 'bg-green-500', user_id: userId },
        { name: 'Freelance', type: 'receita', color: 'bg-emerald-500', user_id: userId },
        { name: 'Investimentos', type: 'receita', color: 'bg-blue-500', user_id: userId },
        { name: 'Vendas', type: 'receita', color: 'bg-indigo-500', user_id: userId },
        { name: 'Outros', type: 'receita', color: 'bg-gray-500', user_id: userId }
      ];
      
      const defaultExpenseCategories = [
        { name: 'Moradia', type: 'despesa', color: 'bg-sky-500', user_id: userId },
        { name: 'Alimentação', type: 'despesa', color: 'bg-blue-500', user_id: userId },
        { name: 'Transporte', type: 'despesa', color: 'bg-amber-500', user_id: userId },
        { name: 'Lazer', type: 'despesa', color: 'bg-purple-500', user_id: userId },
        { name: 'Saúde', type: 'despesa', color: 'bg-red-500', user_id: userId },
        { name: 'Educação', type: 'despesa', color: 'bg-pink-500', user_id: userId },
        { name: 'Assinaturas', type: 'despesa', color: 'bg-violet-500', user_id: userId },
        { name: 'Outros', type: 'despesa', color: 'bg-slate-500', user_id: userId }
      ];
      
      const allCategories = [...defaultIncomeCategories, ...defaultExpenseCategories];
      
      await supabase
        .from('categories')
        .insert(allCategories);
      
      // Inicializar resumo financeiro vazio para o mês atual
      const today = new Date();
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      
      await supabase
        .from('financial_summary')
        .insert({
          user_id: userId,
          total_balance: 0,
          total_income: 0,
          total_expenses: 0,
          total_savings: 0,
          month: currentMonth,
          last_updated: new Date()
        });
      
      return true;
    } catch (error) {
      console.error('Erro ao inicializar dados do usuário:', error);
      return false;
    }
  }
};
