
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';
import { toast } from 'sonner';

const Events = () => {
  const isMobile = useIsMobile();
  
  const handleAddEvent = () => {
    toast.info("Funcionalidade em desenvolvimento");
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
            <Button onClick={handleAddEvent} className="bg-leju-pink hover:bg-leju-pink/90">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Adicionar Evento
            </Button>
          </div>
          
          <div className="border rounded-lg p-6 bg-white fade-in mt-4">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Nenhum evento cadastrado</h2>
              <p className="text-muted-foreground mb-6">
                Você ainda não possui eventos cadastrados. Clique no botão abaixo para adicionar seu primeiro evento.
              </p>
              <Button onClick={handleAddEvent} className="bg-leju-pink hover:bg-leju-pink/90">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Adicionar Evento
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Events;
