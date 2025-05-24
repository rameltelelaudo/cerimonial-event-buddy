
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon } from 'lucide-react';

interface MessageInputFormProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const MessageInputForm: React.FC<MessageInputFormProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
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
  );
};
