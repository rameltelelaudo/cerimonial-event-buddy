
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploadButtonProps {
  eventId: string;
  onImageUploaded: (imageUrl: string) => void;
}

export const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({ eventId, onImageUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar o tipo do arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${eventId}-${Date.now()}.${fileExt}`;
    const filePath = `event-covers/${fileName}`;
    
    // Verificar o tipo de arquivo
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(fileExt?.toLowerCase() || '')) {
      toast.error('Tipo de arquivo não suportado. Use JPG, PNG ou WebP.');
      return;
    }
    
    // Verificar tamanho do arquivo (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Arquivo muito grande. O tamanho máximo é 2MB.');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Fazer upload para o Supabase Storage
      const { data, error } = await supabase
        .storage
        .from('event-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Obter a URL pública
      const { data: publicUrlData } = supabase
        .storage
        .from('event-images')
        .getPublicUrl(filePath);
      
      // Atualizar o evento com a URL da imagem
      const { error: updateError } = await supabase
        .from('leju_events')
        .update({ cover_image: publicUrlData.publicUrl })
        .eq('id', eventId);
      
      if (updateError) throw updateError;
      
      onImageUploaded(publicUrlData.publicUrl);
      toast.success('Imagem do evento atualizada com sucesso!');
      
    } catch (error: any) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="relative inline-block">
      <input
        type="file"
        accept="image/jpeg, image/png, image/webp"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleUpload}
        disabled={isUploading}
      />
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8 rounded-full bg-white"
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
