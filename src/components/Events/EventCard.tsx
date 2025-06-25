
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';
import { Calendar, MapPin, Clock, Link as LinkIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ImageUploadButton } from './ImageUploadButton';
import { EventCardActions } from './EventCardActions';
import { ShareEventPopover } from './ShareEventPopover';

interface EventCardProps {
  event: Event;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
  onSelectEvent: (event: Event) => void;
  onImageUploaded?: (eventId: string, imageUrl: string) => void;
}

export const EventCard = ({
  event,
  onEditEvent,
  onDeleteEvent,
  onSelectEvent,
  onImageUploaded
}: EventCardProps) => {
  const navigate = useNavigate();
  const [showSharePopover, setShowSharePopover] = React.useState(false);

  const handleManageEvent = () => {
    onSelectEvent(event);
    navigate('/guest-list');
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (onImageUploaded) {
      onImageUploaded(event.id, imageUrl);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-32 bg-leju-pink/20 flex items-center justify-center relative">
        {event.coverImage ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <img 
              src={event.coverImage} 
              alt={event.title} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          <Calendar className="h-12 w-12 text-leju-pink/60" />
        )}
        
        <div className="absolute top-2 right-2 flex gap-2">
          <ImageUploadButton 
            eventId={event.id} 
            onImageUploaded={handleImageUploaded} 
          />
          
          <EventCardActions 
            event={event} 
            onEditEvent={onEditEvent} 
            onDeleteEvent={onDeleteEvent} 
          />
          
          <ShareEventPopover
            eventId={event.id}
            eventTitle={event.title}
            isOpen={showSharePopover}
            onOpenChange={setShowSharePopover}
          />
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
      <CardFooter className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          className="border-leju-pink text-leju-pink hover:bg-leju-pink/10"
          onClick={handleManageEvent}
        >
          Gerenciar
        </Button>
        <Button
          variant="outline"
          className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
          onClick={() => navigate(`/finances/${event.id}`)}
        >
          Financeiro
        </Button>
        <Button
          variant="outline"
          className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
          onClick={() => navigate(`/contract/${event.id}`)}
        >
          <FileText className="h-4 w-4 mr-1" />
          Contrato
        </Button>
      </CardFooter>
    </Card>
  );
}
