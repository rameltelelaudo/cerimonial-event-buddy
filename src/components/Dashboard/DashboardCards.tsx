
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, CheckSquare, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEventContext } from '@/contexts/EventContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  bgClass?: string;
}

const DashboardCard = ({ title, value, description, icon, linkTo, bgClass }: DashboardCardProps) => (
  <Link to={linkTo}>
    <Card className={`transition-all hover:shadow-md hover:border-leju-pink/50 overflow-hidden ${bgClass || ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-leju-pink/5 pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 rounded-full bg-leju-pink/10">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  </Link>
);

export const DashboardCards = () => {
  const { events } = useEventContext();
  const { user } = useAuth();
  const [guestCount, setGuestCount] = useState(0);
  const [confirmedGuests, setConfirmedGuests] = useState(0);
  const [taskCount, setTaskCount] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [confirmedVendors, setConfirmedVendors] = useState(0);
  
  const eventCount = events.length;
  const nextEventDays = events.length > 0 ? "em breve" : "nenhum agendado";
  
  // Buscar contagem de convidados, tarefas e fornecedores
  useEffect(() => {
    const fetchCounts = async () => {
      if (!user) return;
      
      try {
        // Buscar contagem de convidados
        const { data: guestsData, error: guestsError } = await supabase
          .from('leju_guests')
          .select('id, checked_in')
          .eq('user_id', user.id);
          
        if (!guestsError && guestsData) {
          setGuestCount(guestsData.length);
          setConfirmedGuests(guestsData.filter(g => g.checked_in).length);
        }
        
        // Buscar contagem de tarefas
        const { data: tasksData, error: tasksError } = await supabase
          .from('leju_tasks')
          .select('id, status')
          .eq('user_id', user.id);
          
        if (!tasksError && tasksData) {
          setTaskCount(tasksData.length);
          setPendingTasks(tasksData.filter(t => t.status !== 'concluida').length);
        }
        
        // Buscar contagem de fornecedores
        const { data: vendorsData, error: vendorsError } = await supabase
          .from('leju_vendors')
          .select('id, status')
          .eq('user_id', user.id);
          
        if (!vendorsError && vendorsData) {
          setVendorCount(vendorsData.length);
          setConfirmedVendors(vendorsData.filter(v => v.status === 'confirmado').length);
        }
      } catch (error) {
        console.error('Erro ao buscar contagens:', error);
      }
    };
    
    fetchCounts();
  }, [user]);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardCard
        title="Convidados"
        value={guestCount}
        description={`${confirmedGuests} confirmados`}
        icon={<Users className="h-4 w-4 text-leju-pink" />}
        linkTo="/guests"
        bgClass="border-l-4 border-l-leju-pink"
      />
      <DashboardCard
        title="Eventos"
        value={eventCount}
        description={`Próximo ${nextEventDays}`}
        icon={<Calendar className="h-4 w-4 text-leju-pink" />}
        linkTo="/events"
        bgClass="border-l-4 border-l-blue-500"
      />
      <DashboardCard
        title="Tarefas"
        value={taskCount}
        description={`${pendingTasks} pendentes`}
        icon={<CheckSquare className="h-4 w-4 text-green-500" />}
        linkTo="/tasks"
        bgClass="border-l-4 border-l-green-500"
      />
      <DashboardCard
        title="Fornecedores"
        value={vendorCount}
        description={`${confirmedVendors} confirmados`}
        icon={<Briefcase className="h-4 w-4 text-blue-500" />}
        linkTo="/vendors"
        bgClass="border-l-4 border-l-purple-500"
      />
    </div>
  );
};
