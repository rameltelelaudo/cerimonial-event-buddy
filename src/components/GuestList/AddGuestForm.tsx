
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { guestGroups } from '@/data/guestsData';
import { Guest, GuestGroup } from '@/types/guest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { PlusCircle } from 'lucide-react';

interface AddGuestFormProps {
  onAddGuest: (guest: Guest) => void;
}

export const AddGuestForm = ({ onAddGuest }: AddGuestFormProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState<GuestGroup>(guestGroups[0]);
  const [companions, setCompanions] = useState(0);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setGroup(guestGroups[0]);
    setCompanions(0);
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    
    const newGuest: Guest = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim() || undefined,
      group,
      companions,
      notes: notes.trim() || undefined,
      checkedIn: false
    };
    
    onAddGuest(newGuest);
    toast.success('Convidado adicionado com sucesso');
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-ceremonial-purple hover:bg-ceremonial-purple/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Convidado
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Convidado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nome do convidado"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="email@exemplo.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group">Grupo</Label>
            <Select
              value={group}
              onValueChange={(value) => setGroup(value as GuestGroup)}
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
              type="number" 
              min={0}
              value={companions} 
              onChange={(e) => setCompanions(parseInt(e.target.value) || 0)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Mesa, restrição alimentar, etc."
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-ceremonial-purple hover:bg-ceremonial-purple/90">
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
