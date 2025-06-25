
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Star } from 'lucide-react';
import { formatDate } from '@/utils/eventUtils';
import { Event } from '@/types/event';
import { EventCardActions } from './EventCardActions';

interface EventCardProps {
  event: Event;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
  onSelectEvent?: (event: Event) => void;
  isSelected?: boolean;
  onImageUploaded?: (eventId: string, imageUrl: string) => void;
}

export function EventCard({ event, onEditEvent, onDeleteEvent, onSelectEvent, isSelected }: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planejamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmado':
        return 'bg-green-100 text-green-800';
      case 'Realizado':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const shareGuestForm = () => {
    const baseUrl = 'https://leju-assessment-app.lovable.app';
    const url = `${baseUrl}/public-guest-form/${event.id}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
        isSelected ? 'ring-2 ring-leju-pink' : ''
      }`}
      onClick={() => onSelectEvent?.(event)}
    >
      <CardContent className="p-0">
        {(event.image || event.coverImage) && (
          <div className="w-full h-48 overflow-hidden rounded-t-lg">
            <img
              src={event.image || event.coverImage}
              alt={event.title}
              className="w-full h-full object-contain bg-gray-50"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {event.title}
            </h3>
            <Badge className={getStatusColor(event.status)}>
              {event.status}
            </Badge>
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

          {event.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm text-gray-600">Evento</span>
            </div>
            
            <EventCardActions
              event={event}
              onEditEvent={onEditEvent}
              onDeleteEvent={onDeleteEvent}
              shareGuestForm={shareGuestForm}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
