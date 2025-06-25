
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface PixGeneratorProps {
  guestName: string;
  eventTitle: string;
  amount: number;
}

export const PixGenerator: React.FC<PixGeneratorProps> = ({ guestName, eventTitle, amount }) => {
  // Código PIX simplificado e fixo
  const pixCode = `00020126490014BR.GOV.BCB.PIX0127lejuassessoriavix@gmail.com52040000530398654${amount.toFixed(2).padStart(6, '0')}5802BR5901N6001C62${guestName.length.toString().padStart(2, '0')}${guestName.substring(0, 25)}6304E4C2`;

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast.success('Código PIX copiado para a área de transferência!');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-leju-pink">
          Pagamento via PIX
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Valor: <span className="font-bold text-lg">R$ {amount.toFixed(2)}</span>
          </p>
          <p className="text-xs text-gray-500">
            Para: {guestName}
          </p>
        </div>

        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg border">
            <QRCodeSVG
              value={pixCode}
              size={200}
              level="M"
              includeMargin={true}
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-center">PIX Copia e Cola:</p>
          <div className="bg-gray-50 p-3 rounded text-xs break-all font-mono">
            {pixCode}
          </div>
          <Button 
            onClick={copyPixCode}
            className="w-full" 
            variant="outline"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar Código PIX
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>Chave PIX: lejuassessoriavix@gmail.com</p>
          <p>Escaneie o QR Code ou copie o código</p>
        </div>
      </CardContent>
    </Card>
  );
};
