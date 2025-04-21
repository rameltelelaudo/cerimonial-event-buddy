
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { DashboardCards } from '@/components/Dashboard/DashboardCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Index = () => {
  const isMobile = useIsMobile();
  const { events } = useEventContext();
  
  const handleAddEvent = () => {
    toast.info("Clique em 'Eventos' no menu para cadastrar um novo evento");
  };
  
  const handleAddTask = () => {
    toast.info("Clique em 'Tarefas' no menu para cadastrar uma nova tarefa");
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao seu sistema de gerenciamento de eventos.
            </p>
          </div>
          
          <div className="space-y-6">
            <DashboardCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm border-leju-pink/20 fade-in">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-leju-pink" />
                      Próximos Eventos
                    </CardTitle>
                    <Link to="/events">
                      <Button size="sm" variant="outline" className="text-xs">
                        Ver todos
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {events.length > 0 ? (
                    <div className="space-y-4">
                      {events.slice(0, 3).map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 rounded-md border hover:bg-leju-pink/5 transition-colors">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(event.date), "dd 'de' MMMM', às' HH:mm'h'", { locale: ptBR })}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {event.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center">
                      <p className="text-muted-foreground mb-2">Você não possui eventos cadastrados</p>
                      <Button onClick={handleAddEvent} variant="outline" size="sm" className="text-ceremonial-purple">
                        <PlusCircle className="h-4 w-4 mr-1" /> Adicionar Evento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm border-leju-pink/20 fade-in">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold flex items-center">
                      <CheckSquare className="h-5 w-5 mr-2 text-green-500" />
                      Tarefas Recentes
                    </CardTitle>
                    <Link to="/tasks">
                      <Button size="sm" variant="outline" className="text-xs">
                        Ver todas
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center">
                    <p className="text-muted-foreground mb-2">Você não possui tarefas cadastradas</p>
                    <Button onClick={handleAddTask} variant="outline" size="sm" className="text-ceremonial-purple">
                      <PlusCircle className="h-4 w-4 mr-1" /> Adicionar Tarefa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
