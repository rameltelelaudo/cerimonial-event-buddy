
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { AuthButton } from './AuthButton';
import { useIsMobile } from '@/hooks/use-mobile';

export const Navbar = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" className="mr-4 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 pt-10">
            <Sidebar />
          </SheetContent>
        </Sheet>
        
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="https://i.ibb.co/G40sCgqs/images.jpg" 
            alt="Leju App" 
            className="h-8 w-auto rounded-md"
          />
          <span className="hidden font-bold sm:inline-block">
            Leju App
          </span>
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          <AuthButton />
        </div>
      </div>
    </header>
  );
};
