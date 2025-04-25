
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GuestFormFields } from './GuestFormFields';
import { GuestGroup } from '@/types/guest';

interface GuestModalsProps {
  isEditGuestOpen: boolean;
  setIsEditGuestOpen: (open: boolean) => void;
  isDeleteGuestOpen: boolean;
  setIsDeleteGuestOpen: (open: boolean) => void;
  guest: {
    name: string;
    email: string;
    group: GuestGroup;
    companions: number;
    notes: string;
  };
  guestGroups: GuestGroup[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setGuest: (guest: any) => void;
  submitting: boolean;
  handleUpdateGuest: (e: React.FormEvent) => void;
  handleDeleteGuest: () => void;
}

export const GuestModals: React.FC<GuestModalsProps> = ({
  isEditGuestOpen,
  setIsEditGuestOpen,
  isDeleteGuestOpen,
  setIsDeleteGuestOpen,
  guest,
  guestGroups,
  handleInputChange,
  handleNumberInput,
  setGuest,
  submitting,
  handleUpdateGuest,
  handleDeleteGuest
}) => {
  return (
    <>
      <Dialog open={isEditGuestOpen} onOpenChange={setIsEditGuestOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Convidado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateGuest}>
            <GuestFormFields 
              guest={guest}
              guestGroups={guestGroups}
              handleInputChange={handleInputChange}
              handleNumberInput={handleNumberInput}
              setGuest={setGuest}
              submitting={submitting}
              isEdit={true}
            />
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteGuestOpen} onOpenChange={setIsDeleteGuestOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Convidado</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir este convidado? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteGuestOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteGuest}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
