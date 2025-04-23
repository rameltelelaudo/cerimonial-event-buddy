
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Finance } from '@/types/finance';
import { FinanceForm } from '@/components/Finances/FinanceForm';

interface FinanceModalsProps {
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;

  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;

  selectedFinance: Finance | null;
  newFinance: {
    description: string;
    amount: number;
    category: string;
    type: string;
    status: string;
    date: string;
  };
  // Corrigido: onInputChange aceita Input, TextArea ou Select via HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  // onSelectChange recebe nome e valor
  onSelectChange: (name: string, value: string) => void;
  onAddSubmit: (e: React.FormEvent) => void;
  onUpdateSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const FinanceModals: React.FC<FinanceModalsProps> = ({
  isAddModalOpen,
  setIsAddModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  selectedFinance,
  newFinance,
  onInputChange,
  onSelectChange,
  onAddSubmit,
  onUpdateSubmit,
  onCancel
}) => {
  return (
    <>
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Item Financeiro</DialogTitle>
          </DialogHeader>
          <FinanceForm
            finance={newFinance}
            onInputChange={onInputChange}
            onSelectChange={onSelectChange}
            onSubmit={onAddSubmit}
            onCancel={() => setIsAddModalOpen(false)}
            submitButtonText="Adicionar"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Item Financeiro</DialogTitle>
          </DialogHeader>
          <FinanceForm
            finance={newFinance}
            onInputChange={onInputChange}
            onSelectChange={onSelectChange}
            onSubmit={onUpdateSubmit}
            onCancel={() => setIsEditModalOpen(false)}
            submitButtonText="Atualizar"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

