import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEventContext } from '@/contexts/EventContext';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types/event';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export const EventCalendar = () => {
  const { events } = useEventContext();
  const navigate = useNavigate();

  const eventDates = events.map(event => new Date(event.date));

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const handleSelectEvent = (event: Event) => {
    navigate(`/finances/${event.id}`);
  };

  const renderDay = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    const hasEvents = dayEvents.length > 0;
    
    return (
      <div className="relative w-full h-full">
        <div className={`flex items-center justify-center w-full h-full ${hasEvents ? 'font-bold text-leju-pink' : ''}`}>
          {date.getDate()}
        </div>
        {hasEvents && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-leju-pink"></div>
        )}
      </div>
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const selectedEvents = getEventsForDate(date);
    if (selectedEvents.length === 1) {
      handleSelectEvent(selectedEvents[0]);
    } else if (selectedEvents.length > 1) {
      selectedEvents.forEach(event => {
        toast.info(`${event.title} - ${format(new Date(event.date), 'HH:mm')}`, {
          action: {
            label: 'Ver',
            onClick: () => handleSelectEvent(event),
          },
        });
      });
    }
  };

  return (
    <Card className="bg-white shadow-sm border-leju-pink/20 mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          Calendário de Eventos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar 
          mode="single"
          className="rounded-md border"
          locale={ptBR}
          selected={undefined}
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          initialFocus
        />
        {eventDates.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Próximos eventos:</h3>
            <div className="space-y-1">
              {events.slice(0, 3).map(event => (
                <div 
                  key={event.id} 
                  className="text-sm p-2 bg-slate-50 rounded-md cursor-pointer hover:bg-leju-pink/10"
                  onClick={() => handleSelectEvent(event)}
                >
                  <span className="font-medium">{event.title}</span>
                  <span className="text-muted-foreground block">
                    {format(new Date(event.date), "dd 'de' MMMM', às' HH:mm'h'", { locale: ptBR })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
