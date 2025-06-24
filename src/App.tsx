
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Events from "./pages/Events";
import GuestList from "./pages/GuestList";
import GiftList from "./pages/GiftList";
import Tasks from "./pages/Tasks";
import Vendors from "./pages/Vendors";
import Invitations from "./pages/Invitations";
import EventFinances from "./pages/EventFinances";
import EventContract from "./pages/EventContract";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PublicGuestForm from "./pages/PublicGuestForm";
import PublicGiftList from "./pages/PublicGiftList";
import Checklist from "./pages/Checklist";
import AIAssistant from "./pages/AIAssistant";
import Help from "./pages/Help";
import { EventProvider } from "./contexts/EventContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <EventProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/guests" element={<GuestList />} />
                  <Route path="/gift-list" element={<GiftList />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/vendors" element={<Vendors />} />
                  <Route path="/invitations" element={<Invitations />} />
                  <Route path="/finances" element={<EventFinances />} />
                  <Route path="/contract" element={<EventContract />} />
                  <Route path="/checklist" element={<Checklist />} />
                  <Route path="/ai-assistant" element={<AIAssistant />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/guest-form/:eventId" element={<PublicGuestForm />} />
                  <Route path="/gift-list/:listId" element={<PublicGiftList />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </EventProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
