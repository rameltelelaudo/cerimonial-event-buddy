
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vendor } from '@/types/vendor';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddVendorFormProps {
  onAddVendor: (vendor: Vendor) => void;
  onCancel: () => void;
}

const vendorCategories = [
  'Buffet',
  'Decoração',
  'Fotografia',
  'Música',
  'Cerimonial',
  'Local',
  'Bolos e doces',
  'Bebidas',
  'Vestidos',
  'Convites',
  'Lembranças',
  'Outros'
];

export const AddVendorForm = ({ onAddVendor, onCancel }: AddVendorFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Omit<Vendor, 'id'>>({
    name: '',
    category: '',
    contactName: '',
    phone: '',
    email: '',
    status: 'pendente',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.phone) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    if (!user) {
      toast.error('Você precisa estar logado para adicionar fornecedores');
      return;
    }
    
    setLoading(true);
    
    try {
      // Salvar no Supabase
      const { data, error } = await supabase
        .from('leju_vendors')
        .insert({
          name: formData.name,
          category: formData.category,
          contact_name: formData.contactName,
          phone: formData.phone,
          email: formData.email || null,
          status: formData.status,
          notes: formData.notes || null,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Converter o formato do banco para o formato da aplicação
      const newVendor: Vendor = {
        id: data.id,
        name: data.name,
        category: data.category,
        contactName: data.contact_name,
        phone: data.phone,
        email: data.email || '',
        status: data.status as 'confirmado' | 'pendente' | 'cancelado',
        notes: data.notes || ''
      };
      
      onAddVendor(newVendor);
      toast.success('Fornecedor adicionado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao adicionar fornecedor:', error);
      toast.error(`Erro ao adicionar fornecedor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Empresa *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome do fornecedor"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleSelectChange('category', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {vendorCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactName">Nome do Contato</Label>
          <Input
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            placeholder="Nome da pessoa de contato"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@exemplo.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange('status', value as 'confirmado' | 'pendente' | 'cancelado')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="Informações adicionais sobre o fornecedor"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-leju-pink hover:bg-leju-pink/90"
          disabled={loading}
        >
          {loading ? 'Adicionando...' : 'Adicionar Fornecedor'}
        </Button>
      </div>
    </form>
  );
};
