
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Event } from '@/types/event';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Download, Printer } from 'lucide-react';

interface EventContractProps {
  event: Event;
}

export const EventContract = ({ event }: EventContractProps) => {
  const today = new Date();
  const formattedToday = format(today, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedEventDate = format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.getElementById('contract-content');
    if (!element) return;
    
    // Esta é uma implementação simples. Em um ambiente de produção,
    // você pode querer usar uma biblioteca como jsPDF ou html2canvas para uma conversão melhor
    const contractText = element.innerText;
    const blob = new Blob([contractText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `contrato-${event.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-leju-pink" />
              Contrato de Serviço
            </CardTitle>
            <CardDescription>
              Evento: {event.title}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" /> Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" /> Baixar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          id="contract-content" 
          className="prose max-w-none p-6 border rounded-md"
        >
          <h2 className="text-center font-bold">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE ASSESSORIA DE EVENTOS</h2>
          
          <p className="text-sm">
            Por este instrumento particular, de um lado:
          </p>
          
          <p className="font-medium my-4">
            <strong>CONTRATADA:</strong> Intelligent Assistance, empresa de prestação de serviços de assessoria e organização de eventos.
          </p>
          
          <p className="font-medium my-4">
            <strong>CONTRATANTE:</strong> {event.contractorName || "[Nome não informado]"}, 
            portador(a) do CPF nº {event.contractorCPF || "[CPF não informado]"}.
          </p>
          
          <p className="text-sm mt-6">
            As partes acima identificadas têm, entre si, justo e acertado o presente 
            Contrato de Prestação de Serviços de Assessoria de Eventos, que se regerá 
            pelas cláusulas seguintes e pelas condições descritas no presente.
          </p>
          
          <h3 className="font-bold mt-6">CLÁUSULA PRIMEIRA - DO OBJETO</h3>
          <p className="text-sm">
            O presente contrato tem como objeto a prestação de serviços de assessoria para 
            o evento do tipo "{event.type}", denominado "{event.title}", 
            a ser realizado no dia {formattedEventDate}, no seguinte local: {event.location}.
          </p>
          
          <h3 className="font-bold mt-4">CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES DA CONTRATADA</h3>
          <p className="text-sm">
            A CONTRATADA se obriga a prestar os serviços de assessoria do evento, 
            incluindo planejamento, coordenação e acompanhamento do evento.
          </p>
          
          <h3 className="font-bold mt-4">CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DO CONTRATANTE</h3>
          <p className="text-sm">
            O CONTRATANTE se obriga a fornecer todas as informações necessárias para 
            o planejamento e execução do evento, bem como a realizar os pagamentos conforme 
            estabelecido neste contrato.
          </p>
          
          <h3 className="font-bold mt-4">CLÁUSULA QUARTA - DO VALOR E FORMA DE PAGAMENTO</h3>
          <p className="text-sm">
            Pelos serviços prestados, o CONTRATANTE pagará à CONTRATADA o valor acordado 
            entre as partes, conforme proposta apresentada e aceita.
          </p>
          
          {event.description && (
            <>
              <h3 className="font-bold mt-4">OBSERVAÇÕES ADICIONAIS</h3>
              <p className="text-sm">
                {event.description}
              </p>
            </>
          )}
          
          <div className="mt-8 text-sm">
            <p>
              E, por estarem assim justos e contratados, firmam o presente instrumento, 
              em duas vias de igual teor.
            </p>
            
            <p className="mt-6 text-center">
              Local e data: ________________, {formattedToday}
            </p>
            
            <div className="mt-10 flex justify-between">
              <div className="text-center">
                <div className="border-t border-black pt-2 w-48">
                  CONTRATANTE
                </div>
                <p className="text-xs">{event.contractorName || "Nome do Contratante"}</p>
              </div>
              
              <div className="text-center">
                <div className="border-t border-black pt-2 w-48">
                  CONTRATADA
                </div>
                <p className="text-xs">Intelligent Assistance</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 text-xs text-muted-foreground">
        Este é um modelo de contrato. Recomendamos a revisão por um advogado antes da assinatura.
      </CardFooter>
    </Card>
  );
};
