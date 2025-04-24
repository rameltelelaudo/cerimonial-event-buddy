
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEventContext } from '@/contexts/EventContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CalendarPlus, Loader2 } from 'lucide-react';
import { EventList } from '@/components/Events/EventList';
import { AddEventForm } from '@/components/Events/AddEventForm';
import { Event } from '@/types/event';
import { toast } from 'sonner';

const Events = () => {
  const isMobile = useIsMobile();
  const { events, addEvent, updateEvent, deleteEvent, setSelectedEvent, loading } = useEventContext();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEventForAction, setSelectedEventForAction] = useState<Event | null>(null);
  
  const handleAddEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      setIsSubmitting(true);
      const result = await addEvent(eventData);
      
      if (result) {
        toast.success("Evento adicionado com sucesso");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error("Erro ao adicionar evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEvent = async (eventData: Omit<Event, 'id'>) => {
    if (!selectedEventForAction) return;
    
    try {
      setIsSubmitting(true);
      const success = await updateEvent(selectedEventForAction.id, eventData);
      
      if (success) {
        toast.success("Evento atualizado com sucesso");
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error("Erro ao atualizar evento");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteEvent = async () => {
    if (!selectedEventForAction) return;
    
    try {
      const success = await deleteEvent(selectedEventForAction.id);
      if (success) {
        toast.success("Evento excluído com sucesso");
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error("Erro ao excluir evento");
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Eventos</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie seus eventos e cerimônias
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-leju-pink hover:bg-leju-pink/90">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Adicionar Evento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Evento</DialogTitle>
                </DialogHeader>
                <AddEventForm
                  onSubmit={handleAddEvent}
                  onCancel={() => setIsDialogOpen(false)}
                  isSubmitting={isSubmitting}
                  mode="add"
                />
              </DialogContent>
            </Dialog>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-leju-pink" />
              <span className="ml-2">Carregando eventos...</span>
            </div>
          ) : events.length > 0 ? (
            <EventList
              events={events}
              onEditEvent={(event) => {
                setSelectedEventForAction(event);
                setIsEditDialogOpen(true);
              }}
              onDeleteEvent={(event) => {
                setSelectedEventForAction(event);
                setDeleteDialogOpen(true);
              }}
              onSelectEvent={setSelectedEvent}
            />
          ) : (
            <div className="border rounded-lg p-6 bg-white fade-in mt-4">
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-4">Nenhum evento cadastrado</h2>
                <p className="text-muted-foreground mb-6">
                  Você ainda não possui eventos cadastrados. Clique no botão abaixo para adicionar seu primeiro evento.
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)} 
                  className="bg-leju-pink hover:bg-leju-pink/90"
                >
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Adicionar Evento
                </Button>
              </div>
            </div>
          )}
          
          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Evento</DialogTitle>
              </DialogHeader>
              <AddEventForm
                onSubmit={handleEditEvent}
                onCancel={() => setIsEditDialogOpen(false)}
                isSubmitting={isSubmitting}
                initialData={selectedEventForAction || undefined}
                mode="edit"
              />
            </DialogContent>
          </Dialog>
          
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteEvent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  );
};

export default Events;
