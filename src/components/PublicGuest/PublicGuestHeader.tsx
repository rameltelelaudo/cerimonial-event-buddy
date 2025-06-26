
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";

interface PublicGuestHeaderProps {
  event: any;
}

export const PublicGuestHeader: React.FC<PublicGuestHeaderProps> = ({ event }) => {
  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-4">
        {/* Logo do sistema à esquerda */}
        <div>
          <img 
            src="https://i.ibb.co/G40sCgqs/images.jpg" 
            alt="Leju App" 
            className="h-10 w-auto"
          />
        </div>
        
        {/* Foto do evento no centro (se disponível) */}
        <div className="flex-1 flex justify-center">
          {(event?.cover_image || event?.image) && (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-leju-pink">
              <img 
                src={event.cover_image || event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        
        {/* Espaço vazio à direita para balancear */}
        <div className="w-10"></div>
      </div>
      
      <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
        {event?.title}
      </CardTitle>
      <CardDescription className="text-lg">
        {event && new Date(event.date).toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        })}
        {event && ' • '}
        {event?.location}
      </CardDescription>
    </div>
  );
};
