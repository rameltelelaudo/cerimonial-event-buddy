
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEventContext } from '@/contexts/EventContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import type { Guest, GuestGroup } from '@/types/guest';
import { ChecklistFilters } from '@/components/Checklist/ChecklistFilters';
import { ChecklistTable } from '@/components/Checklist/ChecklistTable';
import { ChecklistStats } from '@/components/Checklist/ChecklistStats';

const Checklist = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { selectedEvent } = useEventContext();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!selectedEvent) {
      toast.info("Selecione um evento primeiro");
      navigate('/events');
    }
  }, [selectedEvent, navigate]);
  
  useEffect(() => {
    const fetchGuests = async () => {
      if (!selectedEvent) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('leju_guests')
          .select('*')
          .eq('event_id', selectedEvent.id)
          .order('name', { ascending: true });
          
        if (error) throw error;
        
        const transformedGuests: Guest[] = data.map(g => ({
          id: g.id,
          name: g.name,
          email: g.email || undefined,
          group: g.group_type as GuestGroup,
          companions: g.companions,
          notes: g.notes || undefined,
          checkedIn: g.checked_in,
          checkInTime: g.check_in_time ? new Date(g.check_in_time) : undefined
        }));
        
        setGuests(transformedGuests);
      } catch (error: any) {
        console.error('Error fetching guests:', error);
        toast.error('Erro ao carregar convidados: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuests();
  }, [selectedEvent]);
  
  const handleCheckIn = async (id: string) => {
    if (!selectedEvent) return;
    
    try {
      const checkInTime = new Date();
      
      const { error } = await supabase
        .from('leju_guests')
        .update({ 
          checked_in: true, 
          check_in_time: checkInTime.toISOString() 
        })
        .eq('id', id);
        
      if (error) throw error;
      
      setGuests(guests.map(guest => 
        guest.id === id 
          ? { ...guest, checkedIn: true, checkInTime } 
          : guest
      ));
      
      toast.success('Check-in realizado com sucesso!');
    } catch (error: any) {
      console.error('Error during check-in:', error);
      toast.error('Erro ao realizar check-in: ' + error.message);
    }
  };
  
  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!selectedEvent) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-4 sm:p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/events')}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl sm:text-3xl font-bold">{selectedEvent.title}</h1>
            </div>
            <div className="text-sm sm:text-base text-muted-foreground mb-4">
              {format(new Date(selectedEvent.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              {' • '}
              {selectedEvent.location}
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Checklist de Convidados</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Realize o check-in dos convidados no dia do evento
            </p>
          </div>
          
          {guests.length > 0 && (
            <ChecklistStats guests={guests} />
          )}
          
          <ChecklistFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <div className="rounded-lg border bg-card shadow-sm">
            {loading ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Carregando convidados...</p>
              </div>
            ) : guests.length === 0 ? (
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Nenhum convidado cadastrado</h3>
                <p className="text-muted-foreground mb-4">
                  Adicione convidados à lista do evento para realizar o check-in
                </p>
                <Button 
                  onClick={() => navigate('/guest-list')}
                  className="bg-leju-pink hover:bg-leju-pink/90"
                >
                  Gerenciar Convidados
                </Button>
              </div>
            ) : (
              <ChecklistTable 
                guests={filteredGuests}
                onCheckIn={handleCheckIn}
                isMobile={isMobile}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Checklist;
