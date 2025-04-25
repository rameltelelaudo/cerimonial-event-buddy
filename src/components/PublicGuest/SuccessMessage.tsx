
import React from 'react';
import { Button } from '@/components/ui/button';

interface SuccessMessageProps {
  onAddAnother: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ onAddAnother }) => {
  return (
    <div className="text-center py-6">
      <h3 className="text-xl text-green-600 font-semibold mb-2">Presença confirmada!</h3>
      <p className="mb-4">Obrigado por confirmar sua presença.</p>
      <Button 
        onClick={onAddAnother}
        className="bg-leju-pink hover:bg-leju-pink/90"
      >
        Adicionar outro convidado
      </Button>
    </div>
  );
};
