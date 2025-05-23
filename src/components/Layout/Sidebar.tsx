
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, CheckSquare, ListChecks, Users, Send, 
  Briefcase, LayoutDashboard, HelpCircle, Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Current version - can be updated programmatically
const APP_VERSION = "1.0.0";

const menuItems = [
  { 
    name: 'Dashboard', 
    path: '/', 
    icon: LayoutDashboard,
    color: "text-indigo-500"
  },
  { 
    name: 'Eventos', 
    path: '/events', 
    icon: Calendar,
    color: "text-pink-500" 
  },
  { 
    name: 'Lista de Convidados', 
    path: '/guest-list', 
    icon: Users,
    color: "text-teal-500" 
  },
  { 
    name: 'Tarefas', 
    path: '/tasks', 
    icon: CheckSquare,
    color: "text-amber-500" 
  },
  { 
    name: 'Checklist', 
    path: '/checklist', 
    icon: ListChecks,
    color: "text-green-500" 
  },
  { 
    name: 'Fornecedores', 
    path: '/vendors', 
    icon: Briefcase,
    color: "text-purple-500" 
  },
  { 
    name: 'Convites', 
    path: '/invitations', 
    icon: Send,
    color: "text-sky-500" 
  },
  { 
    name: 'I.A - Assistente', 
    path: '/ai-assistant', 
    icon: Bot,
    color: "text-cyan-500" 
  },
  { 
    name: 'Ajuda', 
    path: '/help', 
    icon: HelpCircle,
    color: "text-rose-500" 
  }
];

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <aside className="flex flex-col h-full w-64 bg-sidebar p-4 border-r bg-white/80 backdrop-blur-sm">
      <div className="mb-6 mt-2 flex items-center">
        <img 
          src="https://i.ibb.co/G40sCgqs/images.jpg" 
          alt="Vix Assistente" 
          className="h-8 w-auto mr-2"
        />
        <div>
          <h2 className="text-xl font-bold text-leju-pink">Vix Assistente</h2>
          <p className="text-sm text-muted-foreground">Gestão de Eventos</p>
        </div>
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
              <item.icon className={cn("h-5 w-5 mr-3", isActive ? "text-leju-pink" : item.color)} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto border-t">
        <p className="text-xs text-muted-foreground">
          Vix Assistente v{APP_VERSION}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          por <a href="https://ramelseg.com.br" target="_blank" rel="noopener noreferrer" className="text-leju-pink hover:underline">Ramel Tecnologia</a>
        </p>
      </div>
    </aside>
  );
};
