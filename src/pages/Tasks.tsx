
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, PlusCircle, Clock, Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddTaskForm } from '@/components/Tasks/AddTaskForm';
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Tasks = () => {
  const isMobile = useIsMobile();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Carregar tarefas do Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('leju_tasks')
          .select('*')
          .order('due_date', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          const transformedTasks: Task[] = data.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description || undefined,
            dueDate: new Date(task.due_date),
            status: task.status as 'pendente' | 'em_andamento' | 'concluida',
            priority: task.priority as 'baixa' | 'media' | 'alta',
            eventId: task.event_id || undefined,
            assignedTo: task.assigned_to || undefined
          }));
          
          setTasks(transformedTasks);
        }
      } catch (error: any) {
        console.error('Erro ao carregar tarefas:', error);
        toast.error(`Erro ao carregar tarefas: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [user]);
  
  const handleAddTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
    setIsAddModalOpen(false);
  };
  
  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'alta':
        return <Badge className="bg-red-500 hover:bg-red-600"><AlertTriangle className="mr-1 h-3 w-3" /> Alta</Badge>;
      case 'media':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Média</Badge>;
      case 'baixa':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Baixa</Badge>;
      default:
        return <Badge>Não definida</Badge>;
    }
  };
  
  const getStatusClass = (status: Task['status']) => {
    switch (status) {
      case 'concluida':
        return 'bg-green-50 border-green-200';
      case 'em_andamento':
        return 'bg-blue-50 border-blue-200';
      default:
        return '';
    }
  };
  
  // Contagem de tarefas por status
  const pendingTasksCount = tasks.filter(task => task.status === 'pendente').length;
  const inProgressTasksCount = tasks.filter(task => task.status === 'em_andamento').length;
  const completedTasksCount = tasks.filter(task => task.status === 'concluida').length;
  
  return (
    <div className="flex min-h-screen flex-col bg-leju-background"
         style={{ backgroundImage: "url('https://i.ibb.co/4gcB6kL/wedding-background.jpg')", 
                  backgroundSize: "cover", 
                  backgroundPosition: "center",
                  backgroundAttachment: "fixed" }}>
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6 backdrop-blur-sm bg-white/60">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Tarefas</h1>
              <p className="text-muted-foreground mt-1">
                Organize suas tarefas e atividades
              </p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-leju-pink hover:bg-leju-pink/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
          
          <Card className="mb-6 glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center bg-white/80">
                  <h3 className="text-muted-foreground text-sm font-medium">Pendentes</h3>
                  <p className="text-3xl font-bold mt-1">{pendingTasksCount}</p>
                </div>
                <div className="border rounded-lg p-4 text-center bg-white/80">
                  <h3 className="text-muted-foreground text-sm font-medium">Em Andamento</h3>
                  <p className="text-3xl font-bold mt-1">{inProgressTasksCount}</p>
                </div>
                <div className="border rounded-lg p-4 text-center bg-white/80">
                  <h3 className="text-muted-foreground text-sm font-medium">Concluídas</h3>
                  <p className="text-3xl font-bold mt-1">{completedTasksCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-leju-pink" />
              <span className="ml-2">Carregando tarefas...</span>
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card 
                  key={task.id} 
                  className={`hover:shadow-md transition-shadow glass ${getStatusClass(task.status)}`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <h3 className="font-medium">{task.title}</h3>
                          {getPriorityBadge(task.priority)}
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <span className="flex items-center text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            Vence em {format(new Date(task.dueDate), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                          
                          {task.assignedTo && (
                            <span className="text-muted-foreground">
                              Responsável: {task.assignedTo}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 sm:mt-0">
                        <Badge 
                          className={
                            task.status === 'concluida' 
                              ? 'bg-green-500 hover:bg-green-600'
                              : task.status === 'em_andamento'
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-yellow-500 hover:bg-yellow-600'
                          }
                        >
                          {task.status === 'concluida' 
                            ? 'Concluída' 
                            : task.status === 'em_andamento' 
                              ? 'Em andamento' 
                              : 'Pendente'
                          }
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-6 bg-white/80 fade-in">
              <div className="text-center py-8">
                <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-4">Nenhuma tarefa cadastrada</h2>
                <p className="text-muted-foreground mb-6">
                  Você ainda não possui tarefas cadastradas. Clique no botão abaixo para adicionar sua primeira tarefa.
                </p>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-leju-pink hover:bg-leju-pink/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Tarefa
                </Button>
              </div>
            </div>
          )}
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Adicionar Tarefa</DialogTitle>
              </DialogHeader>
              <AddTaskForm 
                onAddTask={handleAddTask}
                onCancel={() => setIsAddModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Tasks;
