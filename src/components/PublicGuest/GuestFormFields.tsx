
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GuestGroup } from "@/types/guest";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GuestFormFieldsProps {
  guest: {
    name: string;
    email: string;
    group: GuestGroup;
    companions: number;
    notes: string;
  };
  guestGroups: GuestGroup[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setGuest: (guest: any) => void;
  submitting: boolean;
  isEdit?: boolean;
}

export const GuestFormFields: React.FC<GuestFormFieldsProps> = ({
  guest,
  guestGroups,
  handleInputChange,
  handleNumberInput,
  setGuest,
  submitting,
  isEdit = false
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo *</Label>
        <Input 
          id="name" 
          name="name"
          value={guest.name} 
          onChange={handleInputChange} 
          placeholder="Digite seu nome completo"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          value={guest.email} 
          onChange={handleInputChange} 
          placeholder="seu.email@exemplo.com"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="group">Grupo</Label>
        <Select
          value={guest.group}
          onValueChange={(value) => setGuest({...guest, group: value as GuestGroup})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um grupo" />
          </SelectTrigger>
          <SelectContent>
            {guestGroups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="companions">Acompanhantes</Label>
        <Input 
          id="companions" 
          name="companions"
          type="number" 
          min={0}
          value={guest.companions} 
          onChange={handleNumberInput} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea 
          id="notes" 
          name="notes"
          value={guest.notes} 
          onChange={handleInputChange} 
          placeholder="Restrições alimentares, alergias, etc."
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-leju-pink hover:bg-leju-pink/90"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEdit ? "Salvando..." : "Enviando..."}
          </>
        ) : (
          isEdit ? "Salvar" : "Confirmar Presença"
        )}
      </Button>
    </div>
  );
};
