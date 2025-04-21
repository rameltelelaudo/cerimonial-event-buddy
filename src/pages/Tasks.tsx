
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const Tasks = () => {
  const isMobile = useIsMobile();
  
  const handleAddTask = () => {
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
              <h1 className="text-3xl font-bold">Tarefas</h1>
              <p className="text-muted-foreground mt-1">
                Organize suas tarefas e atividades
              </p>
            </div>
            <Button onClick={handleAddTask} className="bg-leju-pink hover:bg-leju-pink/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="text-muted-foreground text-sm font-medium">Pendentes</h3>
                  <p className="text-3xl font-bold mt-1">0</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="text-muted-foreground text-sm font-medium">Em Andamento</h3>
                  <p className="text-3xl font-bold mt-1">0</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="text-muted-foreground text-sm font-medium">Concluídas</h3>
                  <p className="text-3xl font-bold mt-1">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="border rounded-lg p-6 bg-white fade-in">
            <div className="text-center py-8">
              <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-4">Nenhuma tarefa cadastrada</h2>
              <p className="text-muted-foreground mb-6">
                Você ainda não possui tarefas cadastradas. Clique no botão abaixo para adicionar sua primeira tarefa.
              </p>
              <Button onClick={handleAddTask} className="bg-leju-pink hover:bg-leju-pink/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Tarefa
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tasks;
