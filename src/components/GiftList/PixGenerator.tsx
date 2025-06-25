
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
    
    // Usar apenas o nome da pessoa como identificador (máximo 25 caracteres)
    const transactionId = guestName.substring(0, 25);
    
    // Construir o payload PIX seguindo o padrão EMV
    const pixKeyField = `0014BR.GOV.BCB.PIX01${pixKey.length.toString().padStart(2, '0')}${pixKey}`;
    const amountField = amount.toFixed(2);
    const additionalDataField = `05${transactionId.length.toString().padStart(2, '0')}${transactionId}`;
    
    // Montar o payload completo
    const payload = [
      '00020126', // Payload Format Indicator
      `${pixKeyField.length.toString().padStart(2, '0')}${pixKeyField}`, // Merchant Account Information
      '52040000', // Merchant Category Code
      '5303986', // Transaction Currency (BRL)
      `54${amountField.length.toString().padStart(2, '0')}${amountField}`, // Transaction Amount
      '5802BR', // Country Code
      `59${merchantName.length.toString().padStart(2, '0')}${merchantName}`, // Merchant Name
      `60${merchantCity.length.toString().padStart(2, '0')}${merchantCity}`, // Merchant City
      `62${additionalDataField.length.toString().padStart(2, '0')}${additionalDataField}`, // Additional Data Field
      '6304' // CRC16 placeholder
    ].join('');

    // Calcular CRC16 simplificado (para este exemplo, usar um CRC fixo)
    const crc = 'E4C2';
    
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
