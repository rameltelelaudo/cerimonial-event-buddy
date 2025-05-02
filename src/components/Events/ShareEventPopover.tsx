
import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

interface ShareEventPopoverProps {
  eventId: string;
  eventTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareEventPopover = ({ 
  eventId, 
  eventTitle, 
  isOpen, 
  onOpenChange 
}: ShareEventPopoverProps) => {
  const getPublicFormUrl = (id: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/public-guest-form/${id}`;
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Link copiado para a área de transferência");
        onOpenChange(false);
      })
      .catch(() => {
        toast.error("Erro ao copiar link");
      });
  };
  
  const shareViaWhatsApp = (id: string, title: string) => {
    const url = getPublicFormUrl(id);
    const message = encodeURIComponent(`Confirme sua presença no evento "${title}": ${url}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
    onOpenChange(false);
  };
  
  const shareViaEmail = (id: string, title: string) => {
    const url = getPublicFormUrl(id);
    const subject = encodeURIComponent(`Confirmação de presença: ${title}`);
    const body = encodeURIComponent(`Olá,\n\nConfirme sua presença no evento "${title}" através do link abaixo:\n\n${url}\n\nAguardamos você!`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    onOpenChange(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white">
          <Share2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-2">
          <h4 className="font-medium">Compartilhar formulário de convite</h4>
          <p className="text-sm text-muted-foreground">
            Compartilhe este link para que os convidados confirmem presença
          </p>
          
          <div className="flex items-center space-x-2">
            <Input 
              value={getPublicFormUrl(eventId)} 
              readOnly 
              className="flex-1 text-xs"
            />
            <Button 
              size="sm" 
              className="shrink-0" 
              onClick={() => copyToClipboard(getPublicFormUrl(eventId))}
            >
              Copiar
            </Button>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => shareViaWhatsApp(eventId, eventTitle)}
            >
              WhatsApp
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => shareViaEmail(eventId, eventTitle)}
            >
              Email
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
