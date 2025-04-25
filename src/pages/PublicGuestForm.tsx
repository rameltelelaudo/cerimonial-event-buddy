import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GuestGroup } from '@/types/guest';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

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
      <div className="max-w-md mx-auto">
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
            {success ? (
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
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs text-muted-foreground">
              Gerenciado por <a href="/" className="text-leju-pink hover:underline">Leju App</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PublicGuestForm;
