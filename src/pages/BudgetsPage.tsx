import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
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
  PieChart, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Tipos
type Orcamento = {
  id: string;
  categoria: string;
  valorLimite: number;
  valorGasto: number;
  periodo: 'mensal' | 'trimestral' | 'anual';
  inicioVigencia: string;
  fimVigencia: string;
  alertas: boolean;
};

// Dados de exemplo
const categorias = [
  'Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 
  'Educação', 'Assinaturas', 'Outros'
];

const orcamentosIniciais: Orcamento[] = [
  {
    id: '1',
    categoria: 'Moradia',
    valorLimite: 1500,
    valorGasto: 1200,
    periodo: 'mensal',
    inicioVigencia: '2025-05-01',
    fimVigencia: '2025-05-31',
    alertas: true
  },
  {
    id: '2',
    categoria: 'Alimentação',
    valorLimite: 800,
    valorGasto: 650,
    periodo: 'mensal',
    inicioVigencia: '2025-05-01',
    fimVigencia: '2025-05-31',
    alertas: true
  },
  {
    id: '3',
    categoria: 'Transporte',
    valorLimite: 400,
    valorGasto: 375,
    periodo: 'mensal',
    inicioVigencia: '2025-05-01',
    fimVigencia: '2025-05-31',
    alertas: true
  },
  {
    id: '4',
    categoria: 'Lazer',
    valorLimite: 300,
    valorGasto: 250,
    periodo: 'mensal',
    inicioVigencia: '2025-05-01',
    fimVigencia: '2025-05-31',
    alertas: true
  }
];

const BudgetsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(orcamentosIniciais);
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('mensal');
  const [novoOrcamento, setNovoOrcamento] = useState<Partial<Orcamento>>({
    periodo: 'mensal',
    alertas: true,
    inicioVigencia: new Date().toISOString().split('T')[0]
  });
  const [dialogAberto, setDialogAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [orcamentoEditando, setOrcamentoEditando] = useState<string | null>(null);

  // Filtrar orçamentos
  const orcamentosFiltrados = orcamentos.filter(orcamento => {
    if (filtroPeriodo !== 'todos' && orcamento.periodo !== filtroPeriodo) return false;
    return true;
  });

  // Calcular data de fim de vigência com base no período
  React.useEffect(() => {
    if (novoOrcamento.inicioVigencia && novoOrcamento.periodo) {
      const inicio = new Date(novoOrcamento.inicioVigencia);
      let fim = new Date(inicio);
      
      switch(novoOrcamento.periodo) {
        case 'mensal':
          fim.setMonth(inicio.getMonth() + 1);
          break;
        case 'trimestral':
          fim.setMonth(inicio.getMonth() + 3);
          break;
        case 'anual':
          fim.setFullYear(inicio.getFullYear() + 1);
          break;
      }
      
      fim.setDate(fim.getDate() - 1); // Último dia do período
      
      setNovoOrcamento(prev => ({
        ...prev,
        fimVigencia: fim.toISOString().split('T')[0]
      }));
    }
  }, [novoOrcamento.inicioVigencia, novoOrcamento.periodo]);

  // Manipular mudanças no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNovoOrcamento(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manipular mudanças em selects
  const handleSelectChange = (name: string, value: string) => {
    setNovoOrcamento(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Adicionar novo orçamento
  const adicionarOrcamento = () => {
    if (!novoOrcamento.categoria || !novoOrcamento.valorLimite || !novoOrcamento.inicioVigencia) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const novoOrcamentoCompleto: Orcamento = {
      id: modoEdicao && orcamentoEditando ? orcamentoEditando : Date.now().toString(),
      categoria: novoOrcamento.categoria || '',
      valorLimite: Number(novoOrcamento.valorLimite) || 0,
      valorGasto: Number(novoOrcamento.valorGasto) || 0,
      periodo: novoOrcamento.periodo as 'mensal' | 'trimestral' | 'anual',
      inicioVigencia: novoOrcamento.inicioVigencia || '',
      fimVigencia: novoOrcamento.fimVigencia || '',
      alertas: novoOrcamento.alertas || false
    };

    if (modoEdicao && orcamentoEditando) {
      // Atualizar orçamento existente
      setOrcamentos(prev => 
        prev.map(o => o.id === orcamentoEditando ? novoOrcamentoCompleto : o)
      );
    } else {
      // Adicionar novo orçamento
      setOrcamentos(prev => [...prev, novoOrcamentoCompleto]);
    }

    // Resetar formulário e fechar diálogo
    setNovoOrcamento({
      periodo: 'mensal',
      alertas: true,
      inicioVigencia: new Date().toISOString().split('T')[0]
    });
    setDialogAberto(false);
    setModoEdicao(false);
    setOrcamentoEditando(null);
  };

  // Editar orçamento
  const editarOrcamento = (id: string) => {
    const orcamento = orcamentos.find(o => o.id === id);
    if (orcamento) {
      setNovoOrcamento({ ...orcamento });
      setModoEdicao(true);
      setOrcamentoEditando(id);
      setDialogAberto(true);
    }
  };

  // Excluir orçamento
  const excluirOrcamento = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      setOrcamentos(prev => prev.filter(o => o.id !== id));
    }
  };

  // Formatar valor para exibição
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Calcular porcentagem de uso do orçamento
  const calcularPorcentagem = (gasto: number, limite: number) => {
    return Math.min(Math.round((gasto / limite) * 100), 100);
  };

  // Determinar cor da barra de progresso com base na porcentagem
  const corProgresso = (porcentagem: number) => {
    if (porcentagem < 70) return 'bg-green-500';
    if (porcentagem < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calcular total de orçamentos
  const calcularTotalOrcamentos = () => {
    return orcamentosFiltrados.reduce((acc, o) => acc + o.valorLimite, 0);
  };

  // Calcular total gasto
  const calcularTotalGasto = () => {
    return orcamentosFiltrados.reduce((acc, o) => acc + o.valorGasto, 0);
  };

  // Calcular porcentagem total
  const calcularPorcentagemTotal = () => {
    const total = calcularTotalOrcamentos();
    const gasto = calcularTotalGasto();
    return total > 0 ? Math.round((gasto / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setNovoOrcamento({
                  periodo: 'mensal',
                  alertas: true,
                  inicioVigencia: new Date().toISOString().split('T')[0]
                });
                setModoEdicao(false);
                setOrcamentoEditando(null);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Orçamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{modoEdicao ? 'Editar Orçamento' : 'Novo Orçamento'}</DialogTitle>
              <DialogDescription>
                Defina os limites de gastos por categoria.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoria" className="text-right">
                  Categoria
                </Label>
                <Select 
                  value={novoOrcamento.categoria} 
                  onValueChange={(value) => handleSelectChange('categoria', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valorLimite" className="text-right">
                  Limite
                </Label>
                <Input
                  id="valorLimite"
                  name="valorLimite"
                  type="number"
                  step="0.01"
                  value={novoOrcamento.valorLimite || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valorGasto" className="text-right">
                  Gasto Atual
                </Label>
                <Input
                  id="valorGasto"
                  name="valorGasto"
                  type="number"
                  step="0.01"
                  value={novoOrcamento.valorGasto || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="periodo" className="text-right">
                  Período
                </Label>
                <Select 
                  value={novoOrcamento.periodo as string} 
                  onValueChange={(value) => handleSelectChange('periodo', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="inicioVigencia" className="text-right">
                  Início
                </Label>
                <Input
                  id="inicioVigencia"
                  name="inicioVigencia"
                  type="date"
                  value={novoOrcamento.inicioVigencia || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fimVigencia" className="text-right">
                  Fim
                </Label>
                <Input
                  id="fimVigencia"
                  name="fimVigencia"
                  type="date"
                  value={novoOrcamento.fimVigencia || ''}
                  disabled
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="alertas" className="text-right">
                  Alertas
                </Label>
                <div className="col-span-3 flex items-center">
                  <input
                    id="alertas"
                    name="alertas"
                    type="checkbox"
                    checked={novoOrcamento.alertas || false}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <Label htmlFor="alertas">Receber alertas de limite</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={adicionarOrcamento}>
                {modoEdicao ? 'Salvar Alterações' : 'Adicionar Orçamento'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtro de período */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Label htmlFor="filtroPeriodo">Filtrar por período:</Label>
            <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resumo de orçamentos */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumo de Orçamentos</CardTitle>
          <CardDescription>
            Visão geral dos seus limites de gastos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Orçado:</span>
              <span className="font-bold">{formatarValor(calcularTotalOrcamentos())}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Gasto:</span>
              <span className="font-bold">{formatarValor(calcularTotalGasto())}</span>
            </div>
            <div className="flex justify-between">
              <span>Disponível:</span>
              <span className="font-bold text-green-600">
                {formatarValor(calcularTotalOrcamentos() - calcularTotalGasto())}
              </span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span>Progresso Geral:</span>
                <span>{calcularPorcentagemTotal()}%</span>
              </div>
              <Progress 
                value={calcularPorcentagemTotal()} 
                className={`h-2 ${corProgresso(calcularPorcentagemTotal())}`} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de orçamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orcamentosFiltrados.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">
              Nenhum orçamento encontrado para o período selecionado.
            </p>
          </div>
        ) : (
          orcamentosFiltrados.map((orcamento) => {
            const porcentagem = calcularPorcentagem(orcamento.valorGasto, orcamento.valorLimite);
            return (
              <Card key={orcamento.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{orcamento.categoria}</CardTitle>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => editarOrcamento(orcamento.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => excluirOrcamento(orcamento.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {new Date(orcamento.inicioVigencia).toLocaleDateString('pt-BR')} até {new Date(orcamento.fimVigencia).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Limite:</span>
                      <span className="font-bold">{formatarValor(orcamento.valorLimite)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gasto:</span>
                      <span className="font-bold">{formatarValor(orcamento.valorGasto)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disponível:</span>
                      <span className={`font-bold ${orcamento.valorLimite - orcamento.valorGasto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatarValor(orcamento.valorLimite - orcamento.valorGasto)}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Progresso:</span>
                        <span>{porcentagem}%</span>
                      </div>
                      <Progress 
                        value={porcentagem} 
                        className={`h-2 ${corProgresso(porcentagem)}`} 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 py-2">
                  <div className="w-full flex items-center">
                    {porcentagem >= 90 ? (
                      <div className="flex items-center text-red-600 text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span>Limite quase atingido!</span>
                      </div>
                    ) : porcentagem < 70 ? (
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        <span>Dentro do orçamento</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600 text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span>Atenção ao limite</span>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BudgetsPage;
