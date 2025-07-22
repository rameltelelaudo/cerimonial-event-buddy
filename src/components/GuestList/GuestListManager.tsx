
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Search, Upload, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEventContext } from '@/contexts/EventContext';
import { toast } from 'sonner';
import { GuestTable } from './GuestTable';
import { AddGuestForm } from './AddGuestForm';
import { GuestStats } from './GuestStats';
import { EditGuestModal } from './EditGuestModal';

export const GuestListManager: React.FC = () => {
  const { user } = useAuth();
  const { selectedEvent } = useEventContext();
  const [guests, setGuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [editingGuest, setEditingGuest] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (selectedEvent && user) {
      loadGuests();
    }
  }, [selectedEvent, user]);

  const loadGuests = async () => {
    if (!selectedEvent || !user) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('leju_guests')
        .select('*')
        .eq('event_id', selectedEvent.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapear os dados do banco para o formato esperado pelos componentes
      const mappedGuests = (data || []).map(guest => ({
        id: guest.id,
        name: guest.name,
        email: guest.email,
        group: guest.group_type,
        companions: guest.companions,
        notes: guest.notes,
        checkedIn: guest.checked_in,
        checkInTime: guest.check_in_time ? new Date(guest.check_in_time) : undefined
      }));

      setGuests(mappedGuests);
    } catch (error: any) {
      console.error('Erro ao carregar convidados:', error);
      toast.error('Erro ao carregar lista de convidados');
    } finally {
      setIsLoading(false);
    }
  };

  const shareGuestForm = () => {
    if (!selectedEvent) return;
    
    const baseUrl = 'https://leju-assessment-app.lovable.app';
    const url = `${baseUrl}/public-guest-form/${selectedEvent.id}`;
    
    navigator.clipboard.writeText(url);
    toast.success('Link do formulário copiado para a área de transferência!');
  };

  const handleImportContacts = () => {
    // Funcionalidade de importar contatos (a ser implementada)
    toast.info('Funcionalidade de importar contatos em desenvolvimento');
  };

  const handleCheckIn = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leju_guests')
        .update({ 
          checked_in: true, 
          check_in_time: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      await loadGuests();
      toast.success('Check-in realizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao fazer check-in:', error);
      toast.error('Erro ao fazer check-in');
    }
  };

  const handleEditGuest = (guest: any) => {
    setEditingGuest(guest);
    setIsEditModalOpen(true);
  };

  const handleDeleteGuest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leju_guests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadGuests();
      toast.success('Convidado removido com sucesso!');
    } catch (error: any) {
      console.error('Erro ao remover convidado:', error);
      toast.error('Erro ao remover convidado');
    }
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (guest.email && guest.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGroup = selectedGroup === 'all' || guest.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-48">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lista de Convidados</h2>
          <p className="text-gray-600">Gerencie os convidados do seu evento</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleImportContacts}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar Contatos
          </Button>
          <Button
            variant="outline"
            onClick={shareGuestForm}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar Formulário
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <GuestStats guests={guests} />

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Convidados ({filteredGuests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">Todos os grupos</option>
              <option value="Família">Família</option>
              <option value="Padrinhos">Padrinhos</option>
              <option value="Amigos">Amigos</option>
              <option value="Colegas de Trabalho">Colegas de Trabalho</option>
              <option value="Fornecedores">Fornecedores</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          {filteredGuests.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">
                {searchQuery || selectedGroup !== 'all' 
                  ? 'Nenhum convidado encontrado com os filtros aplicados'
                  : 'Nenhum convidado adicionado ainda'
                }
              </p>
            </div>
          ) : (
            <GuestTable 
              guests={filteredGuests} 
              onCheckIn={handleCheckIn}
              onEdit={handleEditGuest}
              onDelete={handleDeleteGuest}
            />
          )}
        </CardContent>
      </Card>

      {/* Formulário para adicionar convidado */}
      <AddGuestForm onGuestAdded={loadGuests} />

      {/* Modal de edição */}
      <EditGuestModal
        guest={editingGuest}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingGuest(null);
        }}
        onGuestUpdated={loadGuests}
      />
    </div>
  );
};
