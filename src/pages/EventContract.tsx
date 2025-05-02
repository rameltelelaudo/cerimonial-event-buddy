
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import { EventContract as EventContractComponent } from '@/components/Events/EventContract';
import { ArrowLeft, Loader2, Edit } from 'lucide-react';

const EventContract = () => {
  const isMobile = useIsMobile();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, loading } = useEventContext();
  const event = events.find(e => e.id === eventId);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          {!isMobile && <Sidebar />}
          <main className="flex-1 p-6">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-leju-pink" />
              <span className="ml-2">Carregando...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          {!isMobile && <Sidebar />}
          <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Evento não encontrado</h2>
              <p className="text-muted-foreground mb-4">
                O evento que você está procurando não existe ou foi removido.
              </p>
              <Button onClick={() => navigate('/events')}>
                Voltar para Eventos
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/events')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para Eventos
            </Button>
            <h1 className="text-2xl font-bold">Contrato do Evento: {event.title}</h1>
            <p className="text-muted-foreground">
              Visualize e imprima o contrato para este evento
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <EventContractComponent event={event} />

            {(!event.contractorName || !event.contractorCPF) && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-amber-800">
                  <strong>Atenção:</strong> O contrato está incompleto. Adicione o nome e CPF do contratante 
                  para um contrato completo.
                </p>
                <Button 
                  onClick={() => navigate(`/events`)} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  <Edit className="h-4 w-4 mr-1" /> Editar Evento
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventContract;
