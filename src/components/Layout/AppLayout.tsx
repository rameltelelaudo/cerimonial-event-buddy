
import React from 'react';
import { AuthButton } from './AuthButton';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full">
      <header className="flex h-16 items-center justify-between border-b px-6 bg-white">
        <h1 className="text-xl font-semibold">Leju Assessoria</h1>
        <AuthButton />
      </header>
      <main className="bg-gray-50">
        {children}
      </main>
    </div>
  );
};
