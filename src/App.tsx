
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import GuestList from "./pages/GuestList";
import Events from "./pages/Events";
import Tasks from "./pages/Tasks";
import Checklist from "./pages/Checklist";
import Vendors from "./pages/Vendors";
import Invitations from "./pages/Invitations";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import PublicGuestForm from "./pages/PublicGuestForm";
import EventFinances from "./pages/EventFinances";
import { EventProvider } from "./contexts/EventContext";

const queryClient = new QueryClient();

// Componente de proteção de rota
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Simular carregamento inicial para verificar autenticação
    setTimeout(() => {
      setIsCheckingAuth(false);
    }, 500);
  }, []);
  
  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <EventProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/public-guest-form/:eventId" element={<PublicGuestForm />} />
            
            {/* Rotas protegidas */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/guest-list" element={<ProtectedRoute><GuestList /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="/checklist" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
            <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
            <Route path="/invitations" element={<ProtectedRoute><Invitations /></ProtectedRoute>} />
            <Route path="/finances/:eventId" element={<ProtectedRoute><EventFinances /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
            
            {/* Rota de fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EventProvider>
    </QueryClientProvider>
  );
};

export default App;
