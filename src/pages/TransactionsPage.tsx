import React, { useState } from 'react';
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
};

// Dados de exemplo
const categoriasReceitas = [
  'Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros'
];

const categoriasDespesas = [
  'Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 
  'Educação', 'Assinaturas', 'Outros'
];

const transacoesIniciais: Transacao[] = [
  {
    id: '1',
    descricao: 'Salário',
    valor: 3500,
    tipo: 'receita',
    categoria: 'Salário',
    data: '2025-05-05',
    recorrente: true
  },
  {
    id: '2',
    descricao: 'Aluguel',
    valor: 1200,
    tipo: 'despesa',
    categoria: 'Moradia',
    data: '2025-05-10',
    recorrente: true
  },
  {
    id: '3',
    descricao: 'Supermercado',
    valor: 450,
    tipo: 'despesa',
    categoria: 'Alimentação',
    data: '2025-05-12',
    recorrente: false
  },
  {
    id: '4',
    descricao: 'Freelance Design',
    valor: 800,
    tipo: 'receita',
    categoria: 'Freelance',
    data: '2025-05-15',
    recorrente: false
  },
  {
    id: '5',
    descricao: 'Netflix',
    valor: 45.90,
    tipo: 'despesa',
    categoria: 'Assinaturas',
    data: '2025-05-20',
    recorrente: true
  }
];

const TransactionsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>(transacoesIniciais);
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

  // Verificação de autenticação removida para evitar redirecionamento

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
  const adicionarTransacao = () => {
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
      observacoes: novaTransacao.observacoes
    };

    if (modoEdicao && transacaoEditando) {
      // Atualizar transação existente
      setTransacoes(prev => 
        prev.map(t => t.id === transacaoEditando ? novaTransacaoCompleta : t)
      );
    } else {
      // Adicionar nova transação
      setTransacoes(prev => [...prev, novaTransacaoCompleta]);
    }

    // Resetar formulário e fechar diálogo
    setNovaTransacao({
      tipo: 'despesa',
      recorrente: false
    });
    setDialogAberto(false);
    setModoEdicao(false);
    setTransacaoEditando(null);
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
  const excluirTransacao = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      setTransacoes(prev => prev.filter(t => t.id !== id));
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
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="mes-atual">Mês Atual</SelectItem>
                  <SelectItem value="ano-atual">Ano Atual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de transações */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Transações</CardTitle>
          <CardDescription>
            {transacoesFiltradas.length} transações encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Recorrente</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoesFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhuma transação encontrada com os filtros atuais.
                  </TableCell>
                </TableRow>
              ) : (
                transacoesFiltradas.map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell>
                      {new Date(transacao.data).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{transacao.descricao}</TableCell>
                    <TableCell>{transacao.categoria}</TableCell>
                    <TableCell className={`text-right ${transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                      {transacao.tipo === 'receita' ? '+' : '-'} {formatarValor(transacao.valor)}
                    </TableCell>
                    <TableCell>{transacao.recorrente ? 'Sim' : 'Não'}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => editarTransacao(transacao.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => excluirTransacao(transacao.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
