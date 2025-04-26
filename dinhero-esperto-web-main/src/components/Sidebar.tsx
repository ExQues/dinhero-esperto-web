
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  DollarSign, 
  BarChart, 
  Calendar, 
  Settings, 
  Archive, 
  Menu, 
  X, 
  Home, 
  PieChart,
  Users
} from 'lucide-react';

type SidebarItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  isPremium?: boolean;
};

const sidebarItems: SidebarItem[] = [
  {
    title: 'Visão Geral',
    path: '/dashboard',
    icon: <Home size={20} />,
  },
  {
    title: 'Transações',
    path: '/transactions',
    icon: <DollarSign size={20} />,
  },
  {
    title: 'Orçamentos',
    path: '/budgets',
    icon: <PieChart size={20} />,
  },
  {
    title: 'Relatórios',
    path: '/reports',
    icon: <BarChart size={20} />,
  },
  {
    title: 'Planejamento',
    path: '/planning',
    icon: <Calendar size={20} />,
  },
  {
    title: 'Contas Compartilhadas',
    path: '/shared',
    icon: <Users size={20} />,
  },
  {
    title: 'Estoque',
    path: '/inventory',
    icon: <Archive size={20} />,
    isPremium: true,
  },
  {
    title: 'Configurações',
    path: '/settings',
    icon: <Settings size={20} />,
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { isPremium } = useAuth();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        'bg-sidebar transition-all duration-300 h-screen fixed left-0 top-0 z-40 border-r border-sidebar-border flex flex-col',
        collapsed ? 'w-[70px]' : 'w-[250px]'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/dashboard" className="font-bold text-sidebar-foreground text-xl">
            DinheroEsperto
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-sidebar-foreground">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <div className="flex flex-col gap-2 p-2 flex-grow overflow-y-auto">
        {sidebarItems.map((item) => {
          // Skip premium features for non-premium users
          if (item.isPremium && !isPremium) return null;
          
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start text-sidebar-foreground hover:text-white hover:bg-sidebar-accent',
                  isActive && 'bg-sidebar-accent text-white',
                  collapsed && 'justify-center'
                )}
              >
                <span>{item.icon}</span>
                {!collapsed && <span className="ml-2">{item.title}</span>}
              </Button>
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && isPremium && (
          <div className="bg-sidebar-accent rounded-md p-2 text-xs text-sidebar-foreground mb-2">
            <span className="font-medium block">Plano Premium Ativo</span>
            <span>Aproveite todos os recursos!</span>
          </div>
        )}
        {!collapsed && !isPremium && (
          <Link to="/pricing">
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-xs">
              Upgrade para Premium
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
