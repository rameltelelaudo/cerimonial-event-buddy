
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FinanceSummaryCardsProps {
  totalReceitas: number;
  totalDespesas: number;
  saldoTotal: number;
}

export const FinanceSummaryCards: React.FC<FinanceSummaryCardsProps> = ({
  totalReceitas,
  totalDespesas,
  saldoTotal
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total de Receitas</CardTitle>
          <CardDescription>Valor total das receitas do evento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            R$ {totalReceitas.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Total de Despesas</CardTitle>
          <CardDescription>Valor total das despesas do evento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            R$ {totalDespesas.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Saldo Total</CardTitle>
          <CardDescription>Saldo atual do evento (Receitas - Despesas)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${saldoTotal >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            R$ {saldoTotal.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
