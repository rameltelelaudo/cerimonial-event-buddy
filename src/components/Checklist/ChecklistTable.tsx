
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
      <div className="p-4">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Convidados</h2>
          <div className="text-sm text-muted-foreground">
            {sortedGuests.filter(g => g.checkedIn).length}/{sortedGuests.length} confirmados
          </div>
        </div>
        
        {sortedGuests.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">Nenhum convidado encontrado</p>
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
          <TableHead>Nome</TableHead>
          <TableHead>Acompanhantes</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedGuests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">Nenhum convidado encontrado</TableCell>
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
