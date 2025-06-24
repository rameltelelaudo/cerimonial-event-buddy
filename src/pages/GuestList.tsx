import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEventContext } from '@/contexts/EventContext';
import { Guest, GuestGroup } from '@/types/guest';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, UserPlus, Upload, Download } from 'lucide-react';
import { GuestTable } from '@/components/GuestList/GuestTable';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

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
  
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isEditGuestOpen, setIsEditGuestOpen] = useState(false);
  const [isDeleteGuestOpen, setIsDeleteGuestOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    group: 'Família' as GuestGroup,
    companions: 0,
    notes: ''
  });
  
  useEffect(() => {
    if (!selectedEvent) {
      console.log('No selected event, redirecting to events page');
      navigate('/events');
      return;
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
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
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
        }
      } catch (error: any) {
        console.error('Error fetching guests:', error);
        toast.error('Erro ao carregar convidados: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuests();
  }, [selectedEvent]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewGuest(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGuest(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent) {
      toast.error("Selecione um evento primeiro");
      return;
    }
    
    if (!newGuest.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('leju_guests')
        .insert({
          event_id: selectedEvent.id,
          name: newGuest.name.trim(),
          email: newGuest.email.trim() || null,
          group_type: newGuest.group,
          companions: newGuest.companions,
          notes: newGuest.notes.trim() || null,
          checked_in: false,
          user_id: selectedEvent.user_id
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      const guest: Guest = {
        id: data.id,
        name: data.name,
        email: data.email || undefined,
        group: data.group_type as GuestGroup,
        companions: data.companions,
        notes: data.notes || undefined,
        checkedIn: false
      };
      
      setGuests([guest, ...guests]);
      toast.success('Convidado adicionado com sucesso');
      
      setNewGuest({
        name: '',
        email: '',
        group: 'Família',
        companions: 0,
        notes: ''
      });
      
      setIsAddGuestOpen(false);
    } catch (error: any) {
      console.error('Error adding guest:', error);
      toast.error('Erro ao adicionar convidado: ' + error.message);
    }
  };
  
  const handleEditGuest = (guest: Guest) => {
    setSelectedGuestId(guest.id);
    setNewGuest({
      name: guest.name,
      email: guest.email || '',
      group: guest.group,
      companions: guest.companions,
      notes: guest.notes || ''
    });
    setIsEditGuestOpen(true);
  };
  
  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent || !selectedGuestId) {
      toast.error("Selecione um convidado para editar");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('leju_guests')
        .update({
          name: newGuest.name.trim(),
          email: newGuest.email.trim() || null,
          group_type: newGuest.group,
          companions: newGuest.companions,
          notes: newGuest.notes.trim() || null
        })
        .eq('id', selectedGuestId);
        
      if (error) {
        throw error;
      }
      
      setGuests(guests.map(guest => 
        guest.id === selectedGuestId 
          ? {
              ...guest,
              name: newGuest.name,
              email: newGuest.email || undefined,
              group: newGuest.group,
              companions: newGuest.companions,
              notes: newGuest.notes || undefined
            }
          : guest
      ));
      
      toast.success('Convidado atualizado com sucesso');
      setIsEditGuestOpen(false);
      
      setNewGuest({
        name: '',
        email: '',
        group: 'Família',
        companions: 0,
        notes: ''
      });
      setSelectedGuestId(null);
    } catch (error: any) {
      console.error('Error updating guest:', error);
      toast.error('Erro ao atualizar convidado: ' + error.message);
    }
  };
  
  const handleDeleteGuest = async () => {
    if (!selectedGuestId) return;
    
    try {
      const { error } = await supabase
        .from('leju_guests')
        .delete()
        .eq('id', selectedGuestId);
        
      if (error) {
        throw error;
      }
      
      setGuests(guests.filter(guest => guest.id !== selectedGuestId));
      setIsDeleteGuestOpen(false);
      setSelectedGuestId(null);
      toast.success('Convidado removido com sucesso');
    } catch (error: any) {
      console.error('Error deleting guest:', error);
      toast.error('Erro ao remover convidado: ' + error.message);
    }
  };
  
  const handleCheckIn = async (id: string) => {
    try {
      const checkInTime = new Date();
      
      const { error } = await supabase
        .from('leju_guests')
        .update({ 
          checked_in: true, 
          check_in_time: checkInTime.toISOString() 
        })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setGuests(guests.map(guest => 
        guest.id === id 
          ? { ...guest, checkedIn: true, checkInTime } 
          : guest
      ));
      
      toast.success('Check-in confirmado');
    } catch (error: any) {
      console.error('Error during check-in:', error);
      toast.error('Erro ao confirmar check-in: ' + error.message);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        Nome: 'João Silva',
        Email: 'joao@exemplo.com',
        Grupo: 'Família',
        Acompanhantes: 1,
        Observações: 'Mesa principal'
      },
      {
        Nome: 'Maria Santos',
        Email: 'maria@exemplo.com', 
        Grupo: 'Amigos',
        Acompanhantes: 0,
        Observações: ''
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Convidados');
    XLSX.writeFile(workbook, 'template_convidados.xlsx');
    toast.success('Template baixado com sucesso!');
  };

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedEvent) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const validGuests = jsonData
        .filter((row: any) => row.Nome && row.Nome.trim())
        .map((row: any) => ({
          event_id: selectedEvent.id,
          name: row.Nome.trim(),
          email: row.Email?.trim() || null,
          group_type: guestGroups.includes(row.Grupo) ? row.Grupo : 'Outros',
          companions: parseInt(row.Acompanhantes) || 0,
          notes: row.Observações?.trim() || null,
          checked_in: false,
          user_id: selectedEvent.user_id
        }));

      if (validGuests.length === 0) {
        toast.error('Nenhum convidado válido encontrado no arquivo');
        return;
      }

      const { data: insertedGuests, error } = await supabase
        .from('leju_guests')
        .insert(validGuests)
        .select();

      if (error) throw error;

      const newGuests: Guest[] = insertedGuests.map(g => ({
        id: g.id,
        name: g.name,
        email: g.email || undefined,
        group: g.group_type as GuestGroup,
        companions: g.companions,
        notes: g.notes || undefined,
        checkedIn: false
      }));

      setGuests([...newGuests, ...guests]);
      toast.success(`${validGuests.length} convidados importados com sucesso!`);
      setIsBulkUploadOpen(false);
    } catch (error: any) {
      console.error('Error uploading guests:', error);
      toast.error('Erro ao importar convidados: ' + error.message);
    }

    // Reset input
    event.target.value = '';
  };
  
  if (!selectedEvent) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col" 
         style={{ background: "linear-gradient(to right, #e6b980 0%, #eacda3 100%)" }}>
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6 backdrop-blur-sm bg-white/70">
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
              
              <div className="flex gap-2">
                <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Importar Excel
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Importar Convidados em Massa</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Button onClick={downloadTemplate} variant="outline" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Baixar Template Excel
                        </Button>
                        <p className="text-sm text-gray-600 mt-2">
                          Baixe o template, preencha com os dados dos convidados e faça upload do arquivo.
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="bulk-upload">Selecionar Arquivo Excel</Label>
                        <Input
                          id="bulk-upload"
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleBulkUpload}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

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
          </div>
          
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <Card className="bg-white/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Convidados</CardTitle>
                <div className="text-2xl font-bold">
                  {guests.length}
                </div>
              </CardHeader>
            </Card>
            <Card className="bg-white/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Confirmados</CardTitle>
                <div className="text-2xl font-bold">
                  {guests.filter(guest => guest.checkedIn).length}
                </div>
              </CardHeader>
            </Card>
            <Card className="bg-white/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Acompanhantes</CardTitle>
                <div className="text-2xl font-bold">
                  {guests.reduce((acc, guest) => acc + guest.companions, 0)}
                </div>
              </CardHeader>
            </Card>
          </div>
          
          <GuestTable 
            guests={guests} 
            onCheckIn={handleCheckIn}
            onEdit={handleEditGuest}
            onDelete={(id) => {
              setSelectedGuestId(id);
              setIsDeleteGuestOpen(true);
            }}
          />
          
          <Dialog open={isEditGuestOpen} onOpenChange={setIsEditGuestOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Convidado</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateGuest} className="space-y-4 pt-4">
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
                    onClick={() => setIsEditGuestOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-leju-pink hover:bg-leju-pink/90"
                  >
                    Atualizar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDeleteGuestOpen} onOpenChange={setIsDeleteGuestOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Excluir Convidado</DialogTitle>
              </DialogHeader>
              <p>
                Tem certeza que deseja excluir este convidado? Esta ação não pode ser desfeita.
              </p>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteGuestOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteGuest}
                >
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default GuestList;
