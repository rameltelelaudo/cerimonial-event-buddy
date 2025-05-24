
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon } from 'lucide-react';

interface MessageInputFormProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const MessageInputForm: React.FC<MessageInputFormProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSend(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <Input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite sua pergunta sobre eventos..."
        disabled={isLoading}
        className="flex-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() && !isLoading) {
              handleSubmit(e);
            }
          }
        }}
      />
      <Button 
        type="submit" 
        disabled={isLoading || !input.trim()} 
        className="bg-leju-pink hover:bg-leju-pink/90 transition-colors"
      >
        <SendIcon className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Enviar</span>
      </Button>
    </form>
  );
};
