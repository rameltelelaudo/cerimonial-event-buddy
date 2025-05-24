
import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Bot, SendIcon, User } from 'lucide-react';
import { toast } from 'sonner';
import { useEventContext } from '@/contexts/EventContext';

const AIAssistant = () => {
  const isMobile = useIsMobile();
  const { events } = useEventContext();
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { 
      role: 'ai',
      content: 'Olá! 👋 Sou Mel, sua assistente virtual especialista em eventos. Como posso ajudar você hoje? Pode me perguntar sobre organização de eventos, etiqueta, casamentos, orçamentos e mais!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getEventsContext = () => {
    if (!events || events.length === 0) return "";
    
    // Extract basic information about upcoming events
    const eventsInfo = events.slice(0, 3).map(event => {
      return `- Evento: ${event.title}, Data: ${new Date(event.date).toLocaleDateString('pt-BR')}, Local: ${event.location || "Não especificado"}`;
    }).join('\n');
    
    return `
Informações sobre os próximos eventos no sistema:
${eventsInfo}
    `;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Using Google Gemini API instead of Groq
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDivMmnk9vwG08V_qQArvX6d_x46oJZrh0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Você é Mel, uma assistente virtual especialista em eventos, especialmente casamentos no Brasil. 

Você deve usar exemplos e contextos brasileiros nas suas respostas quando possível, mencionando locais, tradições e práticas comuns no Brasil.

Você pode usar emojis ocasionalmente para tornar suas respostas mais amigáveis e envolventes, mas sem exageros.

Você pode ajudar as pessoas com dicas sobre organização de eventos, etiquetas em casamentos, orçamentos de eventos, ordem de cerimônias, contratação de fornecedores, e estratégias de precificação para assessoria de eventos.

${getEventsContext()}

Você conhece o sistema Vix Assistente, mas só deve mencioná-lo quando for relevante para a pergunta ou quando o usuário perguntar especificamente. Quando for relevante, você pode orientar sobre como usar suas funcionalidades:

1. Dashboard - Visualização geral de todos os eventos e tarefas pendentes
2. Eventos - Cadastro e gerenciamento completo de eventos, com detalhes, datas, locais
3. Lista de Convidados - Gerenciamento de convidados com status de confirmação, mesa, e contatos
4. Tarefas - Criação e acompanhamento de tarefas para organização do evento
5. Checklist - Controle de check-in dos convidados no dia do evento
6. Fornecedores - Cadastro e gestão de fornecedores para o evento
7. Convites - Envio de convites digitais para os convidados
8. Financeiro - Controle de receitas e despesas do evento, com relatórios e balanços
9. Contratos - Geração e edição de contratos personalizados para os clientes

Responda a seguinte mensagem em português do Brasil de forma profissional mas amigável: ${userMessage}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na comunicação com o assistente');
      }

      const data = await response.json();
      let aiResponse = "";
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        aiResponse = data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Formato de resposta inválido');
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      toast.error('Não foi possível obter resposta do assistente. Tente novamente mais tarde.');
      setMessages(prev => [...prev, { role: 'ai', content: 'Desculpe, tive um problema ao processar sua pergunta. Poderia tentar novamente?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">I.A - Assistente Virtual para Eventos</h1>
          
          <Card className="border-leju-pink/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="text-leju-pink h-6 w-6" />
                <div className="flex items-center gap-2">
                  <span>Mel</span>
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/lovable-uploads/c9f269ab-f770-4b9a-8dff-9ff8def43236.png" alt="Mel" />
                    <AvatarFallback>MB</AvatarFallback>
                  </Avatar>
                </div>
              </CardTitle>
              <CardDescription>
                Tirando dúvidas sobre organização, etiqueta, orçamentos e tudo sobre eventos
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="h-[60vh] overflow-y-auto mb-4 space-y-4 p-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-leju-pink text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-800 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.role === 'user' ? (
                          <>
                            <span className="font-medium">Você</span>
                            <User className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-1">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src="/lovable-uploads/c9f269ab-f770-4b9a-8dff-9ff8def43236.png" alt="Mel" />
                                <AvatarFallback>M</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">Mel</span>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] sm:max-w-[70%] bg-gray-100 rounded-lg p-4 rounded-tl-none animate-pulse">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src="/lovable-uploads/c9f269ab-f770-4b9a-8dff-9ff8def43236.png" alt="Mel" />
                          <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">Mel</span>
                      </div>
                      <p>Pensando...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            
            <CardFooter>
              <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua pergunta sobre eventos..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading} className="bg-leju-pink hover:bg-leju-pink/90">
                  <SendIcon className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Enviar</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AIAssistant;
