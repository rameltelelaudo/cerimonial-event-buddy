
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEventContext } from '@/contexts/EventContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CalendarPlus, MapPin, Clock, Link as LinkIcon, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Events = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { events, addEvent, setSelectedEvent } = useEventContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSharePopover, setShowSharePopover] = useState<string | null>(null);
  
  // Estado para o formulário de novo evento
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    type: 'Casamento'
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setNewEvent(prev => ({ ...prev, type: value }));
  };
  
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    
    try {
      // Combinar data e hora em um objeto Date
      const dateTimeString = `${newEvent.date}T${newEvent.time || '00:00'}`;
      const eventDate = new Date(dateTimeString);
      
      if (isNaN(eventDate.getTime())) {
        throw new Error("Data inválida");
      }
      
      const event = {
        id: uuidv4(),
        title: newEvent.title,
        date: eventDate,
        location: newEvent.location,
        description: newEvent.description,
        type: newEvent.type,
        status: 'upcoming' as const
      };
      
      addEvent(event);
      
      toast.success("Evento adicionado com sucesso");
      setIsDialogOpen(false);
      
      // Resetar o formulário
      setNewEvent({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        type: 'Casamento'
      });
    } catch (error) {
      toast.error("Erro ao adicionar evento. Verifique os dados informados.");
      console.error(error);
    }
  };
  
  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    // Navegar para página de detalhes do evento ou lista de convidados
    navigate('/guest-list');
  };
  
  const getPublicFormUrl = (eventId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/public-guest-form/${eventId}`;
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Link copiado para a área de transferência");
        setShowSharePopover(null);
      })
      .catch(() => {
        toast.error("Erro ao copiar link");
      });
  };
  
  const shareViaWhatsApp = (eventId: string, eventTitle: string) => {
    const url = getPublicFormUrl(eventId);
    const message = encodeURIComponent(`Confirme sua presença no evento "${eventTitle}": ${url}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
    setShowSharePopover(null);
  };
  
  const shareViaEmail = (eventId: string, eventTitle: string) => {
    const url = getPublicFormUrl(eventId);
    const subject = encodeURIComponent(`Confirmação de presença: ${eventTitle}`);
    const body = encodeURIComponent(`Olá,\n\nConfirme sua presença no evento "${eventTitle}" através do link abaixo:\n\n${url}\n\nAguardamos você!`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setShowSharePopover(null);
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Eventos</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie seus eventos e cerimônias
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-leju-pink hover:bg-leju-pink/90">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Adicionar Evento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Evento</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleAddEvent} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Nome do Evento *</Label>
                    <Input 
                      id="title" 
                      name="title"
                      value={newEvent.title}
                      onChange={handleInputChange}
                      placeholder="Casamento Ana e João"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Evento</Label>
                    <Select
                      value={newEvent.type}
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
                        value={newEvent.date}
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
                        value={newEvent.time}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Local *</Label>
                    <Input 
                      id="location" 
                      name="location"
                      value={newEvent.location}
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
                      value={newEvent.description}
                      onChange={handleInputChange}
                      placeholder="Informações adicionais sobre o evento"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
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
          
          {events.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-32 bg-leju-pink/20 flex items-center justify-center relative">
                    <Calendar className="h-12 w-12 text-leju-pink/60" />
                    
                    <div className="absolute top-2 right-2">
                      <Popover open={showSharePopover === event.id} onOpenChange={(open) => setShowSharePopover(open ? event.id : null)}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72" align="end">
                          <div className="space-y-2">
                            <h4 className="font-medium">Compartilhar formulário de convite</h4>
                            <p className="text-sm text-muted-foreground">
                              Compartilhe este link para que os convidados confirmem presença
                            </p>
                            
                            <div className="flex items-center space-x-2">
                              <Input 
                                value={getPublicFormUrl(event.id)} 
                                readOnly 
                                className="flex-1 text-xs"
                              />
                              <Button 
                                size="sm" 
                                className="shrink-0" 
                                onClick={() => copyToClipboard(getPublicFormUrl(event.id))}
                              >
                                Copiar
                              </Button>
                            </div>
                            
                            <div className="flex space-x-2 pt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => shareViaWhatsApp(event.id, event.title)}
                              >
                                WhatsApp
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => shareViaEmail(event.id, event.title)}
                              >
                                Email
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>
                        {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        {' às '}
                        {format(new Date(event.date), "HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center mt-2 pt-2 border-t">
                      <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a 
                        href={`/public-guest-form/${event.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-leju-pink hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Formulário público de confirmação
                      </a>
                    </div>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="border-leju-pink text-leju-pink hover:bg-leju-pink/10"
                      onClick={() => handleSelectEvent(event)}
                    >
                      Gerenciar Evento
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
                      onClick={() => navigate(`/finances/${event.id}`)}
                    >
                      Financeiro
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-6 bg-white fade-in mt-4">
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-4">Nenhum evento cadastrado</h2>
                <p className="text-muted-foreground mb-6">
                  Você ainda não possui eventos cadastrados. Clique no botão abaixo para adicionar seu primeiro evento.
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)} 
                  className="bg-leju-pink hover:bg-leju-pink/90"
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Adicionar Evento
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Events;
