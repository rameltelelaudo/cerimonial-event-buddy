
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/event';
import { validateEventStatus, transformEventData } from '@/utils/eventUtils';
import { toast } from 'sonner';

// Fetch events for a user
export const fetchUserEvents = async (userId: string): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('leju_events')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(transformEventData);
  } catch (error: any) {
    console.error('Error fetching events:', error);
    toast.error('Erro ao carregar eventos: ' + error.message);
    return [];
  }
};

// Add a new event
export const addNewEvent = async (userId: string, eventData: Omit<Event, 'id'>): Promise<Event | null> => {
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
        user_id: userId,
        contractor_name: eventData.contractorName,
        contractor_cpf: eventData.contractorCPF
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return transformEventData(data);
  } catch (error: any) {
    console.error('Error adding event:', error);
    toast.error('Erro ao adicionar evento: ' + error.message);
    return null;
  }
};

// Update an existing event
export const updateExistingEvent = async (
  userId: string, 
  eventId: string, 
  eventData: Partial<Omit<Event, 'id'>>
): Promise<boolean> => {
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
      .eq('id', eventId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    toast.success('Evento atualizado com sucesso');
    return true;
  } catch (error: any) {
    console.error('Error updating event:', error);
    toast.error('Erro ao atualizar evento: ' + error.message);
    return false;
  }
};

// Delete an event
export const deleteExistingEvent = async (userId: string, eventId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('leju_events')
      .delete()
      .eq('id', eventId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    toast.success('Evento excluído com sucesso');
    return true;
  } catch (error: any) {
    console.error('Error deleting event:', error);
    toast.error('Erro ao excluir evento: ' + error.message);
    return false;
  }
};
