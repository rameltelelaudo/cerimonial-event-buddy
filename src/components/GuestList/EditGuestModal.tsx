
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEventContext } from '@/contexts/EventContext';
import { toast } from 'sonner';
import { Guest } from '@/types/guest';

interface EditGuestModalProps {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  onGuestUpdated: () => void;
}

const guestGroups = [
  'Família',
  'Padrinhos',
  'Amigos',
  'Colegas de Trabalho',
  'Fornecedores',
  'Outros'
];

export const EditGuestModal: React.FC<EditGuestModalProps> = ({
  guest,
  isOpen,
  onClose,
  onGuestUpdated
}) => {
  const { user } = useAuth();
  const { selectedEvent } = useEventContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    group: 'Família',
    companions: 0,
    notes: ''
  });

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name || '',
        email: guest.email || '',
        group: guest.group || 'Família',
        companions: guest.companions || 0,
        notes: guest.notes || ''
      });
    }
  }, [guest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedEvent || !guest) {
      toast.error('Erro: usuário, evento ou convidado não encontrado');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('leju_guests')
        .update({
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          group_type: formData.group,
          companions: formData.companions,
          notes: formData.notes.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', guest.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Convidado atualizado com sucesso!');
      onGuestUpdated();
      onClose();
    } catch (error: any) {
      console.error('Erro ao atualizar convidado:', error);
      toast.error('Erro ao atualizar convidado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      group: 'Família',
      companions: 0,
      notes: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Convidado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome do convidado"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">Grupo</Label>
            <Select
              value={formData.group}
              onValueChange={(value) => setFormData({ ...formData, group: value })}
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
              min="0"
              value={formData.companions}
              onChange={(e) => setFormData({ ...formData, companions: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
