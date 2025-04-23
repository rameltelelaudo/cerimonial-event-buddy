
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react'; // ícone com O maiúsculo correto
import { toast } from 'sonner';

export const AuthButton = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast.success('Logout realizado com sucesso');
    navigate('/login', { replace: true });
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
