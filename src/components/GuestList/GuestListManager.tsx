import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Users, Check, X, Upload, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEventContext } from '@/contexts/EventContext';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface Guest {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  email?: string;
  groupType: string;
  companions: number;
  checkedIn: boolean;
  checkInTime?: Date;
  notes?: string;
  createdAt: Date;
}

const guestGroups = [
  'Família',
  'Padrinhos', 
  'Amigos',
  'Colegas de Trabalho',
  'Fornecedores',
  'Outros'
];

export const GuestListManager: React.FC = () => {
  const { user } = useAuth();
  const { selectedEvent } = useEventContext();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isBulkUploading, setBulkUploading] = useState(false);

  const [guestForm, setGuestForm] = useState({
    name: '',
    email: '',
    groupType: 'Família',
    companions: 0,
    notes: ''
  });

  useEffect(() => {
    if (selectedEvent && user) {
      loadGuests();
    }
  }, [selectedEvent, user]);

  const loadGuests = async () => {
    if (!selectedEvent || !user) return;

    try {
      setIsLoading(true);

      const { data: guestsData, error } = await supabase
        .from('leju_guests')
        .select('*')
        .eq('event_id', selectedEvent.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const mappedGuests = guestsData?.map(guest => ({
        id: guest.id,
        eventId: guest.event_id,
        userId: guest.user_id,
        name: guest.name,
        email: guest.email,
        groupType: guest.group_type,
        companions: guest.companions,
        checkedIn: guest.checked_in,
        checkInTime: guest.check_in_time ? new Date(guest.check_in_time) : undefined,
        notes: guest.notes,
        createdAt: new Date(guest.created_at)
      })) || [];

      setGuests(mappedGuests);
    } catch (error: any) {
      console.error('Erro ao carregar convidados:', error);
      toast.error('Erro ao carregar convidados');
    } finally {
      setIsLoading(false);
    }
  };

  const addGuest = async () => {
    if (!selectedEvent || !user) return;

    try {
      const { error } = await supabase
        .from('leju_guests')
        .insert({
          event_id: selectedEvent.id,
          user_id: user.id,
          name: guestForm.name,
          email: guestForm.email || null,
          group_type: guestForm.groupType,
          companions: guestForm.companions,
          notes: guestForm.notes || null
        });

      if (error) throw error;

      toast.success('Convidado adicionado com sucesso!');
      setIsDialogOpen(false);
      setGuestForm({ name: '', email: '', groupType: 'Família', companions: 0, notes: '' });
      loadGuests();
    } catch (error: any) {
      console.error('Erro ao adicionar convidado:', error);
      toast.error('Erro ao adicionar convidado');
    }
  };

  // Download template Excel
  const downloadTemplate = () => {
    const template = [
      {
        'Nome': 'João Silva',
        'Email': 'joao@email.com',
        'Grupo': 'Família',
        'Acompanhantes': 1,
        'Observações': 'Vegetariano'
      },
      {
        'Nome': 'Maria Santos',
        'Email': 'maria@email.com',
        'Grupo': 'Amigos',
        'Acompanhantes': 0,
        'Observações': ''
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Convidados');
    
    // Ajustar largura das colunas
    const colWidths = [
      { wch: 20 }, // Nome
      { wch: 25 }, // Email
      { wch: 18 }, // Grupo
      { wch: 15 }, // Acompanhantes
      { wch: 30 }  // Observações
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, 'template_convidados.xlsx');
    toast.success('Template baixado com sucesso!');
  };

  // Upload em massa
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !selectedEvent) return;

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast.error('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
      return;
    }

    try {
      setBulkUploading(true);

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            toast.error('Arquivo vazio ou formato inválido');
            return;
          }

          const guests = jsonData.map((row: any) => {
            const name = row['Nome'] || row['nome'] || row['Name'] || '';
            const email = row['Email'] || row['email'] || row['E-mail'] || '';
            const group = row['Grupo'] || row['grupo'] || row['Group'] || 'Outros';
            const companions = parseInt(row['Acompanhantes'] || row['acompanhantes'] || row['Companions'] || '0') || 0;
            const notes = row['Observações'] || row['observacoes'] || row['Notes'] || '';

            // Validar grupo
            const validGroup = guestGroups.includes(group) ? group : 'Outros';

            return {
              name: name.toString().trim(),
              email: email.toString().trim() || null,
              group_type: validGroup,
              companions: Math.max(0, companions),
              notes: notes.toString().trim() || null,
              event_id: selectedEvent.id,
              user_id: user.id,
              checked_in: false
            };
          }).filter(guest => guest.name); // Filtrar apenas convidados com nome

          if (guests.length === 0) {
            toast.error('Nenhum convidado válido encontrado no arquivo');
            return;
          }

          // Inserir convidados em lote
          const { error } = await supabase
            .from('leju_guests')
            .insert(guests);

          if (error) throw error;

          toast.success(`${guests.length} convidados importados com sucesso!`);
          loadGuests();
          
        } catch (error: any) {
          console.error('Erro ao processar arquivo:', error);
          toast.error('Erro ao processar arquivo: ' + error.message);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setBulkUploading(false);
      // Limpar input
      e.target.value = '';
    }
  };

  const updateGuest = async () => {
    if (!editingGuest) return;

    try {
      const { error } = await supabase
        .from('leju_guests')
        .update({
          name: guestForm.name,
          email: guestForm.email || null,
          group_type: guestForm.groupType,
          companions: guestForm.companions,
          notes: guestForm.notes || null
        })
        .eq('id', editingGuest.id);

      if (error) throw error;

      toast.success('Convidado atualizado com sucesso!');
      setIsDialogOpen(false);
      setEditingGuest(null);
      setGuestForm({ name: '', email: '', groupType: 'Família', companions: 0, notes: '' });
      loadGuests();
    } catch (error: any) {
      console.error('Erro ao atualizar convidado:', error);
      toast.error('Erro ao atualizar convidado');
    }
  };

  const deleteGuest = async (guestId: string) => {
    if (!confirm('Tem certeza que deseja excluir este convidado?')) return;

    try {
      const { error } = await supabase
        .from('leju_guests')
        .delete()
        .eq('id', guestId);

      if (error) throw error;

      toast.success('Convidado excluído com sucesso!');
      loadGuests();
    } catch (error: any) {
      console.error('Erro ao excluir convidado:', error);
      toast.error('Erro ao excluir convidado');
    }
  };

  const toggleCheckIn = async (guest: Guest) => {
    try {
      const { error } = await supabase
        .from('leju_guests')
        .update({
          checked_in: !guest.checkedIn,
          check_in_time: !guest.checkedIn ? new Date().toISOString() : null
        })
        .eq('id', guest.id);

      if (error) throw error;

      toast.success(`Check-in ${!guest.checkedIn ? 'realizado' : 'cancelado'} com sucesso!`);
      loadGuests();
    } catch (error: any) {
      console.error('Erro ao alterar check-in:', error);
      toast.error('Erro ao alterar check-in');
    }
  };

  const openEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setGuestForm({
      name: guest.name,
      email: guest.email || '',
      groupType: guest.groupType,
      companions: guest.companions,
      notes: guest.notes || ''
    });
    setIsDialogOpen(true);
  };

  const totalGuests = guests.reduce((sum, guest) => sum + 1 + guest.companions, 0);
  const checkedInGuests = guests.filter(guest => guest.checkedIn).reduce((sum, guest) => sum + 1 + guest.companions, 0);

  if (isLoading) {
    return <div className="flex justify-center items-center h-48">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-leju-pink mr-3" />
              <div>
                <p className="text-2xl font-bold">{guests.length}</p>
                <p className="text-sm text-gray-600">Convidados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{totalGuests}</p>
                <p className="text-sm text-gray-600">Total de Pessoas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{checkedInGuests}</p>
                <p className="text-sm text-gray-600">Check-in Realizado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h3 className="text-lg font-semibold">
          Lista de Convidados ({guests.length})
        </h3>
        
        <div className="flex gap-2 flex-wrap">
          {/* Upload em massa */}
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Template Excel
          </Button>
          
          <div className="relative">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleBulkUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isBulkUploading}
            />
            <Button
              variant="outline"
              disabled={isBulkUploading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isBulkUploading ? 'Importando...' : 'Importar Excel'}
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-leju-pink hover:bg-leju-pink/90">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Convidado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingGuest ? 'Editar Convidado' : 'Novo Convidado'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome do Convidado *</Label>
                  <Input
                    value={guestForm.name}
                    onChange={(e) => setGuestForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome completo"
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={guestForm.email}
                    onChange={(e) => setGuestForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Grupo</Label>
                    <select
                      value={guestForm.groupType}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, groupType: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      {guestGroups.map((group) => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Acompanhantes</Label>
                    <Input
                      type="number"
                      min="0"
                      value={guestForm.companions}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, companions: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Observações</Label>
                  <Textarea
                    value={guestForm.notes}
                    onChange={(e) => setGuestForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Observações sobre o convidado..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingGuest(null);
                      setGuestForm({ name: '', email: '', groupType: 'Família', companions: 0, notes: '' });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={editingGuest ? updateGuest : addGuest}
                    className="bg-leju-pink hover:bg-leju-pink/90"
                    disabled={!guestForm.name.trim()}
                  >
                    {editingGuest ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabela de Convidados */}
      {guests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Nenhum convidado adicionado ainda</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Acompanhantes</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell>{guest.email || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{guest.groupType}</Badge>
                    </TableCell>
                    <TableCell>{guest.companions}</TableCell>
                    <TableCell>
                      <Button
                        variant={guest.checkedIn ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCheckIn(guest)}
                      >
                        {guest.checkedIn ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditGuest(guest)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteGuest(guest.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
