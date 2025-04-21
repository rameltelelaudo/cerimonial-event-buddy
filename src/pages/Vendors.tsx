
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Briefcase, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

const Vendors = () => {
  const isMobile = useIsMobile();
  
  const handleAddVendor = () => {
    toast.info("Funcionalidade em desenvolvimento");
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Fornecedores</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie os fornecedores do seu evento
              </p>
            </div>
            <Button onClick={handleAddVendor} className="bg-leju-pink hover:bg-leju-pink/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Fornecedor
            </Button>
          </div>
          
          <div className="border rounded-lg p-6 bg-white fade-in mt-4">
            <div className="text-center py-8">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-4">Nenhum fornecedor cadastrado</h2>
              <p className="text-muted-foreground mb-6">
                Você ainda não possui fornecedores cadastrados. Clique no botão abaixo para adicionar seu primeiro fornecedor.
              </p>
              <Button onClick={handleAddVendor} className="bg-leju-pink hover:bg-leju-pink/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Fornecedor
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Vendors;
