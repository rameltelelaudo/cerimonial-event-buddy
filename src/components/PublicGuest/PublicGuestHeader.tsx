
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";

interface PublicGuestHeaderProps {
  event: any;
}

export const PublicGuestHeader: React.FC<PublicGuestHeaderProps> = ({ event }) => {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4">
        <img 
          src="https://i.ibb.co/G40sCgqs/images.jpg" 
          alt="Leju App" 
          className="h-12 w-auto mx-auto"
        />
      </div>
      <CardTitle>{event?.title}</CardTitle>
      <CardDescription>
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
