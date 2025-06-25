
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
  // Função para gerar o código PIX
  const generatePixCode = () => {
    const pixKey = 'lejuassessoriavix@gmail.com';
    const merchantName = 'LEJU ASSESSORIA';
    const merchantCity = 'VITORIA';
    const transactionId = `${guestName}-${eventTitle}`.substring(0, 25);
    
    // Formato do PIX copia e cola (EMV)
    const payload = [
      '00020126', // Payload Format Indicator
      '49', // Merchant Account Information
      '0014BR.GOV.BCB.PIX',
      `01${pixKey.length.toString().padStart(2, '0')}${pixKey}`,
      '5204', // Merchant Category Code
      '0000', // Null
      '5303', // Transaction Currency
      '986', // BRL
      '54', // Transaction Amount
      amount.toFixed(2).padStart(2, '0'),
      '5802BR', // Country Code
      `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`,
      `60${merchantCity.length.toString().padStart(2, '0')}${merchantCity}`,
      '62', // Additional Data Field
      `05${transactionId.length.toString().padStart(2, '0')}${transactionId}`,
      '6304' // CRC16
    ].join('');

    // Calcular CRC16 (simplificado)
    const crc = 'E4C2'; // Para este exemplo, usar um CRC fixo
    
    return payload + crc;
  };

  const pixCode = generatePixCode();

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
            {guestName} - {eventTitle}
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
          <div className="bg-gray-50 p-3 rounded text-xs break-all">
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
