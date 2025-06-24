import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Gift, Heart, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GiftListWithItems, GiftItemWithSelections } from '@/types/giftList';

export default function PublicGiftList() {
  const { listId } = useParams();
  const [giftList, setGiftList] = useState<GiftListWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GiftItemWithSelections | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [guestForm, setGuestForm] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 1,
    message: ''
  });

  useEffect(() => {
    if (listId) {
      loadGiftList();
    }
  }, [listId]);

  const loadGiftList = async () => {
    if (!listId) {
      console.log('No listId provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Loading gift list with ID:', listId);

      // Buscar lista de presentes com evento
      const { data: giftListData, error: listError } = await supabase
        .from('leju_gift_lists')
        .select(`
          *,
          leju_events (
            title,
            date,
            location
          )
        `)
        .eq('id', listId)
        .eq('is_active', true)
        .single();

      if (listError) {
        console.error('Error fetching gift list:', listError);
        throw listError;
      }

      if (!giftListData) {
        console.log('Gift list not found or inactive');
        toast.error('Lista de presentes não encontrada ou inativa');
        return;
      }

      console.log('Gift list data found:', giftListData);

      // Buscar itens da lista com seleções
      const { data: itemsData, error: itemsError } = await supabase
        .from('leju_gift_items')
        .select(`
          *,
          leju_gift_selections (*)
        `)
        .eq('gift_list_id', listId)
        .eq('is_available', true)
        .order('created_at', { ascending: true });

      if (itemsError) {
        console.error('Error fetching gift items:', itemsError);
        throw itemsError;
      }

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

      const eventData = giftListData.leju_events as any;

      setGiftList({
        id: giftListData.id,
        eventId: giftListData.event_id,
        userId: giftListData.user_id,
        title: giftListData.title,
        description: giftListData.description,
        isActive: giftListData.is_active,
        createdAt: new Date(giftListData.created_at),
        updatedAt: new Date(giftListData.updated_at),
        items: itemsWithSelections,
        totalItems: itemsWithSelections.length,
        selectedItems: itemsWithSelections.filter(item => item.selections.length > 0).length,
        event: eventData ? {
          title: eventData.title,
          date: new Date(eventData.date),
          location: eventData.location
        } : undefined
      } as any);

    } catch (error: any) {
      console.error('Erro ao carregar lista:', error);
      toast.error('Erro ao carregar lista de presentes');
    } finally {
      setIsLoading(false);
    }
  };

  const selectGift = (item: GiftItemWithSelections) => {
    if (item.availableQuantity <= 0) {
      toast.error('Este presente não está mais disponível');
      return;
    }

    setSelectedItem(item);
    setGuestForm({
      name: '',
      email: '',
      phone: '',
      quantity: 1,
      message: ''
    });
    setIsDialogOpen(true);
  };

  const submitSelection = async () => {
    if (!selectedItem || !guestForm.name.trim()) {
      toast.error('Por favor, preencha seu nome');
      return;
    }

    if (guestForm.quantity > selectedItem.availableQuantity) {
      toast.error('Quantidade indisponível');
      return;
    }

    try {
      setIsSubmitting(true);

      // Registrar seleção
      const { error: selectionError } = await supabase
        .from('leju_gift_selections')
        .insert({
          gift_item_id: selectedItem.id,
          guest_name: guestForm.name.trim(),
          guest_email: guestForm.email.trim() || null,
          guest_phone: guestForm.phone.trim() || null,
          quantity: guestForm.quantity,
          message: guestForm.message.trim() || null
        });

      if (selectionError) throw selectionError;

      // Atualizar quantidade comprada
      const { error: updateError } = await supabase
        .from('leju_gift_items')
        .update({
          purchased_quantity: selectedItem.purchasedQuantity + guestForm.quantity
        })
        .eq('id', selectedItem.id);

      if (updateError) throw updateError;

      toast.success('Presente selecionado com sucesso! 🎁');
      setIsDialogOpen(false);
      setSelectedItem(null);
      loadGiftList(); // Recarregar para atualizar disponibilidade

    } catch (error: any) {
      console.error('Erro ao selecionar presente:', error);
      toast.error('Erro ao selecionar presente');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Gift className="h-16 w-16 mx-auto mb-4 text-leju-pink animate-pulse" />
          <p className="text-lg text-gray-600">Carregando lista de presentes...</p>
        </div>
      </div>
    );
  }

  if (!giftList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Gift className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Lista não encontrada</h1>
          <p className="text-gray-600">Esta lista de presentes não existe ou não está mais ativa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <Heart className="h-12 w-12 text-leju-pink" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {giftList.title}
          </h1>
          
          {(giftList as any).event && (
            <div className="text-lg text-gray-600 mb-4">
              <p className="font-semibold">{(giftList as any).event.title}</p>
              <p>{new Date((giftList as any).event.date).toLocaleDateString('pt-BR')}</p>
              <p>{(giftList as any).event.location}</p>
            </div>
          )}
          
          {giftList.description && (
            <p className="text-gray-700 max-w-2xl mx-auto mb-6">
              {giftList.description}
            </p>
          )}

          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-leju-pink">{giftList.totalItems}</div>
              <div className="text-sm text-gray-600">Itens Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{giftList.selectedItems}</div>
              <div className="text-sm text-gray-600">Já Escolhidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {giftList.totalItems - giftList.selectedItems}
              </div>
              <div className="text-sm text-gray-600">Disponíveis</div>
            </div>
          </div>
        </div>

        {/* Lista de Presentes */}
        {giftList.items.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Gift className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-600">Nenhum presente disponível no momento</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {giftList.items.map((item) => (
              <Card 
                key={item.id} 
                className={`transition-all duration-200 hover:shadow-lg ${
                  item.availableQuantity <= 0 ? 'opacity-60' : 'hover:scale-105'
                }`}
              >
                <CardContent className="p-0">
                  {/* Imagem */}
                  <div className="relative">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                        <Gift className="h-16 w-16 text-leju-pink" />
                      </div>
                    )}
                    
                    {item.availableQuantity <= 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                          <Check className="h-4 w-4 mr-2" />
                          Já Escolhido
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">
                      {item.name}
                    </h3>
                    
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {item.price && (
                      <p className="text-2xl font-bold text-leju-pink mb-3">
                        R$ {item.price.toFixed(2)}
                      </p>
                    )}

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">
                        Disponível: {item.availableQuantity}/{item.quantity}
                      </span>
                      <Badge 
                        variant={item.availableQuantity > 0 ? "default" : "secondary"}
                        className={item.availableQuantity > 0 ? "bg-green-500" : ""}
                      >
                        {item.availableQuantity > 0 ? 'Disponível' : 'Esgotado'}
                      </Badge>
                    </div>

                    <Button
                      onClick={() => selectGift(item)}
                      disabled={item.availableQuantity <= 0}
                      className="w-full bg-leju-pink hover:bg-leju-pink/90 disabled:opacity-50"
                    >
                      {item.availableQuantity > 0 ? (
                        <>
                          <Gift className="h-4 w-4 mr-2" />
                          Escolher Presente
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Já Escolhido
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog de Seleção */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-leju-pink" />
                Escolher Presente
              </DialogTitle>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-4">
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {selectedItem.name}
                  </h3>
                  {selectedItem.price && (
                    <p className="text-xl font-bold text-leju-pink">
                      R$ {selectedItem.price.toFixed(2)}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="guest-name">Seu Nome *</Label>
                  <Input
                    id="guest-name"
                    value={guestForm.name}
                    onChange={(e) => setGuestForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite seu nome"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guest-email">Email</Label>
                    <Input
                      id="guest-email"
                      type="email"
                      value={guestForm.email}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guest-phone">Telefone</Label>
                    <Input
                      id="guest-phone"
                      value={guestForm.phone}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="quantity">
                    Quantidade (máx: {selectedItem.availableQuantity})
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={selectedItem.availableQuantity}
                    value={guestForm.quantity}
                    onChange={(e) => setGuestForm(prev => ({ 
                      ...prev, 
                      quantity: Math.min(parseInt(e.target.value) || 1, selectedItem.availableQuantity)
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensagem (Opcional)</Label>
                  <Textarea
                    id="message"
                    value={guestForm.message}
                    onChange={(e) => setGuestForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Deixe uma mensagem carinhosa para os noivos..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={submitSelection}
                    disabled={isSubmitting || !guestForm.name.trim()}
                    className="bg-leju-pink hover:bg-leju-pink/90"
                  >
                    {isSubmitting ? 'Confirmando...' : 'Confirmar Escolha'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
