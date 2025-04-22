
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Finance } from '@/types/finance';

export const useFinances = (eventId: string | undefined) => {
  const [finances, setFinances] = useState<Finance[]>([]);
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
        
        if (!eventId) return;
        
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
    
    fetchFinances();
  }, [eventId]);
  
  // Funções para lidar com o formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewFinance(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewFinance(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddFinance = async () => {
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
      
      return true;
    } catch (error: any) {
      console.error('Erro ao adicionar item financeiro:', error);
      toast.error(`Erro ao adicionar item: ${error.message}`);
      return false;
    }
  };
  
  const handleUpdateFinance = async (id: string) => {
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
        .eq('id', id)
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
        prev.map(item => (item.id === id ? updatedFinanceItem : item))
      );
      toast.success("Item financeiro atualizado com sucesso");
      
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar item financeiro:', error);
      toast.error(`Erro ao atualizar item: ${error.message}`);
      return false;
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
      return true;
    } catch (error: any) {
      console.error('Erro ao remover item financeiro:', error);
      toast.error(`Erro ao remover item: ${error.message}`);
      return false;
    }
  };
  
  // Calcular totais
  const totalReceitas = finances.filter(item => item.type === 'receita').reduce((sum, item) => sum + item.amount, 0);
  const totalDespesas = finances.filter(item => item.type === 'despesa').reduce((sum, item) => sum + item.amount, 0);
  const saldoTotal = totalReceitas - totalDespesas;
  
  return {
    finances,
    isLoading,
    newFinance,
    setNewFinance,
    totalReceitas,
    totalDespesas,
    saldoTotal,
    handleInputChange,
    handleSelectChange,
    handleAddFinance,
    handleUpdateFinance,
    handleDeleteFinance
  };
};
