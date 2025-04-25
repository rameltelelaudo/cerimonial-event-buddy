
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GuestGroup } from '@/types/guest';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, Edit, Trash2, Check, X, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  
  // Guest list state
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
          
          // Fetch guests after event is loaded
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
      
      // Refresh guest list
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
      
      // Refresh guest list
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
      
      // Refresh guest list
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-leju-pink" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
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
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <img 
                src="https://i.ibb.co/G40sCgqs/images.jpg" 
                alt="Leju App" 
                className="h-12 w-auto mx-auto"
              />
            </div>
            <CardTitle>{event?.title}</CardTitle>
            <CardDescription>
              {event && new Date(event.date).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
              {event && ' • '}
              {event?.location}
            </CardDescription>
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
                <div className="text-center py-6">
                  <h3 className="text-xl text-green-600 font-semibold mb-2">Presença confirmada!</h3>
                  <p className="mb-4">Obrigado por confirmar sua presença.</p>
                  <Button 
                    onClick={() => setSuccess(false)}
                    className="bg-leju-pink hover:bg-leju-pink/90"
                  >
                    Adicionar outro convidado
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={guest.name} 
                      onChange={handleInputChange} 
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      value={guest.email} 
                      onChange={handleInputChange} 
                      placeholder="seu.email@exemplo.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="group">Grupo</Label>
                    <Select
                      value={guest.group}
                      onValueChange={(value) => setGuest({...guest, group: value as GuestGroup})}
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
                      value={guest.companions} 
                      onChange={handleNumberInput} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea 
                      id="notes" 
                      name="notes"
                      value={guest.notes} 
                      onChange={handleInputChange} 
                      placeholder="Restrições alimentares, alergias, etc."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-leju-pink hover:bg-leju-pink/90"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Confirmar Presença"
                    )}
                  </Button>
                </form>
              )
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar convidados..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead className="hidden md:table-cell">Grupo</TableHead>
                        <TableHead className="text-center">Acompanhantes</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGuests.length > 0 ? (
                        filteredGuests.map((guestItem) => (
                          <TableRow 
                            key={guestItem.id} 
                            className={guestItem.checked_in ? 'bg-green-50' : ''}
                          >
                            <TableCell className="font-medium">{guestItem.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{guestItem.group_type}</TableCell>
                            <TableCell className="text-center">{guestItem.companions}</TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditGuest(guestItem)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedGuestId(guestItem.id);
                                    setIsDeleteGuestOpen(true);
                                  }}
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
                          <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                            Nenhum convidado encontrado.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs text-muted-foreground">
              Gerenciado por <a href="/" className="text-leju-pink hover:underline">Leju App</a>
            </p>
          </CardFooter>
        </Card>
        
        {/* Edit Guest Dialog */}
        <Dialog open={isEditGuestOpen} onOpenChange={setIsEditGuestOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Convidado</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateGuest} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome Completo *</Label>
                <Input 
                  id="edit-name" 
                  name="name"
                  value={guest.name} 
                  onChange={handleInputChange} 
                  placeholder="Nome do convidado"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">E-mail</Label>
                <Input 
                  id="edit-email" 
                  name="email"
                  type="email" 
                  value={guest.email} 
                  onChange={handleInputChange} 
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-group">Grupo</Label>
                <Select
                  value={guest.group}
                  onValueChange={(value) => setGuest({...guest, group: value as GuestGroup})}
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
                <Label htmlFor="edit-companions">Acompanhantes</Label>
                <Input 
                  id="edit-companions" 
                  name="companions"
                  type="number" 
                  min={0}
                  value={guest.companions} 
                  onChange={handleNumberInput} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Observações</Label>
                <Textarea 
                  id="edit-notes" 
                  name="notes"
                  value={guest.notes} 
                  onChange={handleInputChange} 
                  placeholder="Restrições alimentares, alergias, etc."
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
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Guest Dialog */}
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
      </div>
    </div>
  );
};

export default PublicGuestForm;
