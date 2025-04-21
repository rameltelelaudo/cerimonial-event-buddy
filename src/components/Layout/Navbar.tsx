
import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

export const Navbar = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-ceremonial-purple">
              EventBuddy
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
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/">Ajuda</Link>
            </Button>
            <Button asChild>
              <Link to="/guest-list">Lista de Convidados</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
