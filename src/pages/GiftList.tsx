
import React from 'react';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Navbar } from '@/components/Layout/Navbar';
import { SelectedEventBanner } from '@/components/Layout/SelectedEventBanner';
import { GiftListManager } from '@/components/GiftList/GiftListManager';
import { useEventContext } from '@/contexts/EventContext';
import { Card, CardContent } from '@/components/ui/card';
import { Gift } from 'lucide-react';

export default function GiftList() {
  const { selectedEvent } = useEventContext();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <SelectedEventBanner />
            
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Gift className="h-8 w-8 text-leju-pink" />
                Lista de Presentes
              </h1>
              <p className="text-gray-600 mt-2">
                Gerencie a lista de presentes para seus convidados
              </p>
            </div>

            {!selectedEvent ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Gift className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Selecione um evento
                  </h3>
                  <p className="text-gray-600">
                    Selecione um evento para gerenciar sua lista de presentes
                  </p>
                </CardContent>
              </Card>
            ) : (
              <GiftListManager />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
