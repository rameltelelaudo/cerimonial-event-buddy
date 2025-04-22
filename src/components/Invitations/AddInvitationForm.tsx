
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEventContext } from '@/contexts/EventContext';
import { Invitation } from '@/types/invitation';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddInvitationFormProps {
  onAddInvitation: (invitation: Invitation) => void;
  onCancel: () => void;
}

export const AddInvitationForm = ({ onAddInvitation, onCancel }: AddInvitationFormProps) => {
  const { events } = useEventContext();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    eventId: events.length > 0 ? events[0].id : '',
    template: 'standard',
    message: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message || !formData.eventId) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    
    if (!user) {
      toast.error('Você precisa estar logado para criar convites');
      return;
    }
    
    setLoading(true);
    
    try {
      // Salvar no Supabase
      const { data, error } = await supabase
        .from('leju_invitations')
        .insert({
          title: formData.title,
          event_id: formData.eventId,
          template: formData.template as 'standard' | 'elegant' | 'casual' | 'custom',
          message: formData.message,
          image_url: formData.imageUrl || null,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Converter o formato do banco para o formato da aplicação
      const newInvitation: Invitation = {
        id: data.id,
        title: data.title,
        eventId: data.event_id || '',
        template: data.template as 'standard' | 'elegant' | 'casual' | 'custom',
        message: data.message,
        imageUrl: data.image_url || undefined,
        createdAt: new Date(data.created_at),
        sentCount: data.sent_count
      };
      
      onAddInvitation(newInvitation);
      toast.success('Convite criado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar convite:', error);
      toast.error(`Erro ao criar convite: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Convite *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ex: Convite para casamento de Ana e João"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="eventId">Evento *</Label>
        <Select 
          value={formData.eventId} 
          onValueChange={(value) => handleSelectChange('eventId', value)}
          required
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
              <SelectItem value="" disabled>Nenhum evento disponível</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="template">Modelo do Convite</Label>
        <Select 
          value={formData.template} 
          onValueChange={(value) => handleSelectChange('template', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um modelo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Padrão</SelectItem>
            <SelectItem value="elegant">Elegante</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL da Imagem (opcional)</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Mensagem do Convite *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Escreva a mensagem do convite..."
          rows={5}
          required
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
          {loading ? 'Criando...' : 'Criar Convite'}
        </Button>
      </div>
    </form>
  );
};
