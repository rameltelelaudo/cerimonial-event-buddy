
import React from 'react';
import { Event } from '@/types/event';
import { EventCard } from './EventCard';

interface EventListProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (event: Event) => void;
  onSelectEvent: (event: Event) => void;
  onImageUploaded?: (eventId: string, imageUrl: string) => void;
}

export const EventList = ({ 
  events, 
  onEditEvent, 
  onDeleteEvent, 
  onSelectEvent, 
  onImageUploaded 
}: EventListProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
          onSelectEvent={onSelectEvent}
          onImageUploaded={onImageUploaded}
        />
      ))}
    </div>
  );
};
