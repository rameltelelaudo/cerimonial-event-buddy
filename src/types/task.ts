
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: 'pendente' | 'em_andamento' | 'concluida';
  priority: 'baixa' | 'media' | 'alta';
  eventId?: string;
  assignedTo?: string;
}
