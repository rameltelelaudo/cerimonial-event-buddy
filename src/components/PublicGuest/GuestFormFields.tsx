
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GuestGroup } from "@/types/guest";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Companion {
  name: string;
  group: GuestGroup;
}

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
  const [showCompanionDetails, setShowCompanionDetails] = useState(false);
  const [companions, setCompanions] = useState<Companion[]>([]);

  const handleCompanionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    handleNumberInput(e);
    
    if (count > 0) {
      setShowCompanionDetails(true);
      // Ajustar lista de acompanhantes
      const newCompanions = [...companions];
      if (count > companions.length) {
        // Adicionar novos acompanhantes
        for (let i = companions.length; i < count; i++) {
          newCompanions.push({ name: '', group: 'Família' });
        }
      } else {
        // Remover acompanhantes extras
        newCompanions.splice(count);
      }
      setCompanions(newCompanions);
    } else {
      setShowCompanionDetails(false);
      setCompanions([]);
    }
  };

  const updateCompanion = (index: number, field: keyof Companion, value: string) => {
    const newCompanions = [...companions];
    newCompanions[index] = { ...newCompanions[index], [field]: value };
    setCompanions(newCompanions);
  };

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
        <Label htmlFor="companions">Número de Acompanhantes</Label>
        <Input 
          id="companions" 
          name="companions"
          type="number" 
          min={0}
          max={10}
          value={guest.companions} 
          onChange={handleCompanionsChange} 
          placeholder="0"
        />
        <p className="text-xs text-gray-500">Informe quantas pessoas virão com você</p>
      </div>

      {/* Detalhes dos Acompanhantes */}
      {showCompanionDetails && companions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-leju-pink" />
              Dados dos Acompanhantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {companions.map((companion, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-700">Acompanhante {index + 1}</h4>
                
                <div className="space-y-2">
                  <Label htmlFor={`companion-name-${index}`}>Nome Completo *</Label>
                  <Input
                    id={`companion-name-${index}`}
                    value={companion.name}
                    onChange={(e) => updateCompanion(index, 'name', e.target.value)}
                    placeholder="Nome do acompanhante"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`companion-group-${index}`}>Grupo</Label>
                  <Select
                    value={companion.group}
                    onValueChange={(value) => updateCompanion(index, 'group', value as GuestGroup)}
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
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea 
          id="notes" 
          name="notes"
          value={guest.notes} 
          onChange={handleInputChange} 
          placeholder="Restrições alimentares, alergias, ou outras observações importantes..."
          rows={3}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-leju-pink hover:bg-leju-pink/90"
        disabled={submitting || (showCompanionDetails && companions.some(c => !c.name.trim()))}
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
      
      {showCompanionDetails && companions.some(c => !c.name.trim()) && (
        <p className="text-sm text-red-500 text-center">
          Por favor, preencha o nome de todos os acompanhantes
        </p>
      )}
    </div>
  );
};
