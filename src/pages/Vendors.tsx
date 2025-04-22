
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Briefcase, PlusCircle, Phone, Mail, Tag, X, Check, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddVendorForm } from '@/components/Vendors/AddVendorForm';
import { Vendor } from '@/types/vendor';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Vendors = () => {
  const isMobile = useIsMobile();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Carregar fornecedores do Supabase
  useEffect(() => {
    const fetchVendors = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('leju_vendors')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          const transformedVendors: Vendor[] = data.map(vendor => ({
            id: vendor.id,
            name: vendor.name,
            category: vendor.category,
            contactName: vendor.contact_name,
            phone: vendor.phone,
            email: vendor.email || '',
            status: vendor.status as 'confirmado' | 'pendente' | 'cancelado',
            notes: vendor.notes || ''
          }));
          
          setVendors(transformedVendors);
        }
      } catch (error: any) {
        console.error('Erro ao carregar fornecedores:', error);
        toast.error(`Erro ao carregar fornecedores: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendors();
  }, [user]);
  
  const handleAddVendor = (vendor: Vendor) => {
    setVendors(prevVendors => [...prevVendors, vendor]);
    setIsAddModalOpen(false);
  };
  
  const getStatusBadge = (status: Vendor['status']) => {
    switch (status) {
      case 'confirmado':
        return <Badge className="bg-green-500"><Check className="mr-1 h-3 w-3" /> Confirmado</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-500"><X className="mr-1 h-3 w-3" /> Cancelado</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pendente</Badge>;
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col"
         style={{ backgroundImage: "url('https://i.ibb.co/4gcB6kL/wedding-background.jpg')", 
                  backgroundSize: "cover", 
                  backgroundPosition: "center",
                  backgroundAttachment: "fixed" }}>
      <Navbar />
      
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 p-6 backdrop-blur-sm bg-white/60">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Fornecedores</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie os fornecedores do seu evento
              </p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-leju-pink hover:bg-leju-pink/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Fornecedor
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-leju-pink" />
              <span className="ml-2">Carregando fornecedores...</span>
            </div>
          ) : vendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {vendors.map((vendor) => (
                <Card key={vendor.id} className="overflow-hidden hover:shadow-md transition-shadow glass">
                  <div className="absolute top-0 left-0 w-1 h-full bg-leju-pink" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-medium">{vendor.name}</CardTitle>
                      {getStatusBadge(vendor.status)}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Tag className="h-3 w-3 mr-1" />
                      {vendor.category}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {vendor.contactName && (
                      <p className="text-sm mb-1">Contato: {vendor.contactName}</p>
                    )}
                    <p className="text-sm flex items-center mb-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {vendor.phone}
                    </p>
                    {vendor.email && (
                      <p className="text-sm flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {vendor.email}
                      </p>
                    )}
                    {vendor.notes && (
                      <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                        {vendor.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-6 bg-white/80 fade-in mt-4">
              <div className="text-center py-8">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-4">Nenhum fornecedor cadastrado</h2>
                <p className="text-muted-foreground mb-6">
                  Você ainda não possui fornecedores cadastrados. Clique no botão abaixo para adicionar seu primeiro fornecedor.
                </p>
                <Button onClick={() => setIsAddModalOpen(true)} className="bg-leju-pink hover:bg-leju-pink/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Fornecedor
                </Button>
              </div>
            </div>
          )}
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Adicionar Fornecedor</DialogTitle>
              </DialogHeader>
              <AddVendorForm 
                onAddVendor={handleAddVendor} 
                onCancel={() => setIsAddModalOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Vendors;
