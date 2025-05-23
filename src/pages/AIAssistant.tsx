
import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Bot, SendIcon, User } from 'lucide-react';
import { toast } from 'sonner';

const AIAssistant = () => {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { 
      role: 'ai',
      content: 'Olá! Sou a assistente virtual especialista em eventos. Como posso ajudar você hoje? Pode me perguntar sobre organização de eventos, etiqueta, casamentos, orçamentos e mais!'
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'Você é uma assistente virtual especialista em eventos, especialmente casamentos. Você deve ajudar as pessoas com dicas sobre organização de eventos, etiquetas em casamentos, orçamentos de eventos, ordem de cerimônias, contratação de fornecedores, e estratégias de precificação para assessoria de eventos. Responda em português do Brasil de forma profissional mas amigável.'
            },
            ...messages.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na comunicação com o assistente');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

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
                Assistente de Eventos
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
                            <Bot className="h-4 w-4" />
                            <span className="font-medium">Assistente</span>
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
                        <Bot className="h-4 w-4" />
                        <span className="font-medium">Assistente</span>
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
