import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Power } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white border-b shadow-sm h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6 text-leju-pink"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="hidden md:inline-block font-bold text-xl">
            Intelligent Assistance
          </span>
        </Link>
      </div>

      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Olá, {user.email}
          </span>
          <Button variant="outline" size="sm" onClick={logout}>
            <Power className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      ) : (
        <Link to="/login">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
};
