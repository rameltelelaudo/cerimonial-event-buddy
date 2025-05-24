
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessagesList } from '@/components/AIAssistant/MessagesList';
import { MessageInputForm } from '@/components/AIAssistant/MessageInputForm';
import { useAIAssistant } from '@/hooks/useAIAssistant';

const AIAssistant = () => {
  const isMobile = useIsMobile();
  const { messages, isLoading, sendMessage } = useAIAssistant();

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
              <MessagesList messages={messages} isLoading={isLoading} />
            </CardContent>
            
            <CardFooter>
              <MessageInputForm onSend={sendMessage} isLoading={isLoading} />
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AIAssistant;
