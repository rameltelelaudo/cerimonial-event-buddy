
import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

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
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-1">
          <img
            className="h-8 w-8 flex-shrink-0"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_F75OuXg9QmG4tftgIEl6UFyJiIFPNGpXaQ&s"
            alt="Leju Assessoria"
          />
          {state === "expanded" && (
            <span className="text-lg font-bold text-leju-pink truncate">
              Leju Assessoria
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.href}
                        className="flex items-center gap-3"
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 flex-shrink-0',
                            item.color
                          )}
                        />
                        <span className="truncate">{item.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
