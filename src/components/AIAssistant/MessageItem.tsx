
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface MessageItemProps {
  role: 'user' | 'ai';
  content: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({ role, content }) => {
  return (
    <div
      className={`flex ${
        role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[80%] sm:max-w-[70%] rounded-lg p-3 ${
          role === 'user'
            ? 'bg-leju-pink text-white rounded-tr-none'
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          {role === 'user' ? (
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
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};
