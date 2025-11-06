import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceSearchProps {
  onTranscript: (text: string) => void;
}

export const VoiceSearch = ({ onTranscript }: VoiceSearchProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'pt-BR';

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onTranscript(transcript);
          toast.success(`Buscando por: ${transcript}`);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            toast.error('Permissão de microfone negada');
          } else {
            toast.error('Erro ao reconhecer voz');
          }
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Reconhecimento de voz não disponível neste navegador');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
        toast.info('Fale o nome do convidado');
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast.error('Erro ao iniciar reconhecimento de voz');
      }
    }
  };

  return (
    <Button
      type="button"
      size="lg"
      variant={isListening ? "destructive" : "default"}
      onClick={toggleListening}
      className={`${isListening ? 'animate-pulse' : ''} h-12 w-12 sm:w-auto`}
      title={isListening ? 'Parar de ouvir' : 'Buscar por voz'}
    >
      {isListening ? (
        <>
          <MicOff className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Parar</span>
        </>
      ) : (
        <>
          <Mic className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Buscar por Voz</span>
        </>
      )}
    </Button>
  );
};
