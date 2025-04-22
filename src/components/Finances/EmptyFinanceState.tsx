
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyFinanceStateProps {
  onAddNew: () => void;
}

export const EmptyFinanceState: React.FC<EmptyFinanceStateProps> = ({ onAddNew }) => {
  return (
    <div className="border rounded-lg p-6 bg-white fade-in mt-4">
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Nenhum item financeiro cadastrado</h2>
        <p className="text-muted-foreground mb-6">
          Adicione itens financeiros para controlar as finanças do seu evento.
        </p>
        <Button 
          onClick={onAddNew} 
          className="bg-leju-pink hover:bg-leju-pink/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Item
        </Button>
      </div>
    </div>
  );
};
