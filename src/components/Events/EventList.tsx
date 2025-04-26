
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Event } from '@/types/event';
import { Calendar, MapPin, Clock, Link as LinkIcon, Share2, Edit, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ImageUploadButton } from './ImageUploadButton';

interface EventListProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
  onSelectEvent: (event: Event) => void;
  onImageUploaded?: (eventId: string, imageUrl: string) => void;
}

export const EventList = ({ events, onEditEvent, onDeleteEvent, onSelectEvent, onImageUploaded }: EventListProps) => {
  const navigate = useNavigate();
  const [showSharePopover, setShowSharePopover] = React.useState<string | null>(null);
  
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

  const handleManageEvent = (event: Event) => {
    onSelectEvent(event);
    navigate('/guest-list');
  };

  const handleImageUploaded = (eventId: string, imageUrl: string) => {
    if (onImageUploaded) {
      onImageUploaded(eventId, imageUrl);
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card 
          key={event.id} 
          className="overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="h-32 bg-leju-pink/20 flex items-center justify-center relative">
            {event.coverImage ? (
              <img 
                src={event.coverImage} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Calendar className="h-12 w-12 text-leju-pink/60" />
            )}
            
            <div className="absolute top-2 right-2 flex gap-2">
              <ImageUploadButton 
                eventId={event.id} 
                onImageUploaded={(imageUrl) => handleImageUploaded(event.id, imageUrl)} 
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditEvent(event)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDeleteEvent(event)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
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
              onClick={() => handleManageEvent(event)}
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
  );
};
