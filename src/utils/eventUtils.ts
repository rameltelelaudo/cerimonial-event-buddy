
import { Event } from '@/types/event';

// Function to validate event status
export const validateEventStatus = (status: string): 'upcoming' | 'ongoing' | 'completed' => {
  if (status === 'upcoming' || status === 'ongoing' || status === 'completed') {
    return status;
  }
  // If the value isn't valid, return a default value
  return 'upcoming';
};

// Function to format date for display
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Function to transform data from Supabase to Event type
export const transformEventData = (data: any): Event => ({
  id: data.id,
  title: data.title,
  date: new Date(data.date),
  location: data.location,
  description: data.description || '',
  type: data.type || 'Casamento',
  status: validateEventStatus(data.status || 'upcoming'),
  coverImage: data.cover_image,
  user_id: data.user_id,
  created_at: data.created_at,
  updated_at: data.updated_at,
  contractorName: data.contractor_name,
  contractorCPF: data.contractor_cpf
});
