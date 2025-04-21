
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { HelpCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const FaqItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-md mb-2">
      <CollapsibleTrigger className="w-full text-left p-4 flex justify-between items-center focus:outline-none">
        <span className="font-medium">{question}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 pt-0">
        <div className="text-muted-foreground">{answer}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const Help = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Ajuda</h1>
            <p className="text-muted-foreground mt-1">
              Encontre respostas para suas dúvidas
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Suporte</CardTitle>
                <CardDescription>Entre em contato com nosso suporte</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Precisa de ajuda? Entre em contato conosco pelo e-mail abaixo:
                </p>
                <a href="mailto:suporte@ramelseg.com.br" className="text-leju-pink hover:underline flex items-center">
                  suporte@ramelseg.com.br
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tutoriais</CardTitle>
                <CardDescription>Aprenda a usar o sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Acesse nossos tutoriais para aprender a usar todas as funcionalidades do sistema:
                </p>
                <a href="https://ramelseg.com.br/tutoriais" target="_blank" rel="noopener noreferrer" className="text-leju-pink hover:underline flex items-center">
                  Ver tutoriais
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sobre</CardTitle>
                <CardDescription>Informações sobre o Leju App</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  O Leju App é um sistema completo para cerimonialistas desenvolvido pela Ramel Tecnologia.
                </p>
                <a href="https://ramelseg.com.br" target="_blank" rel="noopener noreferrer" className="text-leju-pink hover:underline flex items-center">
                  Ramel Tecnologia
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            <FaqItem 
              question="Como adicionar um novo evento?" 
              answer="Acesse a página de Eventos através do menu lateral e clique no botão 'Adicionar Evento'. Preencha todas as informações necessárias e salve." 
            />
            <FaqItem 
              question="Como fazer o check-in de convidados?" 
              answer="No dia do evento, acesse a página de Checklist através do menu lateral. Use a barra de busca para encontrar o convidado e clique no botão 'Check-in'." 
            />
            <FaqItem 
              question="Como adicionar um novo convidado?" 
              answer="Acesse a página de Lista de Convidados através do menu lateral e clique no botão 'Adicionar Convidado'. Preencha todas as informações necessárias e salve." 
            />
            <FaqItem 
              question="Como exportar a lista de convidados?" 
              answer="Na página de Lista de Convidados, clique no botão de exportação no canto superior direito da tabela. Você pode escolher exportar para PDF ou Excel." 
            />
            <FaqItem 
              question="Como alterar as informações do meu perfil?" 
              answer="Acesse seu perfil clicando no ícone de usuário no canto superior direito da tela e selecione 'Configurações'. Lá você poderá alterar suas informações pessoais." 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;
