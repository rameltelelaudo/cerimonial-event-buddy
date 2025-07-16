import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, Clock, Calendar } from 'lucide-react';
import type { Guest } from '@/types/guest';

interface ChecklistStatsProps {
  guests: Guest[];
}

export const ChecklistStats = ({ guests }: ChecklistStatsProps) => {
  const total = guests.length;
  const checkedIn = guests.filter(g => g.checkedIn).length;
  const pending = total - checkedIn;
  const totalWithCompanions = guests.reduce((acc, guest) => acc + guest.companions + 1, 0);
  const checkedInWithCompanions = guests
    .filter(g => g.checkedIn)
    .reduce((acc, guest) => acc + guest.companions + 1, 0);

  const checkInRate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-blue-600">{total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Confirmados</p>
              <p className="text-2xl font-bold text-green-600">{checkedIn}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">{pending}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Taxa</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-purple-600">{checkInRate}%</p>
                <Badge variant={checkInRate >= 80 ? "default" : checkInRate >= 50 ? "secondary" : "destructive"}>
                  {checkInRate >= 80 ? "Ótimo" : checkInRate >= 50 ? "Bom" : "Baixo"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas com acompanhantes */}
      <Card className="md:col-span-2">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Com Acompanhantes</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Esperado</p>
              <p className="text-xl font-bold">{totalWithCompanions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Presentes</p>
              <p className="text-xl font-bold text-green-600">{checkedInWithCompanions}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};