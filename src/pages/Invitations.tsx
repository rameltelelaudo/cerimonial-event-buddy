
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Send, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const Invitations = () => {
  const isMobile = useIsMobile();
  
  const handleCreateInvitation = () => {
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
              <h1 className="text-3xl font-bold">Convites</h1>
              <p className="text-muted-foreground mt-1">
                Crie e envie convites para seus convidados
              </p>
            </div>
            <Button onClick={handleCreateInvitation} className="bg-leju-pink hover:bg-leju-pink/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Convite
            </Button>
          </div>
          
          <div className="border rounded-lg p-6 bg-white fade-in mt-4">
            <div className="text-center py-8">
              <Send className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-4">Nenhum convite criado</h2>
              <p className="text-muted-foreground mb-6">
                Você ainda não criou nenhum convite. Clique no botão abaixo para criar seu primeiro convite.
              </p>
              <Button onClick={handleCreateInvitation} className="bg-leju-pink hover:bg-leju-pink/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Convite
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Invitations;
