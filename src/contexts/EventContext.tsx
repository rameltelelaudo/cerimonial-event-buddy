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

// Função auxiliar para garantir que o status seja um dos valores permitidos
const validateEventStatus = (status: string): 'upcoming' | 'ongoing' | 'completed' => {
  if (status === 'upcoming' || status === 'ongoing' || status === 'completed') {
    return status;
  }
  // Se o valor não for válido, retorna um valor padrão
  return 'upcoming';
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
          .from('leju_events')
          .select('*')
          .eq('user_id', user.id)
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
          type: event.type || 'Casamento',
          status: validateEventStatus(event.status || 'upcoming'),
          coverImage: event.cover_image,
          user_id: event.user_id,
          created_at: event.created_at,
          updated_at: event.updated_at,
          contractorName: event.contractor_name,
          contractorCPF: event.contractor_cpf
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
        .from('leju_events')
        .insert({
          title: eventData.title,
          date: eventData.date.toISOString(),
          location: eventData.location,
          description: eventData.description,
          type: eventData.type || 'Casamento',
          status: validateEventStatus(eventData.status || 'upcoming'),
          cover_image: eventData.coverImage,
          user_id: user.id,
          contractor_name: eventData.contractorName,
          contractor_cpf: eventData.contractorCPF
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
        type: data.type || 'Casamento',
        status: validateEventStatus(data.status),
        coverImage: data.cover_image,
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        contractorName: data.contractor_name,
        contractorCPF: data.contractor_cpf
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

  // Function to update an event
  const updateEvent = async (id: string, eventData: Partial<Omit<Event, 'id'>>): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado para editar eventos');
      return false;
    }

    try {
      // Prepare data for update
      const updateData: any = {};
      if (eventData.title !== undefined) updateData.title = eventData.title;
      if (eventData.location !== undefined) updateData.location = eventData.location;
      if (eventData.description !== undefined) updateData.description = eventData.description;
      if (eventData.type !== undefined) updateData.type = eventData.type;
      if (eventData.status !== undefined) updateData.status = validateEventStatus(eventData.status);
      if (eventData.coverImage !== undefined) updateData.cover_image = eventData.coverImage;
      if (eventData.date !== undefined) updateData.date = eventData.date.toISOString();
      if (eventData.contractorName !== undefined) updateData.contractor_name = eventData.contractorName;
      if (eventData.contractorCPF !== undefined) updateData.contractor_cpf = eventData.contractorCPF;

      const { error } = await supabase
        .from('leju_events')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

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

      toast.success('Evento atualizado com sucesso');
      return true;
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast.error('Erro ao atualizar evento: ' + error.message);
      return false;
    }
  };

  // Function to delete an event
  const deleteEvent = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('Você precisa estar logado para excluir eventos');
      return false;
    }

    try {
      const { error } = await supabase
        .from('leju_events')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setEvents(prev => prev.filter(event => event.id !== id));

      // If the deleted event is the selected event, clear it
      if (selectedEvent && selectedEvent.id === id) {
        setSelectedEvent(null);
      }

      toast.success('Evento excluído com sucesso');
      return true;
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error('Erro ao excluir evento: ' + error.message);
      return false;
    }
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
