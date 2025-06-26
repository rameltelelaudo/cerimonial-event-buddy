import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Share2, Gift } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEventContext } from '@/contexts/EventContext';
import { toast } from 'sonner';
import { GiftList, GiftItem, GiftItemWithSelections } from '@/types/giftList';

export const GiftListManager: React.FC = () => {
  const { user } = useAuth();
  const { selectedEvent } = useEventContext();
  const [giftList, setGiftList] = useState<GiftList | null>(null);
  const [giftItems, setGiftItems] = useState<GiftItemWithSelections[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GiftItem | null>(null);

  // Estados do formulário da lista
  const [listForm, setListForm] = useState({
    title: 'Lista de Presentes',
    description: ''
  });

  // Estados do formulário de item
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    quantity: 1
  });

  useEffect(() => {
    if (selectedEvent && user) {
      loadGiftList();
    }
  }, [selectedEvent, user]);

  const loadGiftList = async () => {
    if (!selectedEvent || !user) return;

    try {
      setIsLoading(true);

      // Buscar lista de presentes
      const { data: giftListData, error: listError } = await supabase
        .from('leju_gift_lists')
        .select('*')
        .eq('event_id', selectedEvent.id)
        .eq('user_id', user.id)
        .single();

      if (listError && listError.code !== 'PGRST116') {
        throw listError;
      }

      if (giftListData) {
        setGiftList({
          id: giftListData.id,
          eventId: giftListData.event_id,
          userId: giftListData.user_id,
          title: giftListData.title,
          description: giftListData.description,
          isActive: giftListData.is_active,
          createdAt: new Date(giftListData.created_at),
          updatedAt: new Date(giftListData.updated_at)
        });

        // Buscar itens da lista
        const { data: itemsData, error: itemsError } = await supabase
          .from('leju_gift_items')
          .select(`
            *,
            leju_gift_selections (*)
          `)
          .eq('gift_list_id', giftListData.id)
          .order('created_at', { ascending: true });

        if (itemsError) throw itemsError;

        const itemsWithSelections = itemsData?.map(item => ({
          id: item.id,
          giftListId: item.gift_list_id,
          name: item.name,
          description: item.description,
          price: item.price ? Number(item.price) : undefined,
          imageUrl: item.image_url,
          quantity: item.quantity,
          purchasedQuantity: item.purchased_quantity,
          isAvailable: item.is_available,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
          selections: item.leju_gift_selections?.map((selection: any) => ({
            id: selection.id,
            giftItemId: selection.gift_item_id,
            guestName: selection.guest_name,
            guestEmail: selection.guest_email,
            guestPhone: selection.guest_phone,
            quantity: selection.quantity,
            message: selection.message,
            selectedAt: new Date(selection.selected_at)
          })) || [],
          availableQuantity: item.quantity - item.purchased_quantity
        })) || [];

        setGiftItems(itemsWithSelections);
      }
    } catch (error: any) {
      console.error('Erro ao carregar lista de presentes:', error);
      toast.error('Erro ao carregar lista de presentes');
    } finally {
      setIsLoading(false);
    }
  };

  const createGiftList = async () => {
    if (!selectedEvent || !user) return;

    try {
      const { data, error } = await supabase
        .from('leju_gift_lists')
        .insert({
          event_id: selectedEvent.id,
          user_id: user.id,
          title: listForm.title,
          description: listForm.description || null,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Lista de presentes criada com sucesso!');
      setIsDialogOpen(false);
      loadGiftList();
    } catch (error: any) {
      console.error('Erro ao criar lista:', error);
      toast.error('Erro ao criar lista de presentes');
    }
  };

  const addGiftItem = async () => {
    if (!giftList) return;

    try {
      const { error } = await supabase
        .from('leju_gift_items')
        .insert({
          gift_list_id: giftList.id,
          name: itemForm.name,
          description: itemForm.description || null,
          price: itemForm.price ? Number(itemForm.price) : null,
          image_url: itemForm.imageUrl || null,
          quantity: itemForm.quantity
        });

      if (error) throw error;

      toast.success('Item adicionado com sucesso!');
      setIsItemDialogOpen(false);
      setItemForm({ name: '', description: '', price: '', imageUrl: '', quantity: 1 });
      loadGiftList();
    } catch (error: any) {
      console.error('Erro ao adicionar item:', error);
      toast.error('Erro ao adicionar item');
    }
  };

  const updateGiftItem = async () => {
    if (!editingItem) return;

    try {
      const { error } = await supabase
        .from('leju_gift_items')
        .update({
          name: itemForm.name,
          description: itemForm.description || null,
          price: itemForm.price ? Number(itemForm.price) : null,
          image_url: itemForm.imageUrl || null,
          quantity: itemForm.quantity
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      toast.success('Item atualizado com sucesso!');
      setIsItemDialogOpen(false);
      setEditingItem(null);
      setItemForm({ name: '', description: '', price: '', imageUrl: '', quantity: 1 });
      loadGiftList();
    } catch (error: any) {
      console.error('Erro ao atualizar item:', error);
      toast.error('Erro ao atualizar item');
    }
  };

  const deleteGiftItem = async (itemId: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      const { error } = await supabase
        .from('leju_gift_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast.success('Item excluído com sucesso!');
      loadGiftList();
    } catch (error: any) {
      console.error('Erro ao excluir item:', error);
      toast.error('Erro ao excluir item');
    }
  };

  const toggleListActive = async () => {
    if (!giftList) return;

    try {
      const { error } = await supabase
        .from('leju_gift_lists')
        .update({ is_active: !giftList.isActive })
        .eq('id', giftList.id);

      if (error) throw error;

      toast.success(`Lista ${giftList.isActive ? 'desativada' : 'ativada'} com sucesso!`);
      loadGiftList();
    } catch (error: any) {
      console.error('Erro ao alterar status da lista:', error);
      toast.error('Erro ao alterar status da lista');
    }
  };

  const shareGiftList = () => {
    if (!giftList) return;
    
    // Usar URL relativa baseada no domínio atual
    const url = `${window.location.origin}/gift-list/${giftList.id}`;
    
    navigator.clipboard.writeText(url);
    toast.success('Link da lista copiado para a área de transferência!');
  };

  const openEditItem = (item: GiftItemWithSelections) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description || '',
      price: item.price?.toString() || '',
      imageUrl: item.imageUrl || '',
      quantity: item.quantity
    });
    setIsItemDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-48">Carregando...</div>;
  }

  if (!giftList) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-leju-pink" />
            Lista de Presentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Gift className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma lista de presentes</h3>
            <p className="text-gray-600 mb-4">
              Crie uma lista de presentes para seus convidados escolherem
            </p>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-leju-pink hover:bg-leju-pink/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Lista de Presentes
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Lista de Presentes</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={listForm.title}
                      onChange={(e) => setListForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Lista de Presentes"
                    />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      value={listForm.description}
                      onChange={(e) => setListForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição da lista de presentes..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={createGiftList} className="bg-leju-pink hover:bg-leju-pink/90">
                      Criar Lista
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header da Lista */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-leju-pink" />
                {giftList.title}
                <Badge variant={giftList.isActive ? "default" : "secondary"}>
                  {giftList.isActive ? 'Ativa' : 'Inativa'}
                </Badge>
              </CardTitle>
              {giftList.description && (
                <p className="text-gray-600 mt-2">{giftList.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shareGiftList}
                className="text-leju-pink border-leju-pink hover:bg-leju-pink hover:text-white"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleListActive}
              >
                {giftList.isActive ? 'Desativar' : 'Ativar'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Botão Adicionar Item */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Itens da Lista ({giftItems.length})
        </h3>
        
        <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-leju-pink hover:bg-leju-pink/90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Item' : 'Novo Item'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do Item *</Label>
                <Input
                  value={itemForm.name}
                  onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do presente"
                  required
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do presente..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preço (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemForm.price}
                    onChange={(e) => setItemForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>
              <div>
                <Label>URL da Imagem</Label>
                <Input
                  value={itemForm.imageUrl}
                  onChange={(e) => setItemForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsItemDialogOpen(false);
                    setEditingItem(null);
                    setItemForm({ name: '', description: '', price: '', imageUrl: '', quantity: 1 });
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={editingItem ? updateGiftItem : addGiftItem}
                  className="bg-leju-pink hover:bg-leju-pink/90"
                  disabled={!itemForm.name.trim()}
                >
                  {editingItem ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Itens */}
      {giftItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Gift className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Nenhum item adicionado ainda</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {giftItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                {item.imageUrl && (
                  <div className="w-full h-48 mb-3 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <h4 className="font-semibold mb-2">{item.name}</h4>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                )}
                {item.price && (
                  <p className="text-lg font-bold text-leju-pink mb-2">
                    R$ {item.price.toFixed(2)}
                  </p>
                )}
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">
                    Disponível: {item.availableQuantity}/{item.quantity}
                  </span>
                  <Badge variant={item.availableQuantity > 0 ? "default" : "secondary"}>
                    {item.availableQuantity > 0 ? 'Disponível' : 'Esgotado'}
                  </Badge>
                </div>

                {item.selections.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">
                      Escolhido por {item.selections.length} pessoa(s):
                    </p>
                    <div className="text-xs text-gray-600">
                      {item.selections.map(selection => (
                        <div key={selection.id}>
                          {selection.guestName} ({selection.quantity}x)
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditItem(item)}
                  >
                    <Edit className="h-4 w-4 text-leju-pink" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteGiftItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
