
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { AppLayout } from "@/components/Layout/AppLayout";
import Index from "./pages/Index";
import Events from "./pages/Events";
import GuestList from "./pages/GuestList";
import GiftList from "./pages/GiftList";
import Tasks from "./pages/Tasks";
import Vendors from "./pages/Vendors";
import Invitations from "./pages/Invitations";
import Checklist from "./pages/Checklist";
import AIAssistant from "./pages/AIAssistant";
import Help from "./pages/Help";
import Login from "./pages/Login";
import PublicGuestForm from "./pages/PublicGuestForm";
import PublicGiftList from "./pages/PublicGiftList";
import EventFinances from "./pages/EventFinances";
import EventContract from "./pages/EventContract";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <EventProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/public-guest-form/:eventId" element={<PublicGuestForm />} />
                <Route path="/public-gift-list/:eventId" element={<PublicGiftList />} />
                <Route path="/*" element={
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/guests" element={<GuestList />} />
                      <Route path="/gift-list" element={<GiftList />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/vendors" element={<Vendors />} />
                      <Route path="/invitations" element={<Invitations />} />
                      <Route path="/checklist" element={<Checklist />} />
                      <Route path="/ai-assistant" element={<AIAssistant />} />
                      <Route path="/help" element={<Help />} />
                      <Route path="/event/:eventId/finances" element={<EventFinances />} />
                      <Route path="/event/:eventId/contract" element={<EventContract />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                } />
              </Routes>
            </BrowserRouter>
          </EventProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
