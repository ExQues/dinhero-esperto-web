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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  BarChart, 
  PieChart, 
  LineChart,
  Download, 
  Calendar,
  ArrowUpDown,
  DollarSign
} from 'lucide-react';

// Dados de exemplo para os gráficos
const dadosGastosPorCategoria = [
  { categoria: 'Moradia', valor: 1200, porcentagem: 30 },
  { categoria: 'Alimentação', valor: 800, porcentagem: 20 },
  { categoria: 'Transporte', valor: 400, porcentagem: 10 },
  { categoria: 'Lazer', valor: 300, porcentagem: 7.5 },
  { categoria: 'Saúde', valor: 250, porcentagem: 6.25 },
  { categoria: 'Educação', valor: 200, porcentagem: 5 },
  { categoria: 'Assinaturas', valor: 150, porcentagem: 3.75 },
  { categoria: 'Outros', valor: 700, porcentagem: 17.5 }
];

const dadosReceitasDespesasMensais = [
  { mes: 'Jan', receitas: 3200, despesas: 2800 },
  { mes: 'Fev', receitas: 3500, despesas: 3000 },
  { mes: 'Mar', receitas: 3300, despesas: 3100 },
  { mes: 'Abr', receitas: 3800, despesas: 3200 },
  { mes: 'Mai', receitas: 3500, despesas: 3000 }
];

const dadosFluxoCaixa = [
  { data: '01/05/2025', descricao: 'Salário', valor: 3500, tipo: 'receita' },
  { data: '05/05/2025', descricao: 'Aluguel', valor: -1200, tipo: 'despesa' },
  { data: '10/05/2025', descricao: 'Supermercado', valor: -450, tipo: 'despesa' },
  { data: '15/05/2025', descricao: 'Freelance', valor: 800, tipo: 'receita' },
  { data: '20/05/2025', descricao: 'Conta de Luz', valor: -120, tipo: 'despesa' },
  { data: '20/05/2025', descricao: 'Internet', valor: -100, tipo: 'despesa' },
  { data: '25/05/2025', descricao: 'Assinaturas', valor: -80, tipo: 'despesa' }
];

const ReportsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mes-atual');
  const [tipoRelatorio, setTipoRelatorio] = useState('gastos-categoria');
  const [formatoExportacao, setFormatoExportacao] = useState('pdf');

  // Formatar valor para exibição
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Simular exportação de relatório
  const exportarRelatorio = () => {
    alert(`Relatório de ${tipoRelatorio} exportado em formato ${formatoExportacao.toUpperCase()}`);
  };

  // Renderizar gráfico de barras para gastos por categoria
  const renderizarGraficoCategorias = () => {
    return (
      <div className="space-y-4">
        {dadosGastosPorCategoria.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">{item.categoria}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{item.porcentagem}%</span>
                <span className="font-medium">{formatarValor(item.valor)}</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${item.porcentagem}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Renderizar gráfico de linha para receitas vs despesas
  const renderizarGraficoReceitasDespesas = () => {
    // Em um cenário real, usaríamos uma biblioteca como Chart.js ou Recharts
    // Aqui, vamos simular um gráfico simples
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Receitas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Despesas</span>
          </div>
        </div>
        
        <div className="relative h-60 border-b border-l border-muted">
          {/* Eixo Y */}
          <div className="absolute -left-10 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
            <span>R$ 4.000</span>
            <span>R$ 3.000</span>
            <span>R$ 2.000</span>
            <span>R$ 1.000</span>
            <span>R$ 0</span>
          </div>
          
          {/* Gráfico simulado */}
          <div className="flex justify-between items-end h-full pt-5 pb-2">
            {dadosReceitasDespesasMensais.map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 w-1/5">
                {/* Barras de receitas e despesas */}
                <div className="flex space-x-1">
                  <div 
                    className="w-4 bg-green-500 rounded-t-sm" 
                    style={{ height: `${(item.receitas / 4000) * 100}%` }}
                  ></div>
                  <div 
                    className="w-4 bg-red-500 rounded-t-sm" 
                    style={{ height: `${(item.despesas / 4000) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs">{item.mes}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Média de Receitas</span>
                </div>
                <span className="font-bold">
                  {formatarValor(
                    dadosReceitasDespesasMensais.reduce((acc, item) => acc + item.receitas, 0) / 
                    dadosReceitasDespesasMensais.length
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm font-medium">Média de Despesas</span>
                </div>
                <span className="font-bold">
                  {formatarValor(
                    dadosReceitasDespesasMensais.reduce((acc, item) => acc + item.despesas, 0) / 
                    dadosReceitasDespesasMensais.length
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Renderizar tabela de fluxo de caixa
  const renderizarFluxoCaixa = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Data</th>
              <th className="py-2 px-4 text-left">Descrição</th>
              <th className="py-2 px-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {dadosFluxoCaixa.map((item, index) => (
              <tr key={index} className="border-b hover:bg-muted/50">
                <td className="py-2 px-4">{item.data}</td>
                <td className="py-2 px-4">{item.descricao}</td>
                <td className={`py-2 px-4 text-right ${item.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.tipo === 'receita' ? '+' : ''}{formatarValor(item.valor)}
                </td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="py-2 px-4" colSpan={2}>Saldo</td>
              <td className={`py-2 px-4 text-right ${
                dadosFluxoCaixa.reduce((acc, item) => acc + item.valor, 0) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {formatarValor(dadosFluxoCaixa.reduce((acc, item) => acc + item.valor, 0))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <Button onClick={exportarRelatorio}>
          <Download className="mr-2 h-4 w-4" /> Exportar
        </Button>
      </div>

      {/* Filtros e opções */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="periodoSelecionado" className="mb-2 block">Período</Label>
              <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes-atual">Mês Atual</SelectItem>
                  <SelectItem value="mes-anterior">Mês Anterior</SelectItem>
                  <SelectItem value="ultimos-3-meses">Últimos 3 Meses</SelectItem>
                  <SelectItem value="ano-atual">Ano Atual</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tipoRelatorio" className="mb-2 block">Tipo de Relatório</Label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gastos-categoria">Gastos por Categoria</SelectItem>
                  <SelectItem value="receitas-despesas">Receitas vs Despesas</SelectItem>
                  <SelectItem value="fluxo-caixa">Fluxo de Caixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="formatoExportacao" className="mb-2 block">Formato de Exportação</Label>
              <Select value={formatoExportacao} onValueChange={setFormatoExportacao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo do relatório */}
      <Card>
        <CardHeader>
          <CardTitle>
            {tipoRelatorio === 'gastos-categoria' && 'Gastos por Categoria'}
            {tipoRelatorio === 'receitas-despesas' && 'Receitas vs Despesas'}
            {tipoRelatorio === 'fluxo-caixa' && 'Fluxo de Caixa'}
          </CardTitle>
          <CardDescription>
            {periodoSelecionado === 'mes-atual' && 'Maio de 2025'}
            {periodoSelecionado === 'mes-anterior' && 'Abril de 2025'}
            {periodoSelecionado === 'ultimos-3-meses' && 'Março a Maio de 2025'}
            {periodoSelecionado === 'ano-atual' && 'Janeiro a Maio de 2025'}
            {periodoSelecionado === 'personalizado' && 'Período personalizado'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tipoRelatorio === 'gastos-categoria' && renderizarGraficoCategorias()}
          {tipoRelatorio === 'receitas-despesas' && renderizarGraficoReceitasDespesas()}
          {tipoRelatorio === 'fluxo-caixa' && renderizarFluxoCaixa()}
        </CardContent>
      </Card>

      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-green-600">
                {formatarValor(dadosFluxoCaixa
                  .filter(item => item.tipo === 'receita')
                  .reduce((acc, item) => acc + item.valor, 0)
                )}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-2xl font-bold text-red-600">
                {formatarValor(Math.abs(dadosFluxoCaixa
                  .filter(item => item.tipo === 'despesa')
                  .reduce((acc, item) => acc + item.valor, 0)
                ))}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo do Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              <span className={`text-2xl font-bold ${
                dadosFluxoCaixa.reduce((acc, item) => acc + item.valor, 0) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {formatarValor(dadosFluxoCaixa.reduce((acc, item) => acc + item.valor, 0))}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes visualizações */}
      <Card>
        <CardHeader>
          <CardTitle>Visualizações Alternativas</CardTitle>
          <CardDescription>
            Explore seus dados financeiros de diferentes formas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grafico">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="grafico">
                <PieChart className="h-4 w-4 mr-2" /> Gráfico
              </TabsTrigger>
              <TabsTrigger value="tabela">
                <BarChart className="h-4 w-4 mr-2" /> Tabela
              </TabsTrigger>
              <TabsTrigger value="calendario">
                <Calendar className="h-4 w-4 mr-2" /> Calendário
              </TabsTrigger>
            </TabsList>
            <TabsContent value="grafico" className="pt-4">
              <div className="text-center p-8 border rounded-md">
                <p className="text-muted-foreground">
                  Visualização em gráfico será implementada em breve.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="tabela" className="pt-4">
              <div className="text-center p-8 border rounded-md">
                <p className="text-muted-foreground">
                  Visualização em tabela será implementada em breve.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="calendario" className="pt-4">
              <div className="text-center p-8 border rounded-md">
                <p className="text-muted-foreground">
                  Visualização em calendário será implementada em breve.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" /> Baixar Dados Brutos
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReportsPage;
