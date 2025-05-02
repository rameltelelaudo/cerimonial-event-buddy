
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEventContext } from '@/contexts/EventContext';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types/event';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { CalendarDays, MapPin, Clock } from 'lucide-react';

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
    
    if (!hasEvents) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          {date.getDate()}
        </div>
      );
    }
    
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="relative w-full h-full cursor-pointer">
            <div className="flex items-center justify-center w-full h-full font-bold text-leju-pink">
              {date.getDate()}
            </div>
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-leju-pink animate-pulse"
            />
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="p-0 w-72 bg-white shadow-lg rounded-lg border border-leju-pink/20">
          <div className="p-3">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
              <CalendarDays className="h-4 w-4 text-leju-pink" />
              {format(date, "dd 'de' MMMM", { locale: ptBR })}
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {dayEvents.map(event => (
                <div 
                  key={event.id}
                  className="p-2 hover:bg-leju-pink/10 rounded-md cursor-pointer transition-colors border border-transparent hover:border-leju-pink/30"
                  onClick={() => handleSelectEvent(event)}
                >
                  <h5 className="font-medium text-sm">{event.title}</h5>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(event.date), "HH:mm'h'", { locale: ptBR })}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
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
    <TooltipProvider>
      <Card className="bg-white shadow-md border-leju-pink/20 mb-6 w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center justify-center">
            Calendário de Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <Calendar 
                mode="single"
                className="rounded-md border"
                locale={ptBR}
                selected={undefined}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
                modifiers={{
                  events: eventDates
                }}
                modifiersClassNames={{
                  events: 'bg-leju-pink/10 hover:bg-leju-pink/20 transition-colors'
                }}
                components={{
                  Day: ({ date, ...props }) => (
                    <div {...props}>
                      {renderDay(date)}
                    </div>
                  )
                }}
              />
            </div>
            {eventDates.length > 0 ? (
              <div className="lg:w-1/2">
                <h3 className="font-medium mb-3 text-center lg:text-left">Próximos eventos:</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {events.slice(0, 5).map(event => (
                    <Tooltip key={event.id}>
                      <TooltipTrigger asChild>
                        <div 
                          className="text-sm p-3 bg-slate-50 rounded-md cursor-pointer hover:bg-leju-pink/10 transition-all border border-transparent hover:border-leju-pink/20 hover:shadow-sm"
                          onClick={() => handleSelectEvent(event)}
                        >
                          <span className="font-medium">{event.title}</span>
                          <span className="text-muted-foreground block">
                            {format(new Date(event.date), "dd 'de' MMMM', às' HH:mm'h'", { locale: ptBR })}
                          </span>
                          {event.location && (
                            <span className="text-muted-foreground text-xs block mt-1 truncate">
                              {event.location}
                            </span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="bg-white border border-leju-pink/20 shadow-md">
                        {event.description ? (
                          <p className="max-w-xs">{event.description.substring(0, 100)}{event.description.length > 100 ? '...' : ''}</p>
                        ) : (
                          <p className="italic text-muted-foreground">Sem descrição</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ) : (
              <div className="lg:w-1/2 flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Não há eventos agendados.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
