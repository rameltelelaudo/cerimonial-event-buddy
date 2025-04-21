
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Guest, GuestFilters } from '@/types/guest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { guestGroups } from '@/data/guestsData';
import { CheckCircle, Download, Filter, Search } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface GuestTableProps {
  guests: Guest[];
  onCheckIn: (id: string) => void;
}

export const GuestTable = ({ guests, onCheckIn }: GuestTableProps) => {
  const [filters, setFilters] = useState<GuestFilters>({
    search: '',
    group: 'Todos',
    status: 'Todos'
  });

  const filteredGuests = guests.filter(guest => {
    // Filter by search term
    if (filters.search && !guest.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Filter by group
    if (filters.group !== 'Todos' && guest.group !== filters.group) {
      return false;
    }
    
    // Filter by status
    if (filters.status === 'Confirmados' && !guest.checkedIn) {
      return false;
    }
    if (filters.status === 'Não Confirmados' && guest.checkedIn) {
      return false;
    }
    
    return true;
  });

  const handleCheckIn = (id: string) => {
    onCheckIn(id);
    toast.success('Check-in confirmado');
  };

  const exportToCSV = () => {
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
        guest.checkInTime ? format(guest.checkInTime, 'dd/MM/yyyy HH:mm') : ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lista-convidados-${format(new Date(), 'dd-MM-yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Lista exportada com sucesso');
  };

  return (
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
          
          <Button variant="outline" size="sm" className="h-9" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      
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
                  className={guest.checkedIn ? 'checked-in' : ''}
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
                          {guest.checkInTime && format(guest.checkInTime, 'HH:mm', { locale: ptBR })}
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
    </div>
  );
};
