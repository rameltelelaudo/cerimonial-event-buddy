
export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  description: string;
  type: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  coverImage?: string;
}
