
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
      <Card className={`mb-2 hover:shadow-md transition-shadow ${checkedIn ? 'bg-green-50 border-green-200' : ''}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className="text-sm text-muted-foreground">
                {companions > 0 ? `+${companions} acompanhantes` : 'Sem acompanhantes'}
              </p>
            </div>
            <Button 
              size="sm" 
              variant={checkedIn ? "outline" : "default"}
              className={checkedIn ? "bg-green-100 text-green-800 border-green-300" : "bg-leju-pink hover:bg-leju-pink/90"}
              onClick={() => onCheckIn(id)}
              disabled={checkedIn}
            >
              {checkedIn ? (
                <>
                  <Check className="mr-1 h-4 w-4" />
                  Confirmado
                </>
              ) : (
                <>
                  <UserCheck className="mr-1 h-4 w-4" />
                  Check-in
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TableRow className={checkedIn ? 'bg-green-50' : ''}>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>{companions}</TableCell>
      <TableCell>
        {checkedIn ? (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <Check className="mr-1 h-3 w-3" /> Confirmado
          </Badge>
        ) : (
          <Badge variant="outline">Pendente</Badge>
        )}
      </TableCell>
      <TableCell>
        <Button 
          size="sm" 
          variant={checkedIn ? "outline" : "default"}
          className={checkedIn ? "bg-green-100 text-green-800 border-green-300" : "bg-leju-pink hover:bg-leju-pink/90"}
          onClick={() => onCheckIn(id)}
          disabled={checkedIn}
        >
          {checkedIn ? (
            <>
              <Check className="mr-1 h-4 w-4" />
              Confirmado
            </>
          ) : (
            <>
              <UserCheck className="mr-1 h-4 w-4" />
              Check-in
            </>
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};
