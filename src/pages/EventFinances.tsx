import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Download, Trash2, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

interface FinanceItem {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  type: 'income' | 'expense';
  status: 'paid' | 'pending';
}

const EXPENSE_CATEGORIES = [
  'Buffet',
  'Decoração',
  'Fotografia',
  'Música',
  'Local',
  'Trajes',
  'Transporte',
  'Convites',
  'Lembranças',
  'Outros'
];

const INCOME_CATEGORIES = [
  'Orçamento pessoal',
  'Família',
  'Padrinhos',
  'Presentes',
  'Outros'
];

const EventFinances = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [event, setEvent] = useState<any>(null);
  const [finances, setFinances] = useState<FinanceItem[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    description: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    category: '',
    type: 'expense' as 'income' | 'expense',
    status: 'pending' as 'paid' | 'pending'
  });
  
  useEffect(() => {
    const fetchEventAndFinances = async () => {
      if (!eventId) {
        toast.error("ID do evento não fornecido");
        navigate('/events');
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch event
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();
          
        if (eventError) {
          throw eventError;
        }
        
        if (eventData) {
          setEvent({
            ...eventData,
            date: new Date(eventData.date)
          });
          
          // Fetch finances for this event
          const { data: financeData, error: financeError } = await supabase
            .from('finances')
            .select('*')
            .eq('event_id', eventId)
            .order('date', { ascending: false });
            
          if (financeError) {
            throw financeError;
          }
          
          // Transform data
          const transformedFinances: FinanceItem[] = financeData.map(item => ({
            id: item.id,
            description: item.description,
            amount: Number(item.amount),
            date: new Date(item.date),
            category: item.category,
            type: item.type as 'income' | 'expense',
            status: item.status as 'paid' | 'pending'
          }));
          
          setFinances(transformedFinances);
        } else {
          toast.error("Evento não encontrado");
          navigate('/events');
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error('Erro ao carregar dados: ' + error.message);
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventAndFinances();
  }, [eventId, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventId || !newItem.description || !newItem.amount || !newItem.category || !newItem.date) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('finances')
        .insert({
          event_id: eventId,
          description: newItem.description,
          amount: parseFloat(newItem.amount),
          date: newItem.date.toISOString(),
          category: newItem.category,
          type: newItem.type as 'income' | 'expense',
          status: newItem.status as 'paid' | 'pending',
          user_id: event.user_id
        });
        
      if (error) {
        throw error;
      }
      
      // Add new item to state
      const newFinanceItem: FinanceItem = {
        id: data.id,
        description: data.description,
        amount: Number(data.amount),
        date: new Date(data.date),
        category: data.category,
        type: data.type,
        status: data.status
      };
      
      setFinances(prev => [newFinanceItem, ...prev]);
      
      // Reset form
      setNewItem({
        description: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        category: '',
        type: 'expense',
        status: 'pending'
      });
      
      setIsAddDialogOpen(false);
      toast.success(`${newItem.type === 'income' ? 'Receita' : 'Despesa'} adicionada com sucesso`);
    } catch (error: any) {
      console.error('Error adding finance item:', error);
      toast.error('Erro ao adicionar item: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('finances')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setFinances(prev => prev.filter(item => item.id !== id));
      toast.success("Item removido com sucesso");
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast.error('Erro ao remover item: ' + error.message);
    }
  };
  
  const handleUpdateStatus = async (id: string, status: 'paid' | 'pending') => {
    try {
      const { error } = await supabase
        .from('finances')
        .update({ status })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setFinances(prev => prev.map(item => 
        item.id === id ? { ...item, status } : item
      ));
      
      toast.success("Status atualizado com sucesso");
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Erro ao atualizar status: ' + error.message);
    }
  };
  
  const exportToCSV = () => {
    if (finances.length === 0) {
      toast.error("Não há dados financeiros para exportar");
      return;
    }
    
    const headers = ['Descrição', 'Valor', 'Data', 'Categoria', 'Tipo', 'Status'];
    
    const csvContent = [
      headers.join(','),
      ...finances.map(item => [
        item.description,
        item.amount.toFixed(2).replace('.', ','),
        format(item.date, 'dd/MM/yyyy'),
        item.category,
        item.type === 'income' ? 'Receita' : 'Despesa',
        item.status === 'paid' ? 'Pago' : 'Pendente'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `financas-${event?.title.replace(/\s+/g, '-')}-${format(new Date(), 'dd-MM-yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Dados financeiros exportados com sucesso");
  };
  
  // Filter items based on active tab
  const filteredItems = finances.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'incomes') return item.type === 'income';
    if (activeTab === 'expenses') return item.type === 'expense';
    if (activeTab === 'pending') return item.status === 'pending';
    return true;
  });
  
  // Calculate totals
  const totalIncomes = finances
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const totalExpenses = finances
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
    
  const balance = totalIncomes - totalExpenses;
  
  const pendingExpenses = finances
    .filter(item => item.type === 'expense' && item.status === 'pending')
    .reduce((sum, item) => sum + item.amount, 0);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-leju-pink" />
        <span className="ml-2">Carregando dados financeiros...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/events')}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold">{event.title}</h1>
            </div>
            <div className="text-muted-foreground mb-4">
              {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              {' • '}
              {event.location}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <h2 className="text-xl font-semibold">Gestão Financeira</h2>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={exportToCSV}
                  disabled={finances.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-leju-pink hover:bg-leju-pink/90">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Adicionar Item Financeiro</DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Tipo</Label>
                        <Select
                          value={newItem.type}
                          onValueChange={(value) => setNewItem({...newItem, type: value as 'income' | 'expense'})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="expense">Despesa</SelectItem>
                            <SelectItem value="income">Receita</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição *</Label>
                        <Input 
                          id="description" 
                          name="description"
                          value={newItem.description} 
                          onChange={handleInputChange} 
                          placeholder="Ex: Pagamento do buffet"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount">Valor (R$) *</Label>
                        <Input 
                          id="amount" 
                          name="amount"
                          type="number" 
                          step="0.01"
                          min="0.01"
                          value={newItem.amount} 
                          onChange={handleInputChange} 
                          placeholder="0,00"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="date">Data *</Label>
                        <Input 
                          id="date" 
                          name="date"
                          type="date" 
                          value={newItem.date} 
                          onChange={handleInputChange} 
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria *</Label>
                        <Select
                          value={newItem.category}
                          onValueChange={(value) => setNewItem({...newItem, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {newItem.type === 'expense' ? (
                              EXPENSE_CATEGORIES.map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))
                            ) : (
                              INCOME_CATEGORIES.map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={newItem.status}
                          onValueChange={(value) => setNewItem({...newItem, status: value as 'paid' | 'pending'})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="paid">Pago</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button 
                          variant="outline" 
                          type="button" 
                          onClick={() => setIsAddDialogOpen(false)}
                          disabled={submitting}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-leju-pink hover:bg-leju-pink/90"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adicionando...
                            </>
                          ) : (
                            "Adicionar"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          
          {/* Cartões de resumo financeiro */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className={`border-l-4 ${balance >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {balance.toFixed(2).replace('.', ',')}
                </div>
              </CardHeader>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalIncomes.toFixed(2).replace('.', ',')}
                </div>
              </CardHeader>
            </Card>
            
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                <div className="text-2xl font-bold text-red-600">
                  R$ {totalExpenses.toFixed(2).replace('.', ',')}
                </div>
              </CardHeader>
            </Card>
            
            <Card className="border-l-4 border-l-orange-400">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <div className="text-2xl font-bold text-orange-600">
                  R$ {pendingExpenses.toFixed(2).replace('.', ',')}
                </div>
              </CardHeader>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="incomes">Receitas</TabsTrigger>
              <TabsTrigger value="expenses">Despesas</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-4">
              {finances.length === 0 ? (
                <div className="border rounded-md p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Nenhum registro financeiro</h3>
                  <p className="text-muted-foreground mb-4">
                    Adicione receitas e despesas para este evento
                  </p>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-leju-pink hover:bg-leju-pink/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="border rounded-md p-6 text-center">
                  <p className="text-muted-foreground">Nenhum item encontrado com os filtros selecionados.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.description}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{format(new Date(item.date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell className={`text-right font-semibold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {item.type === 'income' ? '+' : '-'} R$ {item.amount.toFixed(2).replace('.', ',')}
                          </TableCell>
                          <TableCell>
                            {item.status === 'paid' ? (
                              <div className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                <span>Pago</span>
                              </div>
                            ) : (
                              <Select
                                value={item.status}
                                onValueChange={(value) => handleUpdateStatus(item.id, value as 'paid' | 'pending')}
                              >
                                <SelectTrigger className="h-8 w-28">
                                  <div className="flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-orange-500 mr-2"></span>
                                    <span>Pendente</span>
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pendente</SelectItem>
                                  <SelectItem value="paid">Pago</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default EventFinances;
