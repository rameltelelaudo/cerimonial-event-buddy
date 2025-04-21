
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { GuestTable } from '@/components/GuestList/GuestTable';
import { AddGuestForm } from '@/components/GuestList/AddGuestForm';
import { GuestStats } from '@/components/GuestList/GuestStats';
import { Guest } from '@/types/guest';
import { initialGuests } from '@/data/guestsData';

const GuestList = () => {
  const isMobile = useIsMobile();
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  
  const handleAddGuest = (guest: Guest) => {
    setGuests([...guests, guest]);
  };
  
  const handleCheckIn = (id: string) => {
    setGuests(guests.map(guest => 
      guest.id === id 
        ? { ...guest, checkedIn: true, checkInTime: new Date() } 
        : guest
    ));
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Lista de Convidados</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie seus convidados e realize check-in
              </p>
            </div>
            <AddGuestForm onAddGuest={handleAddGuest} />
          </div>
          
          <GuestStats guests={guests} />
          
          <GuestTable guests={guests} onCheckIn={handleCheckIn} />
        </main>
      </div>
    </div>
  );
};

export default GuestList;
