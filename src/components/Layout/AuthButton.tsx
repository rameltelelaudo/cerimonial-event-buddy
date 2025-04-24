
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const AuthButton = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao fazer logout');
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogout}
      className="ml-2"
      data-testid="auth-logout-button"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Sair
    </Button>
  );
};
