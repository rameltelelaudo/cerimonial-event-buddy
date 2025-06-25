
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, Star, Upload, Share2 } from 'lucide-react';
import { formatDate } from '@/utils/eventUtils';
import { Event } from '@/types/event';
import { EventCardActions } from './EventCardActions';
import { ShareEventPopover } from './ShareEventPopover';
import { ImageUploadButton } from './ImageUploadButton';
import { useState } from 'react';

interface EventCardProps {
  event: Event;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
  onSelectEvent?: (event: Event) => void;
  isSelected?: boolean;
  onImageUploaded?: (eventId: string, imageUrl: string) => void;
}

export function EventCard({ 
  event, 
  onEditEvent, 
  onDeleteEvent, 
  onSelectEvent, 
  isSelected,
  onImageUploaded 
}: EventCardProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const shareGuestForm = () => {
    const baseUrl = 'https://app.lejuassessoria.com.br';
    const url = `${baseUrl}/public-guest-form/${event.id}`;
    navigator.clipboard.writeText(url);
  };

  const getPublicFormUrl = () => {
    const baseUrl = 'https://app.lejuassessoria.com.br';
    return `${baseUrl}/public-guest-form/${event.id}`;
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
        isSelected ? 'ring-2 ring-leju-pink' : ''
      }`}
      onClick={() => onSelectEvent?.(event)}
    >
      <CardContent className="p-0">
        {/* Header com três pontinhos */}
        <div className="relative">
          {(event.image || event.coverImage) && (
            <div className="w-full h-48 overflow-hidden rounded-t-lg">
              <img
                src={event.image || event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex gap-2">
            {onImageUploaded && (
              <ImageUploadButton
                eventId={event.id}
                onImageUploaded={onImageUploaded}
              />
            )}
            
            <ShareEventPopover
              eventId={event.id}
              eventTitle={event.title}
              isOpen={isShareOpen}
              onOpenChange={setIsShareOpen}
            />
            
            <EventCardActions
              event={event}
              onEditEvent={onEditEvent}
              onDeleteEvent={onDeleteEvent}
              shareGuestForm={shareGuestForm}
            />
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {event.title}
              </h3>
              <Badge className={getStatusColor(event.status)}>
                {event.type}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <CalendarDays className="h-4 w-4 mr-2" />
              {formatDate(event.date)}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {event.location}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              {event.guestCount || 0} convidados
            </div>
          </div>

          {/* Link do formulário público */}
          <div className="mb-4">
            <div className="flex items-center text-sm text-leju-pink mb-2">
              <Share2 className="h-4 w-4 mr-2" />
              <a 
                href={getPublicFormUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Formulário público de confirmação
              </a>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="text-leju-pink border-leju-pink hover:bg-leju-pink hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                // Navegar para gerenciar (lista de convidados)
                window.location.href = '/guest-list';
              }}
            >
              Gerenciar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/finances/${event.id}`;
              }}
            >
              Financeiro
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/contract/${event.id}`;
              }}
            >
              Contrato
            </Button>
          </div>

          {event.description && (
            <p className="text-sm text-gray-600 mt-4 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
