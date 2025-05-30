
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task } from '@/types/task';
import { toast } from 'sonner';
import { useEventContext } from '@/contexts/EventContext';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddTaskFormProps {
  onAddTask: (task: Task) => void;
  onCancel: () => void;
}

export const AddTaskForm = ({ onAddTask, onCancel }: AddTaskFormProps) => {
  const { events } = useEventContext();
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'dueDate'>>({
    title: '',
    description: '',
    status: 'pendente',
    priority: 'media',
    eventId: events.length > 0 ? events[0].id : undefined,
    assignedTo: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !date) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    if (!user) {
      toast.error('Você precisa estar logado para adicionar tarefas');
      return;
    }
    
    setLoading(true);
    
    try {
      // Salvar no Supabase
      const { data, error } = await supabase
        .from('leju_tasks')
        .insert({
          title: formData.title,
          description: formData.description || null,
          due_date: date.toISOString(),
          status: formData.status,
          priority: formData.priority,
          event_id: formData.eventId || null,
          assigned_to: formData.assignedTo || null,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Converter o formato do banco para o formato da aplicação
      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        dueDate: new Date(data.due_date),
        status: data.status as 'pendente' | 'em_andamento' | 'concluida',
        priority: data.priority as 'baixa' | 'media' | 'alta',
        eventId: data.event_id || undefined,
        assignedTo: data.assigned_to || undefined
      };
      
      onAddTask(newTask);
      toast.success('Tarefa adicionada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao adicionar tarefa:', error);
      toast.error(`Erro ao adicionar tarefa: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título da Tarefa *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="O que precisa ser feito?"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Data de Vencimento *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="event">Evento Relacionado</Label>
          <Select 
            value={formData.eventId} 
            onValueChange={(value) => handleSelectChange('eventId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um evento" />
            </SelectTrigger>
            <SelectContent>
              {events.length > 0 ? (
                events.map(event => (
                  <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>Nenhum evento disponível</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority">Prioridade</Label>
          <Select 
            value={formData.priority} 
            onValueChange={(value) => handleSelectChange('priority', value as 'baixa' | 'media' | 'alta')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange('status', value as 'pendente' | 'em_andamento' | 'concluida')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="assignedTo">Responsável</Label>
        <Input
          id="assignedTo"
          name="assignedTo"
          value={formData.assignedTo || ''}
          onChange={handleChange}
          placeholder="Nome do responsável"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Detalhes da tarefa"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-leju-pink hover:bg-leju-pink/90"
          disabled={loading}
        >
          {loading ? 'Adicionando...' : 'Adicionar Tarefa'}
        </Button>
      </div>
    </form>
  );
};
