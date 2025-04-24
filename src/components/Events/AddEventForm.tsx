
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Event } from '@/types/event';
import { format } from 'date-fns';

interface AddEventFormProps {
  onSubmit: (eventData: Omit<Event, 'id'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  initialData?: Event;
  mode?: 'add' | 'edit';
}

export const AddEventForm = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting, 
  initialData,
  mode = 'add'
}: AddEventFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    date: initialData?.date ? format(new Date(initialData.date), 'yyyy-MM-dd') : '',
    time: initialData?.date ? format(new Date(initialData.date), 'HH:mm') : '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    type: initialData?.type || 'Casamento'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.location) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    
    try {
      const dateTimeString = `${formData.date}T${formData.time || '00:00'}`;
      const eventDate = new Date(dateTimeString);
      
      if (isNaN(eventDate.getTime())) {
        throw new Error("Data inválida");
      }
      
      const eventData = {
        title: formData.title,
        date: eventDate,
        location: formData.location,
        description: formData.description,
        type: formData.type,
        status: 'upcoming' as const
      };
      
      await onSubmit(eventData);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Erro ao processar formulário. Verifique os dados informados.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Nome do Evento *</Label>
        <Input 
          id="title" 
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Casamento Ana e João"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Evento</Label>
        <Select
          value={formData.type}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Casamento">Casamento</SelectItem>
            <SelectItem value="Aniversário">Aniversário</SelectItem>
            <SelectItem value="Corporativo">Corporativo</SelectItem>
            <SelectItem value="Outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data *</Label>
          <Input 
            id="date" 
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Hora</Label>
          <Input 
            id="time" 
            name="time"
            type="time"
            value={formData.time}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Local *</Label>
        <Input 
          id="location" 
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Nome e endereço do local"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea 
          id="description" 
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Informações adicionais sobre o evento"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          variant="outline" 
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-leju-pink hover:bg-leju-pink/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'add' ? 'Adicionando...' : 'Atualizando...'}
            </>
          ) : (
            mode === 'add' ? "Adicionar" : "Salvar Alterações"
          )}
        </Button>
      </div>
    </form>
  );
};
