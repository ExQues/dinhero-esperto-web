import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  DollarSign, 
  Plus, 
  Filter, 
  Download, 
  Trash2, 
  Edit, 
  Calendar 
} from 'lucide-react';
import { supabase } from '@/client';

// Tipos
type Transacao = {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  data: string;
  recorrente: boolean;
  observacoes?: string;
  user_id?: string;
};

const TransactionsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('mes-atual');
  const [novaTransacao, setNovaTransacao] = useState<Partial<Transacao>>({
    tipo: 'despesa',
    recorrente: false
  });
  const [dialogAberto, setDialogAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [transacaoEditando, setTransacaoEditando] = useState<string | null>(null);
  const [categoriasReceitas, setCategoriasReceitas] = useState<string[]>([]);
  const [categoriasDespesas, setCategoriasDispesas] = useState<string[]>([]);

  // Buscar dados do Supabase
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTransacoes();
      fetchCategorias();
    }
  }, [isAuthenticated, user]);

  const fetchTransacoes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (data) {
        setTransacoes(data as Transacao[]);
      }
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      // Buscar categorias de receitas
      const { data: dataReceitas, error: errorReceitas } = await supabase
        .from('categories')
        .select('name')
        .eq('user_id', user.id)
        .eq('type', 'receita');
      
      if (errorReceitas) throw errorReceitas;
      
      if (dataReceitas) {
        setCategoriasReceitas(dataReceitas.map(cat => cat.name));
      } else {
        // Categorias padrão se não houver dados
        setCategoriasReceitas(['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros']);
      }
      
      // Buscar categorias de despesas
      const { data: dataDespesas, error: errorDespesas } = await supabase
        .from('categories')
        .select('name')
        .eq('user_id', user.id)
        .eq('type', 'despesa');
      
      if (errorDespesas) throw errorDespesas;
      
      if (dataDespesas) {
        setCategoriasDispesas(dataDespesas.map(cat => cat.name));
      } else {
        // Categorias padrão se não houver dados
        setCategoriasDispesas(['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Assinaturas', 'Outros']);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  // Filtrar transações
  const transacoesFiltradas = transacoes.filter(transacao => {
    // Filtro por tipo
    if (filtroTipo !== 'todos' && transacao.tipo !== filtroTipo) return false;
    
    // Filtro por categoria
    if (filtroCategoria !== 'todas' && transacao.categoria !== filtroCategoria) return false;
    
    // Filtro por período
    const dataTransacao = new Date(transacao.data);
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const inicioAno = new Date(hoje.getFullYear(), 0, 1);
    
    if (filtroPeriodo === 'mes-atual' && dataTransacao < inicioMes) return false;
    if (filtroPeriodo === 'ano-atual' && dataTransacao < inicioAno) return false;
    
    return true;
  });

  // Calcular saldo
  const calcularSaldo = () => {
    return transacoesFiltradas.reduce((acc, transacao) => {
      if (transacao.tipo === 'receita') {
        return acc + transacao.valor;
      } else {
        return acc - transacao.valor;
      }
    }, 0);
  };

  // Calcular total de receitas
  const calcularReceitas = () => {
    return transacoesFiltradas
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + t.valor, 0);
  };

  // Calcular total de despesas
  const calcularDespesas = () => {
    return transacoesFiltradas
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + t.valor, 0);
  };

  // Manipular mudanças no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNovaTransacao(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manipular mudanças em selects
  const handleSelectChange = (name: string, value: string) => {
    setNovaTransacao(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Adicionar nova transação
  const adicionarTransacao = async () => {
    if (!novaTransacao.descricao || !novaTransacao.valor || !novaTransacao.categoria || !novaTransacao.data) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const novaTransacaoCompleta: Transacao = {
      id: modoEdicao && transacaoEditando ? transacaoEditando : Date.now().toString(),
      descricao: novaTransacao.descricao || '',
      valor: Number(novaTransacao.valor) || 0,
      tipo: novaTransacao.tipo as 'receita' | 'despesa',
      categoria: novaTransacao.categoria || '',
      data: novaTransacao.data || new Date().toISOString().split('T')[0],
      recorrente: novaTransacao.recorrente || false,
      observacoes: novaTransacao.observacoes,
      user_id: user.id
    };

    try {
      if (modoEdicao && transacaoEditando) {
        // Atualizar transação existente no Supabase
        const { error } = await supabase
          .from('transactions')
          .update(novaTransacaoCompleta)
          .eq('id', transacaoEditando)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Atualizar estado local
        setTransacoes(prev => 
          prev.map(t => t.id === transacaoEditando ? novaTransacaoCompleta : t)
        );
      } else {
        // Adicionar nova transação no Supabase
        const { data, error } = await supabase
          .from('transactions')
          .insert(novaTransacaoCompleta)
          .select();
        
        if (error) throw error;
        
        // Atualizar estado local com o ID gerado pelo Supabase
        if (data && data[0]) {
          setTransacoes(prev => [...prev, data[0] as Transacao]);
        }
      }

      // Resetar formulário e fechar diálogo
      setNovaTransacao({
        tipo: 'despesa',
        recorrente: false
      });
      setDialogAberto(false);
      setModoEdicao(false);
      setTransacaoEditando(null);
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      alert('Ocorreu um erro ao salvar a transação. Por favor, tente novamente.');
    }
  };

  // Editar transação
  const editarTransacao = (id: string) => {
    const transacao = transacoes.find(t => t.id === id);
    if (transacao) {
      setNovaTransacao({ ...transacao });
      setModoEdicao(true);
      setTransacaoEditando(id);
      setDialogAberto(true);
    }
  };

  // Excluir transação
  const excluirTransacao = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        // Excluir do Supabase
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Atualizar estado local
        setTransacoes(prev => prev.filter(t => t.id !== id));
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
        alert('Ocorreu um erro ao excluir a transação. Por favor, tente novamente.');
      }
    }
  };

  // Formatar valor para exibição
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transações</h1>
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setNovaTransacao({
                  tipo: 'despesa',
                  recorrente: false,
                  data: new Date().toISOString().split('T')[0]
                });
                setModoEdicao(false);
                setTransacaoEditando(null);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{modoEdicao ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da transação abaixo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tipo" className="text-right">
                  Tipo
                </Label>
                <Select 
                  value={novaTransacao.tipo} 
                  onValueChange={(value) => handleSelectChange('tipo', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descricao" className="text-right">
                  Descrição
                </Label>
                <Input
                  id="descricao"
                  name="descricao"
                  value={novaTransacao.descricao || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valor" className="text-right">
                  Valor
                </Label>
                <Input
                  id="valor"
                  name="valor"
                  type="number"
                  step="0.01"
                  value={novaTransacao.valor || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoria" className="text-right">
                  Categoria
                </Label>
                <Select 
                  value={novaTransacao.categoria} 
                  onValueChange={(value) => handleSelectChange('categoria', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {novaTransacao.tipo === 'receita' 
                      ? categoriasReceitas.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))
                      : categoriasDespesas.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="data" className="text-right">
                  Data
                </Label>
                <Input
                  id="data"
                  name="data"
                  type="date"
                  value={novaTransacao.data || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recorrente" className="text-right">
                  Recorrente
                </Label>
                <div className="col-span-3 flex items-center">
                  <input
                    id="recorrente"
                    name="recorrente"
                    type="checkbox"
                    checked={novaTransacao.recorrente || false}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <Label htmlFor="recorrente">Esta é uma transação recorrente</Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="observacoes" className="text-right">
                  Observações
                </Label>
                <Input
                  id="observacoes"
                  name="observacoes"
                  value={novaTransacao.observacoes || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={adicionarTransacao}>
                {modoEdicao ? 'Salvar Alterações' : 'Adicionar Transação'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${calcularSaldo() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatarValor(calcularSaldo())}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Baseado nos filtros atuais
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatarValor(calcularReceitas())}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de entradas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatarValor(calcularDespesas())}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de saídas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre suas transações por tipo, categoria e período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filtroTipo">Tipo</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="receita">Receitas</SelectItem>
                  <SelectItem value="despesa">Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filtroCategoria">Categoria</Label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {filtroTipo === 'receita' || filtroTipo === 'todos' 
                    ? categoriasReceitas.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))
                    : null
                  }
                  {filtroTipo === 'despesa' || filtroTipo === 'todos' 
                    ? categoriasDespesas.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))
                    : null
                  }
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filtroPeriodo">Período</Label>
              <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes-atual">Mês Atual</SelectItem>
                  <SelectItem value="ano-atual">Ano Atual</SelectItem>
                  <SelectItem value="todos">Todo o Período</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de transações */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Suas Transações</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : transacoesFiltradas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoesFiltradas.map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell className="font-medium">{transacao.descricao}</TableCell>
                    <TableCell>{transacao.data}</TableCell>
                    <TableCell>{transacao.categoria}</TableCell>
                    <TableCell className={`text-right ${transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                      {transacao.tipo === 'receita' ? '+' : '-'}{formatarValor(transacao.valor)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => editarTransacao(transacao.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => excluirTransacao(transacao.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhuma transação encontrada</h3>
              <p className="text-muted-foreground mt-1">
                Comece adicionando uma nova transação ou ajuste seus filtros.
              </p>
              <Button className="mt-4" onClick={() => setDialogAberto(true)}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Transação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
