
import { Guest } from '@/types/guest';
import { Task } from '@/types/task';
import { Finance } from '@/types/finance';
import { Event } from '@/types/event';

export const generateContextFromEvents = (events: Event[] | null): string => {
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

export const generateContextFromGuests = (guestData: Guest[] | null): string => {
  if (!guestData || guestData.length === 0) return "";
  
  // Extract guest information
  const guestsInfo = guestData.slice(0, 5).map(guest => {
    return `- Convidado: ${guest.name}, Grupo: ${guest.group}, Acompanhantes: ${guest.companions}, Check-in: ${guest.checkedIn ? 'Sim' : 'Não'}`;
  }).join('\n');
  
  return `
Informações sobre alguns convidados:
${guestsInfo}
  `;
};

export const generateContextFromTasks = (tasksData: Task[] | null): string => {
  if (!tasksData || tasksData.length === 0) return "";
  
  // Extract tasks information
  const tasksInfo = tasksData.slice(0, 5).map(task => {
    return `- Tarefa: ${task.title}, Prioridade: ${task.priority}, Status: ${task.status}, Data: ${task.dueDate.toLocaleDateString('pt-BR')}`;
  }).join('\n');
  
  return `
Informações sobre algumas tarefas:
${tasksInfo}
  `;
};

export const generateContextFromFinances = (financeData: Finance[] | null): string => {
  if (!financeData || financeData.length === 0) return "";
  
  // Extract finance information
  const financesInfo = financeData.slice(0, 5).map(finance => {
    return `- ${finance.type === 'receita' ? 'Receita' : 'Despesa'}: ${finance.description}, Valor: R$ ${finance.amount.toFixed(2)}, Status: ${finance.status}, Data: ${new Date(finance.date).toLocaleDateString('pt-BR')}`;
  }).join('\n');
  
  const totalReceitas = financeData.filter(item => item.type === 'receita').reduce((sum, item) => sum + item.amount, 0);
  const totalDespesas = financeData.filter(item => item.type === 'despesa').reduce((sum, item) => sum + item.amount, 0);
  const saldoTotal = totalReceitas - totalDespesas;
  
  return `
Informações financeiras:
${financesInfo}

Resumo financeiro:
- Total de receitas: R$ ${totalReceitas.toFixed(2)}
- Total de despesas: R$ ${totalDespesas.toFixed(2)}
- Saldo total: R$ ${saldoTotal.toFixed(2)}
  `;
};

export const callAIAssistant = async (
  userMessage: string,
  conversationHistory: string,
  eventsContext: string,
  guestsContext: string,
  tasksContext: string,
  financesContext: string
): Promise<string> => {
  try {
    // Using Google Gemini API
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

${eventsContext}
${guestsContext}
${tasksContext}
${financesContext}

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

Histórico da conversa atual:
${conversationHistory}

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

    return aiResponse;
  } catch (error) {
    console.error('Error calling AI assistant:', error);
    throw error;
  }
};
