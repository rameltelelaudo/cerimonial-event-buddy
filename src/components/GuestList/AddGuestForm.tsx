
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEventContext } from '@/contexts/EventContext';
import { toast } from 'sonner';
import { GuestGroup } from '@/types/guest';
import * as XLSX from 'xlsx';

const guestGroups: GuestGroup[] = [
  'Família',
  'Padrinhos', 
  'Amigos',
  'Colegas de Trabalho',
  'Fornecedores',
  'Outros'
];

interface AddGuestFormProps {
  onGuestAdded: () => void;
}

export const AddGuestForm: React.FC<AddGuestFormProps> = ({ onGuestAdded }) => {
  const { user } = useAuth();
  const { selectedEvent } = useEventContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkUploading, setBulkUploading] = useState(false);
  
  // Formulário individual
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    group: 'Família' as GuestGroup,
    companions: 0,
    notes: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedEvent) {
      toast.error('Usuário ou evento não encontrado');
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
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          group_type: formData.group,
          companions: formData.companions,
          notes: formData.notes.trim() || null,
          event_id: selectedEvent.id,
          user_id: user.id,
          checked_in: false
        });

      if (error) throw error;

      toast.success('Convidado adicionado com sucesso!');
      
      // Resetar formulário
      setFormData({
        name: '',
        email: '',
        group: 'Família',
        companions: 0,
        notes: ''
      });
      
      setIsOpen(false);
      onGuestAdded();
      
    } catch (error: any) {
      console.error('Erro ao adicionar convidado:', error);
      toast.error('Erro ao adicionar convidado: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Download template Excel
  const downloadTemplate = () => {
    const template = [
      {
        'Nome': 'João Silva',
        'Email': 'joao@email.com',
        'Grupo': 'Família',
        'Acompanhantes': 1,
        'Observações': 'Vegetariano'
      },
      {
        'Nome': 'Maria Santos',
        'Email': 'maria@email.com',
        'Grupo': 'Amigos',
        'Acompanhantes': 0,
        'Observações': ''
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Convidados');
    
    // Ajustar largura das colunas
    const colWidths = [
      { wch: 20 }, // Nome
      { wch: 25 }, // Email
      { wch: 18 }, // Grupo
      { wch: 15 }, // Acompanhantes
      { wch: 30 }  // Observações
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, 'template_convidados.xlsx');
    toast.success('Template baixado com sucesso!');
  };

  // Upload em massa
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !selectedEvent) return;

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast.error('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
      return;
    }

    try {
      setBulkUploading(true);

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            toast.error('Arquivo vazio ou formato inválido');
            return;
          }

          const guests = jsonData.map((row: any) => {
            const name = row['Nome'] || row['nome'] || row['Name'] || '';
            const email = row['Email'] || row['email'] || row['E-mail'] || '';
            const group = row['Grupo'] || row['grupo'] || row['Group'] || 'Outros';
            const companions = parseInt(row['Acompanhantes'] || row['acompanhantes'] || row['Companions'] || '0') || 0;
            const notes = row['Observações'] || row['observacoes'] || row['Notes'] || '';

            // Validar grupo
            const validGroup = guestGroups.includes(group as GuestGroup) ? group : 'Outros';

            return {
              name: name.toString().trim(),
              email: email.toString().trim() || null,
              group_type: validGroup,
              companions: Math.max(0, companions),
              notes: notes.toString().trim() || null,
              event_id: selectedEvent.id,
              user_id: user.id,
              checked_in: false
            };
          }).filter(guest => guest.name); // Filtrar apenas convidados com nome

          if (guests.length === 0) {
            toast.error('Nenhum convidado válido encontrado no arquivo');
            return;
          }

          // Inserir convidados em lote
          const { error } = await supabase
            .from('leju_guests')
            .insert(guests);

          if (error) throw error;

          toast.success(`${guests.length} convidados importados com sucesso!`);
          onGuestAdded();
          
        } catch (error: any) {
          console.error('Erro ao processar arquivo:', error);
          toast.error('Erro ao processar arquivo: ' + error.message);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setBulkUploading(false);
      // Limpar input
      e.target.value = '';
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-leju-pink hover:bg-leju-pink/90">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Convidado
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Convidado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Digite o nome do convidado"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="group">Grupo</Label>
              <Select
                value={formData.group}
                onValueChange={(value) => handleInputChange('group', value as GuestGroup)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo" />
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

            <div>
              <Label htmlFor="companions">Acompanhantes</Label>
              <Input
                id="companions"
                type="number"
                min="0"
                max="10"
                value={formData.companions}
                onChange={(e) => handleInputChange('companions', parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Observações sobre o convidado..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-leju-pink hover:bg-leju-pink/90"
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload em massa */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={downloadTemplate}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Template Excel
        </Button>
        
        <div className="relative">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleBulkUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isBulkUploading}
          />
          <Button
            variant="outline"
            disabled={isBulkUploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isBulkUploading ? 'Importando...' : 'Importar Excel'}
          </Button>
        </div>
      </div>
    </div>
  );
};
