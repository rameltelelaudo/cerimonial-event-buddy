
import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu, HelpCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

export const Navbar = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-leju-pink">
              Leju App
            </h1>
          </Link>
        </div>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
        ) : (
          <TooltipProvider>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/help">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Ajuda
                </Link>
              </Button>
              <Button asChild>
                <Link to="/guest-list">Lista de Convidados</Link>
              </Button>
            </div>
          </TooltipProvider>
        )}
      </div>
    </header>
  );
};
