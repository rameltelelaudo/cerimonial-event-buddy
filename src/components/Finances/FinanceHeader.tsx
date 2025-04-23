
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface FinanceHeaderProps {
  title: string;
  onAddClick: () => void;
}

export const FinanceHeader: React.FC<FinanceHeaderProps> = ({ title, onAddClick }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Button className="bg-leju-pink hover:bg-leju-pink/90" onClick={onAddClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Adicionar Item
      </Button>
    </div>
  );
};
