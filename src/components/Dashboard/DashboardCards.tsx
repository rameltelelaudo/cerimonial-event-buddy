
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, CheckSquare, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
}

const DashboardCard = ({ title, value, description, icon, linkTo }: DashboardCardProps) => (
  <Link to={linkTo}>
    <Card className="transition-all hover:shadow-md hover:border-ceremonial-purple/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  </Link>
);

export const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardCard
        title="Convidados"
        value="125"
        description="32 confirmados"
        icon={<Users className="h-4 w-4 text-ceremonial-purple" />}
        linkTo="/guest-list"
      />
      <DashboardCard
        title="Eventos"
        value="3"
        description="Próximo em 15 dias"
        icon={<Calendar className="h-4 w-4 text-ceremonial-gold" />}
        linkTo="/events"
      />
      <DashboardCard
        title="Tarefas"
        value="28"
        description="8 pendentes"
        icon={<CheckSquare className="h-4 w-4 text-green-500" />}
        linkTo="/tasks"
      />
      <DashboardCard
        title="Fornecedores"
        value="12"
        description="5 confirmados"
        icon={<Briefcase className="h-4 w-4 text-blue-500" />}
        linkTo="/vendors"
      />
    </div>
  );
};
