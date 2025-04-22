import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEventContext } from '@/contexts/EventContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { Finance } from '@/types/finance';

const EventFinances = () => {
  const isMobile = useIsMobile();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { selectedEvent } = useEventContext();
  const [finances, setFinances] = useState<Finance[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFinance, setSelectedFinance] = useState<Finance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para o formulário de nova despesa/receita
  const [newFinance, setNewFinance] = useState({
    description: '',
    amount: 0,
    category: '',
    type: 'despesa',
    status: 'pendente',
    date: ''
  });
  
  // Carregar dados financeiros do Supabase
  useEffect(() => {
    const fetchFinances = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('leju_finances')
          .select('*')
          .eq('event_id', eventId)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Transformar dados do Supabase para o formato correto
          const transformedFinances = data.map(item => ({
            id: item.id,
            description: item.description,
            amount: Number(item.amount),
            category: item.category,
            type: item.type as 'receita' | 'despesa',
            status: item.status as 'pago' | 'pendente' | 'cancelado',
            date: new Date(item.date),
            eventId: item.event_id,
            createdAt: new Date(item.created_at)
          }));
          
          setFinances(transformedFinances);
        } else {
          setFinances([]);
        }
      } catch (error: any) {
        console.error('Erro ao carregar dados financeiros:', error);
        toast.error(`Erro ao carregar dados: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (eventId) {
      fetchFinances();
    }
  }, [eventId]);
  
  // Funções para lidar com o formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFinance(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewFinance(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddFinance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventId) {
      toast.error("ID do evento não encontrado");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('leju_finances')
        .insert({
          description: newFinance.description,
          amount: Number(newFinance.amount),
          category: newFinance.category,
          type: newFinance.type,
          status: newFinance.status,
          date: newFinance.date,
          event_id: eventId
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Transformar dados do Supabase para o formato correto
      const newFinanceItem: Finance = {
        id: data.id,
        description: data.description,
        amount: Number(data.amount),
        category: data.category,
        type: data.type as 'receita' | 'despesa',
        status: data.status as 'pago' | 'pendente' | 'cancelado',
        date: new Date(data.date),
        eventId: data.event_id,
        createdAt: new Date(data.created_at)
      };
      
      setFinances(prev => [...prev, newFinanceItem]);
      setIsAddModalOpen(false);
      toast.success("Item financeiro adicionado com sucesso");
      
      // Resetar o formulário
      setNewFinance({
        description: '',
        amount: 0,
        category: '',
        type: 'despesa',
        status: 'pendente',
        date: ''
      });
    } catch (error: any) {
      console.error('Erro ao adicionar item financeiro:', error);
      toast.error(`Erro ao adicionar item: ${error.message}`);
    }
  };
  
  const handleEditFinance = (finance: Finance) => {
    setSelectedFinance(finance);
    setNewFinance({
      description: finance.description,
      amount: finance.amount,
      category: finance.category,
      type: finance.type,
      status: finance.status,
      date: format(new Date(finance.date), 'yyyy-MM-dd')
    });
    setIsEditModalOpen(true);
  };
  
  const handleUpdateFinance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFinance) {
      toast.error("Nenhum item financeiro selecionado para editar");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('leju_finances')
        .update({
          description: newFinance.description,
          amount: Number(newFinance.amount),
          category: newFinance.category,
          type: newFinance.type,
          status: newFinance.status,
          date: newFinance.date
        })
        .eq('id', selectedFinance.id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Transformar dados do Supabase para o formato correto
      const updatedFinanceItem: Finance = {
        id: data.id,
        description: data.description,
        amount: Number(data.amount),
        category: data.category,
        type: data.type as 'receita' | 'despesa',
        status: data.status as 'pago' | 'pendente' | 'cancelado',
        date: new Date(data.date),
        eventId: data.event_id,
        createdAt: new Date(data.created_at)
      };
      
      setFinances(prev =>
        prev.map(item => (item.id === selectedFinance.id ? updatedFinanceItem : item))
      );
      setIsEditModalOpen(false);
      toast.success("Item financeiro atualizado com sucesso");
      
      // Resetar o formulário
      setNewFinance({
        description: '',
        amount: 0,
        category: '',
        type: 'despesa',
        status: 'pendente',
        date: ''
      });
      setSelectedFinance(null);
    } catch (error: any) {
      console.error('Erro ao atualizar item financeiro:', error);
      toast.error(`Erro ao atualizar item: ${error.message}`);
    }
  };
  
  const handleDeleteFinance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leju_finances')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setFinances(prev => prev.filter(item => item.id !== id));
      toast.success("Item financeiro removido com sucesso");
    } catch (error: any) {
      console.error('Erro ao remover item financeiro:', error);
      toast.error(`Erro ao remover item: ${error.message}`);
    }
  };
  
  // Calcular totais
  const totalReceitas = finances.filter(item => item.type === 'receita').reduce((sum, item) => sum + item.amount, 0);
  const totalDespesas = finances.filter(item => item.type === 'despesa').reduce((sum, item) => sum + item.amount, 0);
  const saldoTotal = totalReceitas - totalDespesas;
  
  if (!selectedEvent) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/events')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{selectedEvent.title}</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie as finanças do seu evento
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total de Receitas</CardTitle>
                <CardDescription>Valor total das receitas do evento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  R$ {totalReceitas.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total de Despesas</CardTitle>
                <CardDescription>Valor total das despesas do evento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  R$ {totalDespesas.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Saldo Total</CardTitle>
                <CardDescription>Saldo atual do evento (Receitas - Despesas)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${saldoTotal >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  R$ {saldoTotal.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Detalhes Financeiros
            </h2>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-leju-pink hover:bg-leju-pink/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Item Financeiro</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleAddFinance} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input 
                      id="description" 
                      name="description"
                      value={newFinance.description}
                      onChange={handleInputChange}
                      placeholder="Ex: Aluguel do salão, Buffet, DJ"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor</Label>
                    <Input 
                      id="amount" 
                      name="amount"
                      type="number"
                      value={newFinance.amount}
                      onChange={handleInputChange}
                      placeholder="Ex: 1500.00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input 
                      id="category" 
                      name="category"
                      value={newFinance.category}
                      onChange={handleInputChange}
                      placeholder="Ex: Contratações, Alimentação, Decoração"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={newFinance.type}
                        onValueChange={(value) => handleSelectChange('type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="receita">Receita</SelectItem>
                          <SelectItem value="despesa">Despesa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newFinance.status}
                        onValueChange={(value) => handleSelectChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="pago">Pago</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input 
                      id="date" 
                      name="date"
                      type="date"
                      value={newFinance.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-leju-pink hover:bg-leju-pink/90"
                    >
                      Adicionar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-leju-pink" />
              <span className="ml-2">Carregando dados financeiros...</span>
            </div>
          ) : finances.length > 0 ? (
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finances.map((finance) => (
                    <TableRow key={finance.id}>
                      <TableCell className="font-medium">{finance.description}</TableCell>
                      <TableCell>R$ {finance.amount.toFixed(2)}</TableCell>
                      <TableCell>{finance.category}</TableCell>
                      <TableCell>{finance.type}</TableCell>
                      <TableCell>{finance.status}</TableCell>
                      <TableCell>{format(new Date(finance.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditFinance(finance)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteFinance(finance.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border rounded-lg p-6 bg-white fade-in mt-4">
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-4">Nenhum item financeiro cadastrado</h2>
                <p className="text-muted-foreground mb-6">
                  Adicione itens financeiros para controlar as finanças do seu evento.
                </p>
                <Button 
                  onClick={() => setIsAddModalOpen(true)} 
                  className="bg-leju-pink hover:bg-leju-pink/90"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Item
                </Button>
              </div>
            </div>
          )}
          
          {/* Modal de Edição */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Item Financeiro</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleUpdateFinance} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input 
                    id="description" 
                    name="description"
                    value={newFinance.description}
                    onChange={handleInputChange}
                    placeholder="Ex: Aluguel do salão, Buffet, DJ"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor</Label>
                  <Input 
                    id="amount" 
                    name="amount"
                    type="number"
                    value={newFinance.amount}
                    onChange={handleInputChange}
                    placeholder="Ex: 1500.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input 
                    id="category" 
                    name="category"
                    value={newFinance.category}
                    onChange={handleInputChange}
                    placeholder="Ex: Contratações, Alimentação, Decoração"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={newFinance.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="receita">Receita</SelectItem>
                        <SelectItem value="despesa">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newFinance.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input 
                    id="date" 
                    name="date"
                    type="date"
                    value={newFinance.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-leju-pink hover:bg-leju-pink/90"
                  >
                    Atualizar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default EventFinances;
