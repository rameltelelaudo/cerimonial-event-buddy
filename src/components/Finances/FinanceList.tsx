
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Finance } from '@/types/finance';
import { FinanceTable } from '@/components/Finances/FinanceTable';
import { EmptyFinanceState } from '@/components/Finances/EmptyFinanceState';

interface FinanceListProps {
  finances: Finance[];
  isLoading: boolean;
  onEdit: (finance: Finance) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const FinanceList: React.FC<FinanceListProps> = ({
  finances,
  isLoading,
  onEdit,
  onDelete,
  onAddNew
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-leju-pink" />
        <span className="ml-2">Carregando dados financeiros...</span>
      </div>
    );
  }

  if (finances.length === 0) {
    return <EmptyFinanceState onAddNew={onAddNew} />;
  }

  return (
    <FinanceTable 
      finances={finances}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};
