
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex items-center">
        <Loader2 className="h-8 w-8 animate-spin text-leju-pink" />
        <span className="ml-2">Carregando...</span>
      </div>
    </div>
  );
};
