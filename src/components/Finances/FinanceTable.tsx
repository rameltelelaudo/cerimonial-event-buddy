
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Finance } from '@/types/finance';

interface FinanceTableProps {
  finances: Finance[];
  onEdit: (finance: Finance) => void;
  onDelete: (id: string) => void;
}

export const FinanceTable: React.FC<FinanceTableProps> = ({
  finances,
  onEdit,
  onDelete
}) => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {finances.map((finance) => (
            <TableRow key={finance.id}>
              <TableCell className="font-medium">{finance.description}</TableCell>
              <TableCell>R$ {finance.amount.toFixed(2)}</TableCell>
              <TableCell>{finance.category}</TableCell>
              <TableCell>{finance.type}</TableCell>
              <TableCell>{finance.status}</TableCell>
              <TableCell>{format(new Date(finance.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(finance)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(finance.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
