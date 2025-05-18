import { supabase } from '@/client';

export type Category = {
  id?: string;
  name: string;
  type: 'receita' | 'despesa';
  color?: string;
  user_id?: string;
};

export const categoryService = {
  // Buscar todas as categorias do usuário
  async getAll(userId: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Buscar categorias por tipo (receita ou despesa)
  async getByType(userId: string, type: 'receita' | 'despesa') {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('name', { ascending: true });
    
    if (error) {
      console.error(`Erro ao buscar categorias do tipo ${type}:`, error);
      throw error;
    }
    
    return data || [];
  },
  
  // Criar uma nova categoria
  async create(category: Category) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select();
    
    if (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
    
    return data?.[0];
  },
  
  // Atualizar uma categoria existente
  async update(id: string, category: Category, userId: string) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
    
    return data?.[0];
  },
  
  // Excluir uma categoria
  async delete(id: string, userId: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Erro ao excluir categoria:', error);
      throw error;
    }
    
    return true;
  },
  
  // Inicializar categorias padrão para um novo usuário
  async initializeDefaultCategories(userId: string) {
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
    
    const { error } = await supabase
      .from('categories')
      .insert(allCategories);
    
    if (error) {
      console.error('Erro ao inicializar categorias padrão:', error);
      throw error;
    }
    
    return true;
  }
};
