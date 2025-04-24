
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChecklistFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ChecklistFilters = ({ searchTerm, onSearchChange }: ChecklistFiltersProps) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar convidado..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};
