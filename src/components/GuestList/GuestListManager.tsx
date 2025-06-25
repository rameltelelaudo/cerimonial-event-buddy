
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const GuestListManager: React.FC = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Gerenciador de Convidados
        </h3>
        <p className="text-gray-600">
          Funcionalidade em desenvolvimento
        </p>
      </CardContent>
    </Card>
  );
};
