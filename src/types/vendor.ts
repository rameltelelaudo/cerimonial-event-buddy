
export interface Vendor {
  id: string;
  name: string;
  category: string;
  contactName: string;
  phone: string;
  email: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  notes?: string;
}
