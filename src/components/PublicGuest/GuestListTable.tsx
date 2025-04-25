
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface GuestListTableProps {
  guests: any[];
  handleEditGuest: (guest: any) => void;
  setSelectedGuestId: (id: string) => void;
  setIsDeleteGuestOpen: (isOpen: boolean) => void;
}

export const GuestListTable: React.FC<GuestListTableProps> = ({
  guests,
  handleEditGuest,
  setSelectedGuestId,
  setIsDeleteGuestOpen
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead className="hidden md:table-cell">Grupo</TableHead>
          <TableHead className="text-center">Acompanhantes</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {guests.length > 0 ? (
          guests.map((guestItem) => (
            <TableRow 
              key={guestItem.id} 
              className={guestItem.checked_in ? 'bg-green-50' : ''}
            >
              <TableCell className="font-medium">{guestItem.name}</TableCell>
              <TableCell className="hidden md:table-cell">{guestItem.group_type}</TableCell>
              <TableCell className="text-center">{guestItem.companions}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditGuest(guestItem)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedGuestId(guestItem.id);
                      setIsDeleteGuestOpen(true);
                    }}
                    className="h-8 w-8 p-0 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
              Nenhum convidado encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
