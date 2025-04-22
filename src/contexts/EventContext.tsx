
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface EventContextType {
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => Promise<Event | null>;
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
    const fetchEvents = async () => {
      if (!user) {
        setEvents([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform data to match Event type
        const transformedEvents: Event[] = data.map(event => ({
          id: event.id,
          title: event.title,
          date: new Date(event.date),
          location: event.location,
          description: event.description || '',
          type: 'Casamento', // Default type since it's not in the database yet
          status: 'upcoming' as const, // Default status since it's not in the database yet
          user_id: event.user_id,
          created_at: event.created_at,
          updated_at: event.updated_at
        }));

        setEvents(transformedEvents);

        // If there was a selected event, try to find it in the new data
        if (selectedEvent) {
          const updatedSelectedEvent = transformedEvents.find(e => e.id === selectedEvent.id);
          if (updatedSelectedEvent) {
            setSelectedEvent(updatedSelectedEvent);
          }
        }
      } catch (error: any) {
        console.error('Error fetching events:', error);
        toast.error('Erro ao carregar eventos: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  // Function to add a new event
  const addEvent = async (eventData: Omit<Event, 'id'>): Promise<Event | null> => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar eventos');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          date: eventData.date.toISOString(),
          location: eventData.location,
          description: eventData.description,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Transform the returned data to match Event type
      const newEvent: Event = {
        id: data.id,
        title: data.title,
        date: new Date(data.date),
        location: data.location,
        description: data.description || '',
        type: 'Casamento', // Default type since it's not in the database yet
        status: 'upcoming' as const, // Default status since it's not in the database yet
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      // Update local state
      setEvents(prev => [newEvent, ...prev]);
      
      return newEvent;
    } catch (error: any) {
      console.error('Error adding event:', error);
      toast.error('Erro ao adicionar evento: ' + error.message);
      return null;
    }
  };

  return (
    <EventContext.Provider value={{ 
      selectedEvent, 
      setSelectedEvent, 
      events, 
      addEvent,
      loading
    }}>
      {children}
    </EventContext.Provider>
  );
};
