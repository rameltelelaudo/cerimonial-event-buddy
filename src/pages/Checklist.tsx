import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Search, UserCheck, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useEventContext } from '@/contexts/EventContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GuestItemProps {
  id: string;
  name: string;
  companions: number;
  checkedIn: boolean;
  onCheckIn: (id: string) => void;
}

const GuestItem = ({ id, name, companions, checkedIn, onCheckIn }: GuestItemProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Card className={`mb-2 hover:shadow-md transition-shadow ${checkedIn ? 'bg-green-50 border-green-200' : ''}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className="text-sm text-muted-foreground">
                {companions > 0 ? `+${companions} acompanhantes` : 'Sem acompanhantes'}
              </p>
            </div>
            <Button 
              size="sm" 
              variant={checkedIn ? "outline" : "default"}
              className={checkedIn ? "bg-green-100 text-green-800 border-green-300" : "bg-leju-pink hover:bg-leju-pink/90"}
              onClick={() => onCheckIn(id)}
              disabled={checkedIn}
            >
              {checkedIn ? (
                <>
                  <Check className="mr-1 h-4 w-4" />
                  Confirmado
                </>
              ) : (
                <>
                  <UserCheck className="mr-1 h-4 w-4" />
                  Check-in
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TableRow className={checkedIn ? 'bg-green-50' : ''}>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>{companions}</TableCell>
      <TableCell>
        {checkedIn ? (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <Check className="mr-1 h-3 w-3" /> Confirmado
          </Badge>
        ) : (
          <Badge variant="outline">Pendente</Badge>
        )}
      </TableCell>
      <TableCell>
        <Button 
          size="sm" 
          variant={checkedIn ? "outline" : "default"}
          className={checkedIn ? "bg-green-100 text-green-800 border-green-300" : "bg-leju-pink hover:bg-leju-pink/90"}
          onClick={() => onCheckIn(id)}
          disabled={checkedIn}
        >
          {checkedIn ? (
            <>
              <Check className="mr-1 h-4 w-4" />
              Confirmado
            </>
          ) : (
            <>
              <UserCheck className="mr-1 h-4 w-4" />
              Check-in
            </>
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};

const Checklist = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { selectedEvent } = useEventContext();
  
  const [guests, setGuests] = useState(() => {
    if (!selectedEvent) return [];
    
    const savedGuests = localStorage.getItem(`guests_${selectedEvent.id}`);
    if (savedGuests) {
      try {
        return JSON.parse(savedGuests);
      } catch (error) {
        console.error('Erro ao carregar convidados:', error);
        return [];
      }
    }
    return [];
  });
  
  useEffect(() => {
    if (!selectedEvent) {
      toast.info("Selecione um evento primeiro");
      navigate('/events');
    }
  }, [selectedEvent, navigate]);
  
  const handleCheckIn = (id: string) => {
    if (!selectedEvent) return;
    
    setGuests(guests.map(guest => 
      guest.id === id 
        ? { ...guest, checkedIn: true, checkInTime: new Date() } 
        : guest
    ));
    
    toast.success("Check-in realizado com sucesso!");
  };
  
  useEffect(() => {
    if (selectedEvent && guests.length > 0) {
      localStorage.setItem(`guests_${selectedEvent.id}`, JSON.stringify(guests));
    }
  }, [guests, selectedEvent]);
  
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
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar convidado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="rounded-lg border bg-card shadow-sm">
            {guests.length === 0 ? (
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
            ) : isMobile ? (
              <div className="p-4">
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Convidados</h2>
                  <div className="text-sm text-muted-foreground">
                    {guests.filter(g => g.checkedIn).length}/{guests.length} confirmados
                  </div>
                </div>
                
                {filteredGuests.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">Nenhum convidado encontrado</p>
                ) : (
                  <div className="space-y-3">
                    {filteredGuests.map(guest => (
                      <GuestItem 
                        key={guest.id}
                        id={guest.id}
                        name={guest.name}
                        companions={guest.companions}
                        checkedIn={guest.checkedIn}
                        onCheckIn={handleCheckIn}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
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
                  {filteredGuests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Nenhum convidado encontrado</TableCell>
                    </TableRow>
                  ) : (
                    filteredGuests.map(guest => (
                      <GuestItem 
                        key={guest.id}
                        id={guest.id}
                        name={guest.name}
                        companions={guest.companions}
                        checkedIn={guest.checkedIn}
                        onCheckIn={handleCheckIn}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Checklist;
