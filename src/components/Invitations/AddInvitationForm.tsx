
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { v4 as uuidv4 } from 'uuid';
import { Invitation } from '@/types/invitation';
import { toast } from 'sonner';
import { useEventContext } from '@/contexts/EventContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AddInvitationFormProps {
  onAddInvitation: (invitation: Invitation) => void;
  onCancel: () => void;
}

const templates = [
  { id: 'standard', name: 'Padrão', bgColor: 'bg-white', textColor: 'text-gray-900' },
  { id: 'elegant', name: 'Elegante', bgColor: 'bg-gray-900', textColor: 'text-white' },
  { id: 'casual', name: 'Casual', bgColor: 'bg-blue-50', textColor: 'text-blue-900' },
  { id: 'custom', name: 'Personalizado', bgColor: 'bg-leju-pink/10', textColor: 'text-leju-pink' }
];

export const AddInvitationForm = ({ onAddInvitation, onCancel }: AddInvitationFormProps) => {
  const { events } = useEventContext();
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState<Omit<Invitation, 'id' | 'createdAt' | 'sentCount'>>({
    title: '',
    eventId: events.length > 0 ? events[0].id : '',
    template: 'standard',
    message: '',
    imageUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.eventId || !formData.message) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    
    const newInvitation: Invitation = {
      id: uuidv4(),
      ...formData,
      createdAt: new Date(),
      sentCount: 0
    };
    
    onAddInvitation(newInvitation);
    toast.success('Convite criado com sucesso!');
  };

  const getSelectedEvent = () => {
    return events.find(event => event.id === formData.eventId);
  };

  const selectedEvent = getSelectedEvent();
  const selectedTemplate = templates.find(t => t.id === formData.template);

  const handleSendWhatsApp = () => {
    // Simular envio por WhatsApp
    toast.success('Link de envio por WhatsApp gerado!', {
      description: 'O link foi copiado para área de transferência.',
    });
  };

  const handleSendEmail = () => {
    // Simular envio por Email
    toast.success('Convites enviados por email!', {
      description: 'Os convites foram enviados para a lista de convidados do evento.',
    });
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="preview">Visualização</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Convite *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Convite para Casamento"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event">Evento *</Label>
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
                    <SelectItem value="none" disabled>Nenhum evento disponível</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template">Modelo de Convite</Label>
              <Select 
                value={formData.template} 
                onValueChange={(value) => handleSelectChange('template', value as 'standard' | 'elegant' | 'casual' | 'custom')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem (opcional)</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ''}
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
                placeholder="Digite a mensagem do convite"
                rows={4}
                required
              />
            </div>
            
            <div className="flex justify-between space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <div className="space-x-2">
                <Button type="button" variant="outline" onClick={() => setActiveTab('preview')}>
                  Visualizar
                </Button>
                <Button type="submit" className="bg-leju-pink hover:bg-leju-pink/90">
                  Criar Convite
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="preview">
          <div className="space-y-4">
            <Card className={`p-6 ${selectedTemplate?.bgColor} ${selectedTemplate?.textColor} rounded-lg shadow`}>
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold">{formData.title || "Título do Convite"}</h3>
                
                {formData.imageUrl && (
                  <div className="my-4">
                    <img 
                      src={formData.imageUrl} 
                      alt="Imagem do convite" 
                      className="max-h-40 mx-auto object-contain rounded"
                    />
                  </div>
                )}
                
                <div className="text-lg font-semibold">
                  {selectedEvent?.title || "Nome do Evento"}
                </div>
                
                {selectedEvent && (
                  <div>
                    <p>{format(new Date(selectedEvent.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'", { locale: ptBR })}</p>
                    <p>{selectedEvent.location}</p>
                  </div>
                )}
                
                <div className="my-4 text-sm whitespace-pre-line">
                  {formData.message || "Mensagem do convite aparecerá aqui"}
                </div>
              </div>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-4">
              <Button variant="outline" className="flex-1" onClick={handleSendWhatsApp}>
                Compartilhar via WhatsApp
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleSendEmail}>
                Enviar por Email
              </Button>
            </div>
            
            <div className="flex justify-between space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveTab('details')}>
                Voltar
              </Button>
              <Button 
                type="button" 
                className="bg-leju-pink hover:bg-leju-pink/90"
                onClick={handleSubmit}
              >
                Criar Convite
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
