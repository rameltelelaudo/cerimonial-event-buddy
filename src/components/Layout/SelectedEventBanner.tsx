
import React from 'react';
import { useEventContext } from '@/contexts/EventContext';
import { Calendar, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const SelectedEventBanner: React.FC = () => {
  const { selectedEvent } = useEventContext();

  if (!selectedEvent) {
    return null;
  }

  return (
    <Card className="mb-6 p-4 bg-gradient-to-r from-leju-pink/10 to-purple-100/50 border-leju-pink/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-leju-pink" />
            <div>
              <h3 className="font-semibold text-gray-900">Evento Selecionado:</h3>
              <p className="text-sm text-gray-600">{selectedEvent.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{selectedEvent.location}</span>
          </div>
          
          <div className="text-sm text-gray-600">
            {selectedEvent.date.toLocaleDateString('pt-BR')}
          </div>
        </div>
        
        <div className="bg-leju-pink text-white px-3 py-1 rounded-full text-sm font-medium">
          Ativo
        </div>
      </div>
    </Card>
  );
};
