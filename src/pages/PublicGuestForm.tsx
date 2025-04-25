import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GuestGroup } from '@/types/guest';
import { supabase } from '@/integrations/supabase/client';
import { GuestFormFields } from '@/components/PublicGuest/GuestFormFields';
import { PublicGuestHeader } from '@/components/PublicGuest/PublicGuestHeader';
import { LoadingState } from '@/components/PublicGuest/LoadingState';
import { SuccessMessage } from '@/components/PublicGuest/SuccessMessage';
import { GuestListView } from '@/components/PublicGuest/GuestListView';
import { GuestModals } from '@/components/PublicGuest/GuestModals';

const guestGroups: GuestGroup[] = [
  "Família",
  "Padrinhos",
  "Amigos",
  "Colegas de Trabalho",
  "Fornecedores",
  "Outros"
];

const PublicGuestForm = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'list'>('form');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [guests, setGuests] = useState<any[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [isEditGuestOpen, setIsEditGuestOpen] = useState(false);
  const [isDeleteGuestOpen, setIsDeleteGuestOpen] = useState(false);
  
  const [guest, setGuest] = useState({
    name: '',
    email: '',
    group: 'Família' as GuestGroup,
    companions: 0,
    notes: ''
  });
  
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('leju_events')
          .select('*')
          .eq('id', eventId)
          .single();
          
        if (error) {
          console.error('Error fetching event:', error);
          throw error;
        }
        
        if (data) {
          console.log('Event data found:', data);
          setEvent({
            ...data,
            date: new Date(data.date)
          });
          
          fetchGuests(data.id);
        } else {
          console.log('No event data found for ID:', eventId);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId]);
  
  const fetchGuests = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('leju_guests')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching guests:', error);
        throw error;
      }
      
      if (data) {
        setGuests(data);
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast.error('Erro ao carregar lista de convidados');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGuest(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuest(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) {
      toast.error("Evento não encontrado");
      return;
    }
    
    if (!guest.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('leju_guests')
        .insert({
          event_id: eventId,
          name: guest.name.trim(),
          email: guest.email.trim() || null,
          group_type: guest.group,
          companions: guest.companions,
          notes: guest.notes.trim() || null,
          checked_in: false,
          user_id: event.user_id
        })
        .select();
        
      if (error) {
        console.error('Error inserting guest:', error);
        throw error;
      }
      
      setGuest({
        name: '',
        email: '',
        group: 'Família',
        companions: 0,
        notes: ''
      });
      
      setSuccess(true);
      toast.success("Confirmação recebida com sucesso!");
      
      if (eventId) {
        fetchGuests(eventId);
      }
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error('Error adding guest:', error);
      toast.error("Erro ao confirmar presença: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEditGuest = (guestData: any) => {
    setSelectedGuestId(guestData.id);
    setGuest({
      name: guestData.name,
      email: guestData.email || '',
      group: guestData.group_type as GuestGroup,
      companions: guestData.companions,
      notes: guestData.notes || ''
    });
    setIsEditGuestOpen(true);
  };
  
  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event || !selectedGuestId) {
      toast.error("Erro ao atualizar convidado");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('leju_guests')
        .update({
          name: guest.name.trim(),
          email: guest.email.trim() || null,
          group_type: guest.group,
          companions: guest.companions,
          notes: guest.notes.trim() || null
        })
        .eq('id', selectedGuestId);
        
      if (error) {
        throw error;
      }
      
      toast.success('Convidado atualizado com sucesso');
      
      if (eventId) {
        fetchGuests(eventId);
      }
      
      setIsEditGuestOpen(false);
      setGuest({
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
    } finally {
      setSubmitting(false);
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
      
      setIsDeleteGuestOpen(false);
      toast.success('Convidado removido com sucesso');
      
      if (eventId) {
        fetchGuests(eventId);
      }
      
      setSelectedGuestId(null);
    } catch (error: any) {
      console.error('Error deleting guest:', error);
      toast.error('Erro ao remover convidado: ' + error.message);
    }
  };
  
  const filteredGuests = searchQuery 
    ? guests.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : guests;
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Evento não encontrado</CardTitle>
            <CardDescription className="text-center">
              O link para este evento não é válido ou expirou.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12 px-4" 
      style={{ 
        background: "linear-gradient(to right, #e6b980 0%, #eacda3 100%)",
        backgroundSize: "cover", 
        backgroundPosition: "center" 
      }}>
      <div className="max-w-4xl mx-auto">
        <Card className="backdrop-blur-sm bg-white/90 shadow-lg">
          <CardHeader>
            <PublicGuestHeader event={event} />
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-center space-x-2 mb-6">
                <Button 
                  variant={viewMode === 'form' ? 'default' : 'outline'}
                  onClick={() => setViewMode('form')}
                  className={viewMode === 'form' ? 'bg-leju-pink hover:bg-leju-pink/90' : ''}
                >
                  Confirmar Presença
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-leju-pink hover:bg-leju-pink/90' : ''}
                >
                  Lista de Convidados
                </Button>
              </div>
            </div>
            
            {viewMode === 'form' ? (
              success ? (
                <SuccessMessage onAddAnother={() => setSuccess(false)} />
              ) : (
                <form onSubmit={handleSubmit}>
                  <GuestFormFields 
                    guest={guest}
                    guestGroups={guestGroups}
                    handleInputChange={handleInputChange}
                    handleNumberInput={handleNumberInput}
                    setGuest={setGuest}
                    submitting={submitting}
                  />
                </form>
              )
            ) : (
              <GuestListView 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredGuests={filteredGuests}
                handleEditGuest={handleEditGuest}
                setSelectedGuestId={setSelectedGuestId}
                setIsDeleteGuestOpen={setIsDeleteGuestOpen}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs text-muted-foreground">
              Gerenciado por <a href="/" className="text-leju-pink hover:underline">Leju App</a>
            </p>
          </CardFooter>
        </Card>

        <GuestModals 
          isEditGuestOpen={isEditGuestOpen}
          setIsEditGuestOpen={setIsEditGuestOpen}
          isDeleteGuestOpen={isDeleteGuestOpen}
          setIsDeleteGuestOpen={setIsDeleteGuestOpen}
          guest={guest}
          guestGroups={guestGroups}
          handleInputChange={handleInputChange}
          handleNumberInput={handleNumberInput}
          setGuest={setGuest}
          submitting={submitting}
          handleUpdateGuest={handleUpdateGuest}
          handleDeleteGuest={handleDeleteGuest}
        />
      </div>
    </div>
  );
};

export default PublicGuestForm;
