
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Verificação de credenciais específicas
    setTimeout(() => {
      if (email === 'admin@admin.com' && password === 'leju') {
        toast.success('Login realizado com sucesso');
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/');
      } else {
        toast.error('Credenciais inválidas. Use admin@admin.com e senha leju');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-leju-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="https://i.ibb.co/212y56K/images.jpg" alt="Leju Assessoria" className="h-24 object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-leju-pink mb-2">Leju Assessoria</h1>
          <p className="text-gray-500">Sistema de Gerenciamento de Eventos</p>
        </div>
        
        <Card className="shadow-lg border-leju-pink/20">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@admin.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-leju-pink hover:bg-leju-pink/90"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            Desenvolvido por Ramel Tecnologia
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <a href="https://lejuassessoria.com.br" target="_blank" rel="noopener noreferrer" className="hover:underline">
            lejuassessoria.com.br
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
