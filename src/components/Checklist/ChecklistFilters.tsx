
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { VoiceSearch } from './VoiceSearch';

interface ChecklistFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ChecklistFilters = ({ searchTerm, onSearchChange }: ChecklistFiltersProps) => {
  return (
    <div className="mb-6 flex gap-2 flex-col sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder="Buscar convidado..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-base sm:text-lg"
        />
      </div>
      <VoiceSearch onTranscript={onSearchChange} />
    </div>
  );
};
