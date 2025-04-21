
import React from 'react';
import { Guest } from '@/types/guest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GuestStatsProps {
  guests: Guest[];
}

export const GuestStats = ({ guests }: GuestStatsProps) => {
  const totalGuests = guests.length;
  const totalWithCompanions = guests.reduce((acc, guest) => acc + guest.companions + 1, 0);
  const checkedInCount = guests.filter(guest => guest.checkedIn).length;
  const checkedInWithCompanions = guests
    .filter(guest => guest.checkedIn)
    .reduce((acc, guest) => acc + guest.companions + 1, 0);
  
  const pendingCount = totalGuests - checkedInCount;
  const pendingWithCompanions = totalWithCompanions - checkedInWithCompanions;

  const stats = [
    { 
      title: "Total de Convidados", 
      value: totalGuests,
      withCompanions: totalWithCompanions,
      color: "text-ceremonial-purple" 
    },
    { 
      title: "Confirmados", 
      value: checkedInCount,
      withCompanions: checkedInWithCompanions,
      color: "text-green-600" 
    },
    { 
      title: "Pendentes", 
      value: pendingCount,
      withCompanions: pendingWithCompanions,
      color: "text-amber-600" 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value} <span className="text-sm font-normal text-muted-foreground">convidados</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.withCompanions} pessoas com acompanhantes
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
