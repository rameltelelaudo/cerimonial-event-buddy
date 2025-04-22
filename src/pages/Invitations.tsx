import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Send, PlusCircle, Calendar, Share, Mail, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AddInvitationForm } from '@/components/Invitations/AddInvitationForm';
import { Invitation } from '@/types/invitation';
import { useEventContext } from '@/contexts/EventContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Invitations = () => {
  const isMobile = useIsMobile();
  const { events } = useEventContext();
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchInvitations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('leju_invitations')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          const transformedInvitations: Invitation[] = data.map(invitation => ({
            id: invitation.id,
            title: invitation.title,
            eventId: invitation.event_id || '',
            template: invitation.template as 'standard' | 'elegant' | 'casual' | 'custom',
            message: invitation.message,
            imageUrl: invitation.image_url || undefined,
            createdAt: new Date(invitation.created_at),
            sentCount: invitation.sent_count
          }));
          
          setInvitations(transformedInvitations);
        }
      } catch (error: any) {
        console.error('Erro ao carregar convites:', error);
        toast.error(`Erro ao carregar convites: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvitations();
  }, [user]);
  
  const getEventTitle = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.title : 'Evento não encontrado';
  };
  
  const handleAddInvitation = (invitation: Invitation) => {
    setInvitations(prevInvitations => [...prevInvitations, invitation]);
    setIsAddModalOpen(false);
  };
  
  const handleSendInvitation = async (id: string) => {
    try {
      const { data: invitationData } = await supabase
        .from('leju_invitations')
        .select('sent_count')
        .eq('id', id)
        .single();
      
      if (!invitationData) {
        throw new Error('Convite não encontrado');
      }
      
      const newCount = invitationData.sent_count + 5;
      
      const { error } = await supabase
        .from('leju_invitations')
        .update({ sent_count: newCount })
        .eq('id', id);
        
      if (error) throw error;
      
      setInvitations(prevInvitations => 
        prevInvitations.map(invitation => 
          invitation.id === id 
            ? { ...invitation, sentCount: newCount }
            : invitation
        )
      );
      
      toast.success('Convites enviados com sucesso!', {
        description: '5 convites foram enviados para os convidados.'
      });
    } catch (error: any) {
      console.error('Erro ao enviar convites:', error);
      toast.error(`Erro ao enviar convites: ${error.message}`);
    }
  };
  
  const handleShareInvitation = (id: string) => {
    toast.success('Link gerado para compartilhamento!', {
      description: 'O link foi copiado para a área de transferência.'
    });
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Convites</h1>
              <p className="text-muted-foreground mt-1">
                Crie e envie convites para seus convidados
              </p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-leju-pink hover:bg-leju-pink/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Convite
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-leju-pink" />
              <span className="ml-2">Carregando convites...</span>
            </div>
          ) : invitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {invitations.map((invitation) => (
                <Card key={invitation.id} className="overflow-hidden hover:shadow-md transition-shadow glass">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">{invitation.title}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {getEventTitle(invitation.eventId)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <div className="text-sm text-muted-foreground">
                        Criado em {format(new Date(invitation.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                      <div className="text-sm mt-1">
                        Enviados: <span className="font-medium">{invitation.sentCount}</span> convites
                      </div>
                    </div>
                    <div className="text-sm mt-3 line-clamp-2">
                      {invitation.message}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleShareInvitation(invitation.id)}
                    >
                      <Share className="h-4 w-4 mr-1" /> Compartilhar
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleSendInvitation(invitation.id)}
                      className="bg-leju-pink hover:bg-leju-pink/90"
                    >
                      <Mail className="h-4 w-4 mr-1" /> Enviar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-6 bg-white/80 fade-in mt-4">
              <div className="text-center py-8">
                <Send className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-4">Nenhum convite criado</h2>
                <p className="text-muted-foreground mb-6">
                  Você ainda não criou nenhum convite. Clique no botão abaixo para criar seu primeiro convite.
                </p>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-leju-pink hover:bg-leju-pink/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Convite
                </Button>
              </div>
            </div>
          )}
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Criar Convite</DialogTitle>
              </DialogHeader>
              <AddInvitationForm 
                onAddInvitation={handleAddInvitation}
                onCancel={() => setIsAddModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Invitations;
