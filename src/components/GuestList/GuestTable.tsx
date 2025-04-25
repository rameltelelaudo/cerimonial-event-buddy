
import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Guest, GuestFilters } from '@/types/guest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { guestGroups } from '@/data/guestsData';
import { CheckCircle, Download, Filter, Search, Edit, Trash2, FileText, Printer, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface GuestTableProps {
  guests: Guest[];
  onCheckIn: (id: string) => void;
  onEdit: (guest: Guest) => void;
  onDelete: (id: string) => void;
}

export const GuestTable = ({ guests, onCheckIn, onEdit, onDelete }: GuestTableProps) => {
  const [filters, setFilters] = useState<GuestFilters>({
    search: '',
    group: 'Todos',
    status: 'Todos'
  });
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const filteredGuests = guests.filter(guest => {
    if (filters.search && !guest.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    if (filters.group !== 'Todos' && guest.group !== filters.group) {
      return false;
    }
    
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
    const headers = ['Nº', 'Nome', 'Email', 'Grupo', 'Acompanhantes', 'Observações', 'Check-in', 'Horário do Check-in'];
    
    const csvContent = [
      headers.join(','),
      ...filteredGuests.map((guest, index) => [
        index + 1,
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

  const printToPDF = () => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error('Por favor, permita popups para esta página');
      return;
    }
    
    // Build the HTML content for printing
    const guestListHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Lista de Convidados</title>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th { background-color: #f2f2f2; text-align: left; padding: 8px; border: 1px solid #ddd; }
          td { padding: 8px; border: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .print-info { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
          .check-icon { color: green; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Lista de Convidados</h1>
        <p>Data de impressão: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
        
        <table>
          <thead>
            <tr>
              <th>Nº</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Grupo</th>
              <th>Acompanhantes</th>
              <th>Observações</th>
              <th>Check-in</th>
            </tr>
          </thead>
          <tbody>
            ${filteredGuests.map((guest, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${guest.name}</td>
                <td>${guest.email || '-'}</td>
                <td>${guest.group}</td>
                <td>${guest.companions}</td>
                <td>${guest.notes || '-'}</td>
                <td>${guest.checkedIn ? `<span class="check-icon">✓</span> ${guest.checkInTime ? format(guest.checkInTime, 'dd/MM/yyyy HH:mm', { locale: ptBR }) : ''}` : '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="print-info">
          <p>Total de convidados: ${filteredGuests.length}</p>
          <p>Total de confirmados: ${filteredGuests.filter(g => g.checkedIn).length}</p>
          <p>Total de acompanhantes: ${filteredGuests.reduce((acc, g) => acc + g.companions, 0)}</p>
        </div>
        
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(guestListHTML);
    printWindow.document.close();
  };

  const handleDeleteConfirm = () => {
    if (guestToDelete) {
      onDelete(guestToDelete.id);
      setGuestToDelete(null);
      toast.success('Convidado removido com sucesso');
    }
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <FileText className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Exportar CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={printToPDF}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir / PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead className="text-center">Acompanhantes</TableHead>
              <TableHead className="hidden md:table-cell">Observações</TableHead>
              <TableHead className="text-center">Check-in</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest, index) => (
                <TableRow 
                  key={guest.id} 
                  className={guest.checkedIn ? 'checked-in' : ''}
                >
                  <TableCell>{index + 1}</TableCell>
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
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(guest)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setGuestToDelete(guest)}
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
                <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                  Nenhum convidado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div ref={printRef} className="hidden">
        {/* This div will be used for printing */}
      </div>

      <Dialog open={!!guestToDelete} onOpenChange={() => setGuestToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir o convidado {guestToDelete?.name}?
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGuestToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
