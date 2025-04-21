
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event } from '@/types/event';

interface EventContextType {
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  events: Event[];
  addEvent: (event: Event) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  // Carregar eventos do localStorage ao iniciar
  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        // Converter strings de data para objetos Date
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(eventsWithDates);
        
        // Se houver um evento selecionado salvo, restaurá-lo
        const savedSelectedEventId = localStorage.getItem('selectedEventId');
        if (savedSelectedEventId) {
          const savedEvent = eventsWithDates.find((e: Event) => e.id === savedSelectedEventId);
          if (savedEvent) {
            setSelectedEvent(savedEvent);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      }
    }
  }, []);

  // Salvar eventos no localStorage quando mudar
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);

  // Salvar ID do evento selecionado
  useEffect(() => {
    if (selectedEvent) {
      localStorage.setItem('selectedEventId', selectedEvent.id);
    } else {
      localStorage.removeItem('selectedEventId');
    }
  }, [selectedEvent]);

  const addEvent = (newEvent: Event) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  return (
    <EventContext.Provider value={{ selectedEvent, setSelectedEvent, events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};
