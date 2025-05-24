
import React, { useRef, useEffect } from 'react';
import { MessageItem } from './MessageItem';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessagesList: React.FC<MessagesListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-[60vh] overflow-y-auto mb-4 space-y-4 p-2">
      {messages.map((message, index) => (
        <MessageItem key={index} role={message.role} content={message.content} />
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
  );
};
