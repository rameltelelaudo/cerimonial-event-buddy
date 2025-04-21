
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Download, Filter, Search, UserPlus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEventContext } from '@/contexts/EventContext';
import { Guest, GuestGroup } from '@/types/guest';

const guestGroups: GuestGroup[] = [
  "Família",
  "Padrinhos",
  "Amigos",
  "Colegas de Trabalho",
  "Fornecedores",
  "Outros"
];

const GuestList = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { selectedEvent } = useEventContext();
  const [filters, setFilters] = useState({
    search: '',
    group: 'Todos',
    status: 'Todos'
  });
  
  // Inicializar a lista de convidados do localStorage
  const [guests, setGuests] = useState<Guest[]>(() => {
    if (!selectedEvent) return [];
    
    const savedGuests = localStorage.getItem(`guests_${selectedEvent.id}`);
    if (savedGuests) {
      try {
        const parsedGuests = JSON.parse(savedGuests);
        // Converter strings de data para objetos Date se necessário
        return parsedGuests.map((guest: any) => ({
          ...guest,
          checkInTime: guest.checkInTime ? new Date(guest.checkInTime) : undefined
        }));
      } catch (error) {
        console.error('Erro ao carregar convidados:', error);
        return [];
      }
    }
    return [];
  });
  
  // Estado para dialog de adicionar convidado
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    group: 'Família' as GuestGroup,
    companions: 0,
    notes: ''
  });
  
  // Redirecionamento se não houver evento selecionado
  useEffect(() => {
    if (!selectedEvent) {
      toast.info("Selecione um evento primeiro");
      navigate('/events');
    }
  }, [selectedEvent, navigate]);
  
  // Salvar convidados no localStorage quando mudar
  useEffect(() => {
    if (selectedEvent && guests.length > 0) {
      localStorage.setItem(`guests_${selectedEvent.id}`, JSON.stringify(guests));
    }
  }, [guests, selectedEvent]);
  
  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent) {
      toast.error("Selecione um evento primeiro");
      return;
    }
    
    if (!newGuest.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    
    const guest: Guest = {
      id: uuidv4(),
      name: newGuest.name.trim(),
      email: newGuest.email.trim() || undefined,
      group: newGuest.group,
      companions: newGuest.companions,
      notes: newGuest.notes.trim() || undefined,
      checkedIn: false
    };
    
    setGuests([...guests, guest]);
    toast.success('Convidado adicionado com sucesso');
    
    // Resetar form
    setNewGuest({
      name: '',
      email: '',
      group: 'Família',
      companions: 0,
      notes: ''
    });
    
    setIsAddGuestOpen(false);
  };
  
  const handleCheckIn = (id: string) => {
    setGuests(guests.map(guest => 
      guest.id === id 
        ? { ...guest, checkedIn: true, checkInTime: new Date() } 
        : guest
    ));
    toast.success('Check-in confirmado');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewGuest(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGuest(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  const exportToCSV = () => {
    if (!selectedEvent || !filteredGuests.length) {
      toast.error('Não há convidados para exportar');
      return;
    }
    
    const headers = ['Nome', 'Email', 'Grupo', 'Acompanhantes', 'Observações', 'Check-in', 'Horário do Check-in'];
    
    const csvContent = [
      headers.join(','),
      ...filteredGuests.map(guest => [
        guest.name,
        guest.email || '',
        guest.group,
        guest.companions,
        guest.notes?.replace(/,/g, ';') || '',
        guest.checkedIn ? 'Sim' : 'Não',
        guest.checkInTime ? format(new Date(guest.checkInTime), 'dd/MM/yyyy HH:mm') : ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `convidados-${selectedEvent.title.replace(/\s+/g, '-')}-${format(new Date(), 'dd-MM-yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Lista exportada com sucesso');
  };
  
  // Filtrar convidados com base nos filtros
  const filteredGuests = guests.filter(guest => {
    // Filtrar por termo de busca
    if (filters.search && !guest.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Filtrar por grupo
    if (filters.group !== 'Todos' && guest.group !== filters.group) {
      return false;
    }
    
    // Filtrar por status
    if (filters.status === 'Confirmados' && !guest.checkedIn) {
      return false;
    }
    if (filters.status === 'Não Confirmados' && guest.checkedIn) {
      return false;
    }
    
    return true;
  });
  
  if (!selectedEvent) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6">
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
              <h1 className="text-2xl sm:text-3xl font-bold">{selectedEvent.title}</h1>
            </div>
            <div className="text-muted-foreground mb-4">
              {format(new Date(selectedEvent.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              {' • '}
              {selectedEvent.location}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold">Lista de Convidados</h2>
                <p className="text-muted-foreground">
                  Gerencie os convidados para este evento
                </p>
              </div>
              
              <Dialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-leju-pink hover:bg-leju-pink/90">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Convidado
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Convidado</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddGuest} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={newGuest.name} 
                        onChange={handleInputChange} 
                        placeholder="Nome do convidado"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        value={newGuest.email} 
                        onChange={handleInputChange} 
                        placeholder="email@exemplo.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="group">Grupo</Label>
                      <Select
                        value={newGuest.group}
                        onValueChange={(value) => setNewGuest({...newGuest, group: value as GuestGroup})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um grupo" />
                        </SelectTrigger>
                        <SelectContent>
                          {guestGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companions">Acompanhantes</Label>
                      <Input 
                        id="companions" 
                        name="companions"
                        type="number" 
                        min={0}
                        value={newGuest.companions} 
                        onChange={handleNumberInput} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea 
                        id="notes" 
                        name="notes"
                        value={newGuest.notes} 
                        onChange={handleInputChange} 
                        placeholder="Mesa, restrição alimentar, etc."
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={() => setIsAddGuestOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-leju-pink hover:bg-leju-pink/90"
                      >
                        Adicionar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Estatísticas de convidados */}
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Convidados</CardTitle>
                <div className="text-2xl font-bold">
                  {guests.length}
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Confirmados</CardTitle>
                <div className="text-2xl font-bold">
                  {guests.filter(guest => guest.checkedIn).length}
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Acompanhantes</CardTitle>
                <div className="text-2xl font-bold">
                  {guests.reduce((acc, guest) => acc + guest.companions, 0)}
                </div>
              </CardHeader>
            </Card>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar convidados..."
                  className="pl-8"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              
              <div className="flex gap-2 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Grupo</h4>
                        <Select
                          value={filters.group}
                          onValueChange={(value) => setFilters({ ...filters, group: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um grupo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            {guestGroups.map((group) => (
                              <SelectItem key={group} value={group}>
                                {group}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Status</h4>
                        <Select
                          value={filters.status}
                          onValueChange={(value) => setFilters({ ...filters, status: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            <SelectItem value="Confirmados">Confirmados</SelectItem>
                            <SelectItem value="Não Confirmados">Não Confirmados</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9" 
                  onClick={exportToCSV}
                  disabled={filteredGuests.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
            
            {guests.length === 0 ? (
              <div className="rounded-md border p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Nenhum convidado cadastrado</h3>
                <p className="text-muted-foreground mb-4">
                  Adicione convidados para este evento
                </p>
                <Button 
                  onClick={() => setIsAddGuestOpen(true)}
                  className="bg-leju-pink hover:bg-leju-pink/90"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Convidado
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead>Grupo</TableHead>
                      <TableHead className="text-center">Acompanhantes</TableHead>
                      <TableHead className="hidden md:table-cell">Observações</TableHead>
                      <TableHead className="text-center">Check-in</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuests.length > 0 ? (
                      filteredGuests.map((guest) => (
                        <TableRow 
                          key={guest.id} 
                          className={guest.checkedIn ? 'bg-green-50/60' : ''}
                        >
                          <TableCell className="font-medium">{guest.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{guest.email || '-'}</TableCell>
                          <TableCell>{guest.group}</TableCell>
                          <TableCell className="text-center">{guest.companions}</TableCell>
                          <TableCell className="hidden md:table-cell truncate max-w-[200px]">
                            {guest.notes || '-'}
                          </TableCell>
                          <TableCell>
                            {guest.checkedIn ? (
                              <div className="flex flex-col items-center text-center">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="text-xs mt-1">
                                  {guest.checkInTime && format(new Date(guest.checkInTime), 'HH:mm', { locale: ptBR })}
                                </span>
                              </div>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mx-auto block hover:text-green-600"
                                onClick={() => handleCheckIn(guest.id)}
                              >
                                Confirmar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                          Nenhum convidado encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GuestList;
