
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { 
  fetchUserEvents,
  addNewEvent,
  updateExistingEvent,
  deleteExistingEvent 
} from '@/services/eventService';

interface EventContextType {
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => Promise<Event | null>;
  updateEvent: (id: string, event: Partial<Omit<Event, 'id'>>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch events from Supabase when user is authenticated
  useEffect(() => {
    const loadEvents = async () => {
      if (!user) {
        setEvents([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const eventData = await fetchUserEvents(user.id);
        setEvents(eventData);

        // If there was a selected event, try to find it in the new data
        if (selectedEvent) {
          const updatedSelectedEvent = eventData.find(e => e.id === selectedEvent.id);
          if (updatedSelectedEvent) {
            setSelectedEvent(updatedSelectedEvent);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [user]);

  // Function to add a new event
  const addEvent = async (eventData: Omit<Event, 'id'>): Promise<Event | null> => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar eventos');
      return null;
    }

    const newEvent = await addNewEvent(user.id, eventData);
    if (newEvent) {
      // Update local state
      setEvents(prev => [newEvent, ...prev]);
    }
    return newEvent;
  };

  // Function to update an event
  const updateEvent = async (id: string, eventData: Partial<Omit<Event, 'id'>>): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado para editar eventos');
      return false;
    }

    const success = await updateExistingEvent(user.id, id, eventData);
    if (success) {
      // Update local state
      setEvents(prev => prev.map(event => {
        if (event.id === id) {
          return {
            ...event,
            ...eventData,
            // Ensure date is a Date object
            ...(eventData.date ? { date: new Date(eventData.date) } : {})
          };
        }
        return event;
      }));

      // If the updated event is the selected event, update it too
      if (selectedEvent && selectedEvent.id === id) {
        setSelectedEvent(prev => {
          if (!prev) return null;
          return {
            ...prev,
            ...eventData,
            // Ensure date is a Date object
            ...(eventData.date ? { date: new Date(eventData.date) } : {})
          };
        });
      }
    }
    return success;
  };

  // Function to delete an event
  const deleteEvent = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado para excluir eventos');
      return false;
    }

    const success = await deleteExistingEvent(user.id, id);
    if (success) {
      // Update local state
      setEvents(prev => prev.filter(event => event.id !== id));

      // If the deleted event is the selected event, clear it
      if (selectedEvent && selectedEvent.id === id) {
        setSelectedEvent(null);
      }
    }
    return success;
  };

  return (
    <EventContext.Provider value={{ 
      selectedEvent, 
      setSelectedEvent, 
      events, 
      addEvent,
      updateEvent,
      deleteEvent,
      loading
    }}>
      {children}
    </EventContext.Provider>
  );
};
