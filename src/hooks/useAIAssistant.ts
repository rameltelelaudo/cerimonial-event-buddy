
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEventContext } from '@/contexts/EventContext';
import { toast } from 'sonner';
import { Guest } from '@/types/guest';
import { Task } from '@/types/task';
import { Finance } from '@/types/finance';
import { 
  callAIAssistant, 
  generateContextFromEvents, 
  generateContextFromGuests, 
  generateContextFromTasks, 
  generateContextFromFinances 
} from '@/components/AIAssistant/aiUtils';

export interface AIMessage {
  role: 'user' | 'ai';
  content: string;
}

export const useAIAssistant = () => {
  const { events, selectedEvent } = useEventContext();
  const { user } = useAuth();
  const [messages, setMessages] = useState<AIMessage[]>([
    { 
      role: 'ai',
      content: 'Olá! 👋 Sou Mel, sua assistente virtual especialista em eventos. Como posso ajudar você hoje? Pode me perguntar sobre organização de eventos, etiqueta, casamentos, orçamentos e mais!'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [guestData, setGuestData] = useState<Guest[]>([]);
  const [tasksData, setTasksData] = useState<Task[]>([]);
  const [financeData, setFinanceData] = useState<Finance[]>([]);
  const [conversationHistory, setConversationHistory] = useState<string>('');

  // Update conversation history when messages change
  useEffect(() => {
    if (messages.length > 1) {
      // Extract the last few messages for context
      const recentMessages = messages.slice(-5);
      const historyText = recentMessages.map(msg => 
        `${msg.role === 'user' ? 'Usuário' : 'Mel'}: ${msg.content}`
      ).join('\n\n');
      
      setConversationHistory(historyText);
    }
  }, [messages]);

  // Fetch additional data for context
  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (!user) return;
      
      try {
        // Fetch guest data
        const { data: guests, error: guestsError } = await supabase
          .from('leju_guests')
          .select('*')
          .eq('user_id', user.id)
          .limit(20);
          
        if (!guestsError && guests) {
          setGuestData(guests.map(g => ({
            id: g.id,
            name: g.name,
            email: g.email || '',
            group: g.group_type as any,
            companions: g.companions,
            notes: g.notes || '',
            checkedIn: g.checked_in,
            checkInTime: g.check_in_time ? new Date(g.check_in_time) : undefined
          })));
        }
        
        // Fetch tasks data
        const { data: tasks, error: tasksError } = await supabase
          .from('leju_tasks')
          .select('*')
          .eq('user_id', user.id)
          .limit(20);
          
        if (!tasksError && tasks) {
          setTasksData(tasks.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description || '',
            dueDate: new Date(t.due_date),
            status: t.status as any,
            priority: t.priority as any,
            eventId: t.event_id,
            assignedTo: t.assigned_to
          })));
        }
        
        // Fetch finance data
        const { data: finances, error: financesError } = await supabase
          .from('leju_finances')
          .select('*')
          .eq('user_id', user.id)
          .limit(20);
          
        if (!financesError && finances) {
          setFinanceData(finances.map(f => ({
            id: f.id,
            description: f.description,
            amount: Number(f.amount),
            category: f.category,
            type: f.type as 'receita' | 'despesa',
            status: f.status as 'pago' | 'pendente' | 'cancelado',
            date: new Date(f.date),
            eventId: f.event_id,
            createdAt: new Date(f.created_at)
          })));
        }
      } catch (error) {
        console.error('Error fetching additional data:', error);
      }
    };
    
    fetchAdditionalData();
  }, [user]);

  const sendMessage = async (userMessage: string) => {
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const eventsContext = generateContextFromEvents(events);
      const guestsContext = generateContextFromGuests(guestData);
      const tasksContext = generateContextFromTasks(tasksData);
      const financesContext = generateContextFromFinances(financeData);

      const aiResponse = await callAIAssistant(
        userMessage,
        conversationHistory,
        eventsContext,
        guestsContext,
        tasksContext,
        financesContext
      );

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Não foi possível obter resposta do assistente. Tente novamente mais tarde.');
      setMessages(prev => [...prev, { role: 'ai', content: 'Desculpe, tive um problema ao processar sua pergunta. Poderia tentar novamente?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
};
