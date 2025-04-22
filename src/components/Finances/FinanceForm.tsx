
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FinanceFormProps {
  finance: {
    description: string;
    amount: number;
    category: string;
    type: string;
    status: string;
    date: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitButtonText: string;
}

export const FinanceForm: React.FC<FinanceFormProps> = ({
  finance,
  onInputChange,
  onSelectChange,
  onSubmit,
  onCancel,
  submitButtonText
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input 
          id="description" 
          name="description"
          value={finance.description}
          onChange={onInputChange}
          placeholder="Ex: Aluguel do salão, Buffet, DJ"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Valor</Label>
        <Input 
          id="amount" 
          name="amount"
          type="number"
          value={finance.amount}
          onChange={onInputChange}
          placeholder="Ex: 1500.00"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Input 
          id="category" 
          name="category"
          value={finance.category}
          onChange={onInputChange}
          placeholder="Ex: Contratações, Alimentação, Decoração"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select
            value={finance.type}
            onValueChange={(value) => onSelectChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={finance.status}
            onValueChange={(value) => onSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input 
          id="date" 
          name="date"
          type="date"
          value={finance.date}
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          variant="outline" 
          type="button"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-leju-pink hover:bg-leju-pink/90"
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};
