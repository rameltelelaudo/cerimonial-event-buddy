
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useEventContext } from '@/contexts/EventContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Finance } from '@/types/finance';
import { FinanceSummaryCards } from '@/components/Finances/FinanceSummaryCards';
import { FinanceTable } from '@/components/Finances/FinanceTable';
import { EmptyFinanceState } from '@/components/Finances/EmptyFinanceState';
import { FinanceForm } from '@/components/Finances/FinanceForm';
import { useFinances } from '@/hooks/useFinances';

const EventFinances = () => {
  const isMobile = useIsMobile();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { selectedEvent } = useEventContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFinance, setSelectedFinance] = useState<Finance | null>(null);
  
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
  
  if (!selectedEvent) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
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
          
          <FinanceSummaryCards 
            totalReceitas={totalReceitas}
            totalDespesas={totalDespesas}
            saldoTotal={saldoTotal}
          />
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Detalhes Financeiros
            </h2>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-leju-pink hover:bg-leju-pink/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Item Financeiro</DialogTitle>
                </DialogHeader>
                
                <FinanceForm
                  finance={newFinance}
                  onInputChange={handleInputChange}
                  onSelectChange={handleSelectChange}
                  onSubmit={handleAddFormSubmit}
                  onCancel={() => setIsAddModalOpen(false)}
                  submitButtonText="Adicionar"
                />
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-leju-pink" />
              <span className="ml-2">Carregando dados financeiros...</span>
            </div>
          ) : finances.length > 0 ? (
            <FinanceTable 
              finances={finances}
              onEdit={handleEditFinance}
              onDelete={handleDeleteFinance}
            />
          ) : (
            <EmptyFinanceState onAddNew={() => setIsAddModalOpen(true)} />
          )}
          
          {/* Modal de Edição */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Item Financeiro</DialogTitle>
              </DialogHeader>
              
              <FinanceForm
                finance={newFinance}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
                onSubmit={handleUpdateFormSubmit}
                onCancel={() => setIsEditModalOpen(false)}
                submitButtonText="Atualizar"
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default EventFinances;
