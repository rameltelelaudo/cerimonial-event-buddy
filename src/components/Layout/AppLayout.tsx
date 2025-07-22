
import React from 'react';
import { ModernSidebar } from './ModernSidebar';
import { AuthButton } from './AuthButton';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full">
      <ModernSidebar />
      <div className="flex flex-col flex-1">
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-white">
          <h1 className="text-xl font-semibold">Leju Assessoria</h1>
          <AuthButton />
        </header>
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};
