
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Calendar, CheckSquare, ListChecks, Users, Send, Briefcase, LayoutDashboard, Bot, ExternalLink } from 'lucide-react';

// Current version - matches the one in Sidebar.tsx
const APP_VERSION = "1.0.1";

// System functionalities
const systemFeatures = [
  { 
    name: 'Gestão de Eventos', 
    description: 'Cadastre e gerencie todos seus eventos em um só lugar',
    icon: Calendar 
  },
  { 
    name: 'Convidados', 
    description: 'Gerencie sua lista de convidados com facilidade',
    icon: Users 
  },
  { 
    name: 'Tarefas', 
    description: 'Organize as tarefas necessárias para seu evento',
    icon: CheckSquare 
  },
  { 
    name: 'Checklist', 
    description: 'Acompanhe os check-ins dos convidados no dia do evento',
    icon: ListChecks 
  },
  { 
    name: 'Fornecedores', 
    description: 'Cadastre e acompanhe todos os fornecedores',
    icon: Briefcase 
  },
  { 
    name: 'Convites', 
    description: 'Envie convites digitais para seus convidados',
    icon: Send 
  },
  { 
    name: 'Assistente IA', 
    description: 'Tire dúvidas com nossa assistente virtual Mel',
    icon: Bot 
  }
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect to events page
    if (user) {
      navigate('/events');
    }
  }, [user, navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    if (password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password);
      setActiveTab('login');
    } catch (error) {
      console.error('SignUp error:', error);
      // Error is already handled in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row" 
         style={{ 
           background: "linear-gradient(135deg, #ffffff 0%, #ffd1dc 100%)",
           backgroundSize: "cover", 
           backgroundPosition: "center" 
         }}>
      <div className="w-full p-4 md:w-1/2 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="https://i.ibb.co/G40sCgqs/images.jpg" 
              alt="Vix Assistente" 
              className="h-16 w-auto mx-auto"
            />
            <h1 className="text-3xl font-bold mt-4 text-leju-pink">Vix Assistente</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus eventos e cerimônias de forma simples e eficiente
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Versão {APP_VERSION}
            </p>
          </div>
          
          <Card className="backdrop-blur-sm bg-white/90 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Bem-vindo de volta</CardTitle>
              <CardDescription className="text-center">
                Entre com sua conta para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Cadastro</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Senha</Label>
                        <Button variant="link" type="button" className="px-0 h-auto text-xs font-normal">
                          Esqueceu a senha?
                        </Button>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="******"
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
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input 
                        id="register-password" 
                        type="password" 
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Mínimo de 6 caracteres
                      </p>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-leju-pink hover:bg-leju-pink/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Criando conta..." : "Criar conta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col">
              <p className="text-xs text-muted-foreground text-center">
                Ao continuar, você concorda com os Termos de Serviço e Política de Privacidade
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="w-full p-4 md:w-1/2 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-leju-pink">Funcionalidades</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {systemFeatures.map((feature, index) => (
                <div key={index} className="flex items-start p-3 bg-white/60 rounded-md">
                  <feature.icon className="h-5 w-5 mr-2 text-leju-pink flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-3 text-leju-pink">Contato e Assinatura</h2>
              <div className="flex flex-col space-y-2">
                <a href="mailto:contato@ramelseg.com.br" className="flex items-center text-sm hover:text-leju-pink">
                  <Send className="h-4 w-4 mr-2" />
                  contato@ramelseg.com.br
                </a>
                <a href="https://ramelseg.com.br" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm hover:text-leju-pink">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  ramelseg.com.br
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
