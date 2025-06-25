
export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  description: string;
  type: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  coverImage?: string;
  image?: string; // Add image property
  guestCount?: number; // Add guestCount property
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  // Campos para contrato
  contractorName?: string;
  contractorCPF?: string;
}
