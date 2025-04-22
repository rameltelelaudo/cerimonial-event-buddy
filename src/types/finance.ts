
/**
 * Type definition for financial items in the application
 */
export interface Finance {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'receita' | 'despesa';
  status: 'pago' | 'pendente' | 'cancelado';
  date: Date;
  eventId: string;
  createdAt: Date;
}
