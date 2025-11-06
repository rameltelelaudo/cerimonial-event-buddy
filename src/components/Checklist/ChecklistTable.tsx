
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChecklistGuestItem } from './ChecklistGuestItem';
import type { Guest } from '@/types/guest';

interface ChecklistTableProps {
  guests: Guest[];
  onCheckIn: (id: string) => void;
  isMobile: boolean;
}

export const ChecklistTable = ({ guests, onCheckIn, isMobile }: ChecklistTableProps) => {
  // Sort guests alphabetically by name
  const sortedGuests = [...guests].sort((a, b) => a.name.localeCompare(b.name));
  
  if (isMobile) {
    return (
      <div className="p-5">
        <div className="mb-5 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Convidados</h2>
          <div className="text-lg text-muted-foreground font-medium">
            {sortedGuests.filter(g => g.checkedIn).length}/{sortedGuests.length}
          </div>
        </div>
        
        {sortedGuests.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground text-lg">Nenhum convidado encontrado</p>
        ) : (
          <div className="space-y-3">
            {sortedGuests.map(guest => (
              <ChecklistGuestItem 
                key={guest.id}
                id={guest.id}
                name={guest.name}
                companions={guest.companions}
                checkedIn={guest.checkedIn}
                checkInTime={guest.checkInTime}
                onCheckIn={onCheckIn}
                isMobile={isMobile}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-lg">Nome</TableHead>
          <TableHead className="text-lg">Acompanhantes</TableHead>
          <TableHead className="text-lg">Status</TableHead>
          <TableHead className="text-lg">Ação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedGuests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-lg py-8">Nenhum convidado encontrado</TableCell>
          </TableRow>
        ) : (
          sortedGuests.map(guest => (
            <ChecklistGuestItem 
              key={guest.id}
              id={guest.id}
              name={guest.name}
              companions={guest.companions}
              checkedIn={guest.checkedIn}
              checkInTime={guest.checkInTime}
              onCheckIn={onCheckIn}
              isMobile={isMobile}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};
