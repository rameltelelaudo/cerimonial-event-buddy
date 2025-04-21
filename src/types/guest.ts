
export type GuestGroup = 
  | 'Família' 
  | 'Padrinhos' 
  | 'Amigos' 
  | 'Colegas de Trabalho' 
  | 'Fornecedores' 
  | 'Outros';

export interface Guest {
  id: string;
  name: string;
  email?: string;
  group: GuestGroup;
  companions: number;
  notes?: string;
  checkedIn: boolean;
  checkInTime?: Date;
}

export interface GuestFilters {
  search: string;
  group: GuestGroup | 'Todos';
  status: 'Todos' | 'Confirmados' | 'Não Confirmados';
}
