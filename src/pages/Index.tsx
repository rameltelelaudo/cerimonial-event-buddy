
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { DashboardCards } from '@/components/Dashboard/DashboardCards';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao EventBuddy, seu assistente de cerimonial.
            </p>
          </div>
          
          <div className="space-y-6">
            <DashboardCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6 bg-white fade-in">
                <h2 className="text-xl font-semibold mb-4">Próximos Eventos</h2>
                <p className="text-muted-foreground mb-4">
                  Você não possui eventos cadastrados. Comece adicionando seu primeiro evento.
                </p>
                <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center">
                  <p className="text-muted-foreground mb-2">Clique para adicionar um novo evento</p>
                  <button className="text-ceremonial-purple hover:underline">
                    + Adicionar Evento
                  </button>
                </div>
              </div>
              
              <div className="border rounded-lg p-6 bg-white fade-in">
                <h2 className="text-xl font-semibold mb-4">Tarefas Recentes</h2>
                <p className="text-muted-foreground mb-4">
                  Você não possui tarefas cadastradas. Comece adicionando sua primeira tarefa.
                </p>
                <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center">
                  <p className="text-muted-foreground mb-2">Clique para adicionar uma nova tarefa</p>
                  <button className="text-ceremonial-purple hover:underline">
                    + Adicionar Tarefa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
