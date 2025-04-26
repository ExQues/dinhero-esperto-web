import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Calendar, 
  Tag, 
  Trash2, 
  Edit, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

// Tipos para as transações
interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}

// Dados simulados para transações
const mockTransactions: Transaction[] = [
  { id: 1, description: 'Salário', amount: 3500, date: '2025-04-05', category: 'Receita', type: 'income' },
  { id: 2, description: 'Aluguel', amount: 1200, date: '2025-04-10', category: 'Moradia', type: 'expense' },
  { id: 3, description: 'Supermercado', amount: 450, date: '2025-04-12', category: 'Alimentação', type: 'expense' },
  { id: 4, description: 'Freelance', amount: 800, date: '2025-04-15', category: 'Receita', type: 'income' },
  { id: 5, description: 'Internet', amount: 120, date: '2025-04-15', category: 'Utilidades', type: 'expense' },
  { id: 6, description: 'Restaurante', amount: 85, date: '2025-04-18', category: 'Alimentação', type: 'expense' },
  { id: 7, description: 'Uber', amount: 35, date: '2025-04-20', category: 'Transporte', type: 'expense' },
  { id: 8, description: 'Netflix', amount: 45, date: '2025-04-22', category: 'Entretenimento', type: 'expense' },
  { id: 9, description: 'Presente', amount: 150, date: '2025-04-23', category: 'Outros', type: 'expense' },
  { id: 10, description: 'Dividendos', amount: 200, date: '2025-04-25', category: 'Investimentos', type: 'income' },
];

// Categorias disponíveis
const categories = [
  'Todas',
  'Receita',
  'Moradia',
  'Alimentação',
  'Transporte',
  'Entretenimento',
  'Utilidades',
  'Saúde',
  'Educação',
  'Investimentos',
  'Outros'
];

const TransactionsPage = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedType, setSelectedType] = useState('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'Outros',
    type: 'expense'
  });
  
  // Redirecionar se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Aplicar filtros e ordenação
  useEffect(() => {
    let result = [...transactions];
    
    // Filtrar por termo de busca
    if (searchTerm) {
      result = result.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por categoria
    if (selectedCategory !== 'Todas') {
      result = result.filter(t => t.category === selectedCategory);
    }
    
    // Filtrar por tipo
    if (selectedType !== 'all') {
      result = result.filter(t => t.type === selectedType);
    }
    
    // Ordenar
    result.sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortDirection === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
    });
    
    setFilteredTransactions(result);
  }, [transactions, searchTerm, selectedCategory, selectedType, sortDirection, sortField]);
  
  // Alternar direção de ordenação
  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Adicionar nova transação
  const handleAddTransaction = () => {
    const newId = Math.max(...transactions.map(t => t.id), 0) + 1;
    const transactionToAdd = {
      id: newId,
      ...newTransaction
    };
    
    setTransactions([...transactions, transactionToAdd]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Transação adicionada",
      description: "A transação foi adicionada com sucesso.",
      variant: "default",
    });
    
    setNewTransaction({
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: 'Outros',
      type: 'expense'
    });
  };
  
  // Editar transação
  const handleEditTransaction = () => {
    if (!currentTransaction) return;
    
    const updatedTransactions = transactions.map(t => 
      t.id === currentTransaction.id ? currentTransaction : t
    );
    
    setTransactions(updatedTransactions);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Transação atualizada",
      description: "A transação foi atualizada com sucesso.",
      variant: "default",
    });
    
    setCurrentTransaction(null);
  };
  
  // Excluir transação
  const handleDeleteTransaction = () => {
    if (!currentTransaction) return;
    
    const updatedTransactions = transactions.filter(t => t.id !== currentTransaction.id);
    setTransactions(updatedTransactions);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Transação excluída",
      description: "A transação foi excluída com sucesso.",
      variant: "default",
    });
    
    setCurrentTransaction(null);
  };
  
  // Abrir modal de edição
  const openEditDialog = (transaction: Transaction) => {
    setCurrentTransaction({...transaction});
    setIsEditDialogOpen(true);
  };
  
  // Abrir modal de exclusão
  const openDeleteDialog = (transaction: Transaction) => {
    setCurrentTransaction({...transaction});
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      
      <div className="ml-[250px] w-[calc(100%-250px)] p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Transações</h1>
          <p className="text-muted-foreground">Gerencie suas receitas e despesas</p>
        </header>
        
        {/* Filtros e Ações */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Transação</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes da nova transação abaixo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Tipo
                  </Label>
                  <Select 
                    value={newTransaction.type} 
                    onValueChange={(value: 'income' | 'expense') => 
                      setNewTransaction({...newTransaction, type: value})
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descrição
                  </Label>
                  <Input
                    id="description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Valor
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Categoria
                  </Label>
                  <Select 
                    value={newTransaction.category} 
                    onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== 'Todas').map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddTransaction}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                R$ {filteredTransactions
                  .filter(t => t.type === 'income')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                R$ {filteredTransactions
                  .filter(t => t.type === 'expense')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {(
                  filteredTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0) -
                  filteredTransactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0)
                ).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabela de Transações */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
            <CardDescription>
              {filteredTransactions.length} transações encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border responsive-table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center" 
                        onClick={() => toggleSort('date')}
                      >
                        Data
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center" 
                        onClick={() => toggleSort('amount')}
                      >
                        Valor
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        Nenhuma transação encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.category}</Badge>
                        </TableCell>
                        <TableCell className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                          {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openEditDialog(transaction)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDeleteDialog(transaction)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Próximo
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Modal de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Transação</DialogTitle>
              <DialogDescription>
                Atualize os detalhes da transação abaixo.
              </DialogDescription>
            </DialogHeader>
            {currentTransaction && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-type" className="text-right">
                    Tipo
                  </Label>
                  <Select 
                    value={currentTransaction.type} 
                    onValueChange={(value: 'income' | 'expense') => 
                      setCurrentTransaction({...currentTransaction, type: value})
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Descrição
                  </Label>
                  <Input
                    id="edit-description"
                    value={currentTransaction.description}
                    onChange={(e) => setCurrentTransaction({...currentTransaction, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-amount" className="text-right">
                    Valor
                  </Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={currentTransaction.amount}
                    onChange={(e) => setCurrentTransaction({...currentTransaction, amount: parseFloat(e.target.value)})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-date" className="text-right">
                    Data
                  </Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={currentTransaction.date}
                    onChange={(e) => setCurrentTransaction({...currentTransaction, date: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    Categoria
                  </Label>
                  <Select 
                    value={currentTransaction.category} 
                    onValueChange={(value) => setCurrentTransaction({...currentTransaction, category: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== 'Todas').map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditTransaction}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Modal de Exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            {currentTransaction && (
              <div className="py-4">
                <div className="rounded-lg bg-muted p-4">
                  <p><strong>Descrição:</strong> {currentTransaction.description}</p>
                  <p><strong>Valor:</strong> R$ {currentTransaction.amount.toFixed(2)}</p>
                  <p><strong>Data:</strong> {formatDate(currentTransaction.date)}</p>
                  <p><strong>Categoria:</strong> {currentTransaction.category}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteTransaction}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TransactionsPage;
