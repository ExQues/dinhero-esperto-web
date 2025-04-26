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
  Users,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type SidebarItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  isPremium?: boolean;
  implemented?: boolean;
};

const sidebarItems: SidebarItem[] = [
  {
    title: 'Visão Geral',
    path: '/dashboard',
    icon: <Home size={20} />,
    implemented: true
  },
  {
    title: 'Transações',
    path: '/transactions',
    icon: <DollarSign size={20} />,
    implemented: true
  },
  {
    title: 'Orçamentos',
    path: '/dashboard',
    icon: <PieChart size={20} />,
    implemented: false
  },
  {
    title: 'Relatórios',
    path: '/dashboard',
    icon: <BarChart size={20} />,
    implemented: false
  },
  {
    title: 'Planejamento',
    path: '/dashboard',
    icon: <Calendar size={20} />,
    implemented: false
  },
  {
    title: 'Contas Compartilhadas',
    path: '/dashboard',
    icon: <Users size={20} />,
    implemented: false
  },
  {
    title: 'Estoque',
    path: '/dashboard',
    icon: <Archive size={20} />,
    isPremium: true,
    implemented: false
  },
  {
    title: 'Configurações',
    path: '/dashboard',
    icon: <Settings size={20} />,
    implemented: false
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { isPremium } = useAuth();
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleNavigation = (item: SidebarItem, e: React.MouseEvent) => {
    if (!item.implemented && item.path !== '/dashboard') {
      e.preventDefault();
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: `A página "${item.title}" ainda está sendo implementada e estará disponível em breve.`,
        variant: "default",
      });
    }
  };

  return (
    <div
      className={cn(
        'bg-sidebar dark:bg-slate-900 transition-all duration-300 h-screen fixed left-0 top-0 z-40 border-r border-sidebar-border flex flex-col',
        collapsed ? 'w-[70px]' : 'w-[250px]'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/dashboard" className="font-bold text-sidebar-foreground dark:text-white text-xl">
            DinheroEsperto
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-sidebar-foreground dark:text-white">
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>
      
      <div className="flex flex-col gap-2 p-2 flex-grow overflow-y-auto">
        {sidebarItems.map((item) => {
          // Skip premium features for non-premium users
          if (item.isPremium && !isPremium) return null;
          
          const isActive = location.pathname === item.path;
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              onClick={(e) => handleNavigation(item, e)}
              className={!item.implemented ? "cursor-not-allowed opacity-70" : ""}
            >
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start text-sidebar-foreground dark:text-gray-300 hover:text-white hover:bg-sidebar-accent dark:hover:bg-slate-800',
                  isActive && 'bg-sidebar-accent dark:bg-slate-800 text-white',
                  collapsed && 'justify-center'
                )}
              >
                <span>{item.icon}</span>
                {!collapsed && (
                  <div className="ml-2 flex items-center">
                    <span>{item.title}</span>
                    {!item.implemented && (
                      <AlertCircle size={14} className="ml-2 text-yellow-500" />
                    )}
                  </div>
                )}
              </Button>
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && isPremium && (
          <div className="bg-sidebar-accent dark:bg-slate-800 rounded-md p-2 text-xs text-sidebar-foreground dark:text-white mb-2">
            <span className="font-medium block">Plano Premium Ativo</span>
            <span>Aproveite todos os recursos!</span>
          </div>
        )}
        {!collapsed && !isPremium && (
          <Link to="/dashboard">
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
