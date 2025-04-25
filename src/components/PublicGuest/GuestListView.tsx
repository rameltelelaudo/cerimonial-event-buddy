
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GuestListTable } from './GuestListTable';

interface GuestListViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredGuests: any[];
  handleEditGuest: (guest: any) => void;
  setSelectedGuestId: (id: string) => void;
  setIsDeleteGuestOpen: (isOpen: boolean) => void;
}

export const GuestListView: React.FC<GuestListViewProps> = ({
  searchQuery,
  setSearchQuery,
  filteredGuests,
  handleEditGuest,
  setSelectedGuestId,
  setIsDeleteGuestOpen
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar convidados..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border overflow-hidden">
        <GuestListTable 
          guests={filteredGuests}
          handleEditGuest={handleEditGuest}
          setSelectedGuestId={setSelectedGuestId}
          setIsDeleteGuestOpen={setIsDeleteGuestOpen}
        />
      </div>
    </div>
  );
};
