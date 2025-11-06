
import React from 'react';
import { Check, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChecklistGuestItemProps {
  id: string;
  name: string;
  companions: number;
  checkedIn: boolean;
  onCheckIn: (id: string) => void;
  checkInTime?: Date;
  isMobile: boolean;
}

export const ChecklistGuestItem = ({ 
  id, 
  name, 
  companions, 
  checkedIn, 
  onCheckIn,
  checkInTime,
  isMobile 
}: ChecklistGuestItemProps) => {
  if (isMobile) {
    return (
      <Card className={`mb-3 hover:shadow-md transition-shadow ${checkedIn ? 'bg-green-50 border-green-200' : ''}`}>
        <CardContent className="p-5">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-xl mb-1 truncate">{name}</h3>
              <p className="text-base text-muted-foreground">
                {companions > 0 ? `+${companions} acompanhantes` : 'Sem acompanhantes'}
              </p>
              {checkedIn && checkInTime && (
                <p className="text-sm text-green-700 mt-1">
                  Check-in: {format(checkInTime, "HH:mm", { locale: ptBR })}
                </p>
              )}
            </div>
            <Button 
              size="lg" 
              variant={checkedIn ? "outline" : "default"}
              className={`${checkedIn ? "bg-green-100 text-green-800 border-green-300" : "bg-leju-pink hover:bg-leju-pink/90"} text-base px-6 py-6 min-w-[120px]`}
              onClick={() => onCheckIn(id)}
              disabled={checkedIn}
            >
              {checkedIn ? (
                <div className="flex flex-col items-center">
                  <Check className="h-5 w-5 mb-1" />
                  <span className="text-sm">Confirmado</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UserCheck className="h-5 w-5 mb-1" />
                  <span className="text-sm">Check-in</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TableRow className={checkedIn ? 'bg-green-50' : ''}>
      <TableCell className="font-medium text-lg">{name}</TableCell>
      <TableCell className="text-base">{companions}</TableCell>
      <TableCell>
        {checkedIn ? (
          <div>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-base py-1">
              <Check className="mr-1 h-4 w-4" /> Confirmado
            </Badge>
            {checkInTime && (
              <p className="text-sm text-green-700 mt-1">
                {format(checkInTime, "HH:mm", { locale: ptBR })}
              </p>
            )}
          </div>
        ) : (
          <Badge variant="outline" className="text-base py-1">Pendente</Badge>
        )}
      </TableCell>
      <TableCell>
        <Button 
          size="lg" 
          variant={checkedIn ? "outline" : "default"}
          className={`${checkedIn ? "bg-green-100 text-green-800 border-green-300" : "bg-leju-pink hover:bg-leju-pink/90"} text-base px-6`}
          onClick={() => onCheckIn(id)}
          disabled={checkedIn}
        >
          {checkedIn ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Confirmado
            </>
          ) : (
            <>
              <UserCheck className="mr-2 h-5 w-5" />
              Check-in
            </>
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};
