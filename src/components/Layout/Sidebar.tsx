
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, CheckSquare, ListChecks, Users, Send, Briefcase, LayoutDashboard, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { 
    name: 'Dashboard', 
    path: '/', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Eventos', 
    path: '/events', 
    icon: Calendar 
  },
  { 
    name: 'Lista de Convidados', 
    path: '/guest-list', 
    icon: Users 
  },
  { 
    name: 'Tarefas', 
    path: '/tasks', 
    icon: CheckSquare 
  },
  { 
    name: 'Checklist', 
    path: '/checklist', 
    icon: ListChecks 
  },
  { 
    name: 'Fornecedores', 
    path: '/vendors', 
    icon: Briefcase 
  },
  { 
    name: 'Convites', 
    path: '/invitations', 
    icon: Send 
  },
  { 
    name: 'Ajuda', 
    path: '/help', 
    icon: HelpCircle 
  }
];

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <aside className="flex flex-col h-full w-64 bg-sidebar p-4 border-r">
      <div className="mb-6 mt-2">
        <h2 className="text-xl font-bold text-leju-pink">Leju App</h2>
        <p className="text-sm text-muted-foreground">Gestão de Eventos</p>
      </div>
      
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-leju-pink" 
                  : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 mr-3", isActive ? "text-leju-pink" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto border-t">
        <p className="text-xs text-muted-foreground">
          Leju App v1.0.0
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          por <a href="https://ramelseg.com.br" target="_blank" rel="noopener noreferrer" className="text-leju-pink hover:underline">Ramel Tecnologia</a>
        </p>
      </div>
    </aside>
  );
};
