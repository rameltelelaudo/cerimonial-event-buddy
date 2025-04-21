
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Search, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

interface GuestItemProps {
  name: string;
  companions: number;
  checkedIn: boolean;
  onCheckIn: () => void;
}

const GuestItem = ({ name, companions, checkedIn, onCheckIn }: GuestItemProps) => {
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
              onClick={onCheckIn}
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
          onClick={onCheckIn}
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
  
  // Mock guest data for demonstration
  const [guests, setGuests] = useState([
    { id: '1', name: 'Ana Silva', companions: 2, checkedIn: false },
    { id: '2', name: 'Carlos Oliveira', companions: 1, checkedIn: true },
    { id: '3', name: 'Mariana Santos', companions: 0, checkedIn: false },
    { id: '4', name: 'Roberto Pereira', companions: 3, checkedIn: false },
    { id: '5', name: 'Juliana Costa', companions: 1, checkedIn: true },
  ]);
  
  const handleCheckIn = (id: string) => {
    setGuests(guests.map(guest => 
      guest.id === id 
        ? { ...guest, checkedIn: true } 
        : guest
    ));
    toast.success("Check-in realizado com sucesso!");
  };
  
  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Checklist de Convidados</h1>
            <p className="text-muted-foreground mt-1">
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
          
          <div className="rounded-lg border bg-card">
            {isMobile ? (
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
                  filteredGuests.map(guest => (
                    <GuestItem 
                      key={guest.id}
                      name={guest.name}
                      companions={guest.companions}
                      checkedIn={guest.checkedIn}
                      onCheckIn={() => handleCheckIn(guest.id)}
                    />
                  ))
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
                        name={guest.name}
                        companions={guest.companions}
                        checkedIn={guest.checkedIn}
                        onCheckIn={() => handleCheckIn(guest.id)}
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
