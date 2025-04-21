
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GuestList from "./pages/GuestList";
import Events from "./pages/Events";
import Tasks from "./pages/Tasks";
import Checklist from "./pages/Checklist";
import Vendors from "./pages/Vendors";
import Invitations from "./pages/Invitations";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/events" element={<Events />} />
        <Route path="/guest-list" element={<GuestList />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/invitations" element={<Invitations />} />
        <Route path="/help" element={<Help />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
