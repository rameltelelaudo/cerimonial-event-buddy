
import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Users, 
  CheckSquare, 
  Building, 
  Mail, 
  DollarSign, 
  FileText, 
  ClipboardList,
  Bot,
  HelpCircle,
  Gift,
  Home
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Eventos', href: '/events', icon: Calendar },
  { name: 'Lista de Convidados', href: '/guests', icon: Users },
  { name: 'Lista de Presentes', href: '/gift-list', icon: Gift },
  { name: 'Tarefas', href: '/tasks', icon: CheckSquare },
  { name: 'Fornecedores', href: '/vendors', icon: Building },
  { name: 'Convites', href: '/invitations', icon: Mail },
  { name: 'Check-in', href: '/checklist', icon: ClipboardList },
  { name: 'Assistente IA', href: '/ai-assistant', icon: Bot },
  { name: 'Ajuda', href: '/help', icon: HelpCircle },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-4">
          <Link to="/" className="flex items-center">
            <img
              className="h-8 w-auto"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_F75OuXg9QmG4tftgIEl6UFyJiIFPNGpXaQ&s"
              alt="Leju Assessoria"
            />
            <span className="ml-2 text-xl font-bold text-leju-pink">
              Leju Assessoria
            </span>
          </Link>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      isActive
                        ? 'bg-leju-pink text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                    )
                  }
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
