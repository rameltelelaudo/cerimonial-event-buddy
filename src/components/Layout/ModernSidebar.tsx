
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Users, 
  CheckSquare, 
  Building, 
  Mail, 
  ClipboardList,
  Bot,
  HelpCircle,
  Gift,
  Home
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, color: 'text-blue-500' },
  { name: 'Eventos', href: '/events', icon: Calendar, color: 'text-green-500' },
  { name: 'Lista de Convidados', href: '/guests', icon: Users, color: 'text-purple-500' },
  { name: 'Lista de Presentes', href: '/gift-list', icon: Gift, color: 'text-pink-500' },
  { name: 'Tarefas', href: '/tasks', icon: CheckSquare, color: 'text-orange-500' },
  { name: 'Fornecedores', href: '/vendors', icon: Building, color: 'text-cyan-500' },
  { name: 'Convites', href: '/invitations', icon: Mail, color: 'text-yellow-500' },
  { name: 'Check-in', href: '/checklist', icon: ClipboardList, color: 'text-red-500' },
  { name: 'Assistente IA', href: '/ai-assistant', icon: Bot, color: 'text-indigo-500' },
  { name: 'Ajuda', href: '/help', icon: HelpCircle, color: 'text-gray-500' },
];

export const ModernSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-3">
          <img
            className="h-8 w-8 flex-shrink-0"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_F75OuXg9QmG4tftgIEl6UFyJiIFPNGpXaQ&s"
            alt="Leju Assessoria"
          />
          <span className="text-lg font-bold text-leju-pink">
            Leju Assessoria
          </span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 mb-3">Menu Principal</p>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0',
                    item.color
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
