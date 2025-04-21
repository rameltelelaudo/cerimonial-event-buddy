
import React, { useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, CheckSquare, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EventContext } from '@/contexts/EventContext';

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
  const { events } = useContext(EventContext);
  
  // Calcular dados reais para os cards
  const guestCount = 0; // Será atualizado quando tivermos uma lista real de convidados
  const confirmedGuests = 0; // Será atualizado quando tivermos uma lista real de convidados confirmados
  
  const eventCount = events.length;
  const nextEventDays = events.length > 0 ? "em breve" : "nenhum agendado";
  
  const taskCount = 0; // Será atualizado quando tivermos tarefas reais
  const pendingTasks = 0; // Será atualizado quando tivermos tarefas pendentes reais
  
  const vendorCount = 0; // Será atualizado quando tivermos fornecedores reais
  const confirmedVendors = 0; // Será atualizado quando tivermos fornecedores confirmados reais
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardCard
        title="Convidados"
        value={guestCount}
        description={`${confirmedGuests} confirmados`}
        icon={<Users className="h-4 w-4 text-leju-pink" />}
        linkTo="/guest-list"
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
