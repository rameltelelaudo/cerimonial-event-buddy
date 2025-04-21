
export interface Invitation {
  id: string;
  title: string;
  eventId: string;
  template: 'standard' | 'elegant' | 'casual' | 'custom';
  message: string;
  imageUrl?: string;
  createdAt: Date;
  sentCount: number;
}
