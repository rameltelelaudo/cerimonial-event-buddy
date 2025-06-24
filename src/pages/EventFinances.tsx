
import React, { useState, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEventContext } from '@/contexts/EventContext';
import { Finance } from '@/types/finance';
import { useFinances } from '@/hooks/useFinances';
import { Button } from '@/components/ui/button';

import { FinanceHeader } from '@/components/Finances/FinanceHeader';
import { FinanceList } from '@/components/Finances/FinanceList';
import { FinanceModals } from '@/components/Finances/FinanceModals';

const EventFinances = () => {
  const isMobile = useIsMobile();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, loading } = useEventContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFinance, setSelectedFinance] = useState<Finance | null>(null);

  // Encontrar o evento pelo ID da URL
  const selectedEvent = events.find(event => event.id === eventId);

  const {
    finances,
    isLoading,
    newFinance,
    setNewFinance,
    totalReceitas,
    totalDespesas,
    saldoTotal,
    handleInputChange,
    handleSelectChange,
    handleAddFinance,
    handleUpdateFinance,
    handleDeleteFinance
  } = useFinances(eventId);

  const handleEditFinance = (finance: Finance) => {
    setSelectedFinance(finance);
    setNewFinance({
      description: finance.description,
      amount: finance.amount,
      category: finance.category,
      type: finance.type,
      status: finance.status,
      date: new Date(finance.date).toISOString().split('T')[0]
    });
    setIsEditModalOpen(true);
  };

  // Ajuste do tipo para incluir HTMLSelectElement na tipagem
  const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleInputChange(e as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
  };

  const onSelectChange = (name: string, value: string) => {
    handleSelectChange(name, value);
  };

  const handleAddFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleAddFinance();
    if (success) {
      setIsAddModalOpen(false);
    }
  };

  const handleUpdateFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFinance) return;

    const success = await handleUpdateFinance(selectedFinance.id);
    if (success) {
      setIsEditModalOpen(false);
      setSelectedFinance(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          {!isMobile && <Sidebar />}
          <main className="flex-1 p-6">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-leju-pink" />
              <span className="ml-2">Carregando...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1">
          {!isMobile && <Sidebar />}
          <main className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Evento não encontrado</h2>
              <p className="text-muted-foreground mb-4">
                O evento que você está procurando não existe ou foi removido.
              </p>
              <Button onClick={() => navigate('/events')}>
                Voltar para Eventos
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        <main className="flex-1 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/events')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{selectedEvent.title}</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie as finanças do seu evento
              </p>
            </div>
          </div>
          
          {/* Header com botão add */}
          <FinanceHeader title="Detalhes Financeiros" onAddClick={() => setIsAddModalOpen(true)} />
          
          {/* Lista com edit e delete */}
          <FinanceList
            finances={finances}
            isLoading={isLoading}
            onEdit={handleEditFinance}
            onDelete={handleDeleteFinance}
            onAddNew={() => setIsAddModalOpen(true)}
          />
          
          {/* Modais add/edit */}
          <FinanceModals
            isAddModalOpen={isAddModalOpen}
            setIsAddModalOpen={setIsAddModalOpen}
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
            selectedFinance={selectedFinance}
            newFinance={newFinance}
            onInputChange={onInputChange}
            onSelectChange={onSelectChange}
            onAddSubmit={handleAddFormSubmit}
            onUpdateSubmit={handleUpdateFormSubmit}
            onCancel={() => {
              setIsAddModalOpen(false);
              setIsEditModalOpen(false);
              setSelectedFinance(null);
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default EventFinances;
