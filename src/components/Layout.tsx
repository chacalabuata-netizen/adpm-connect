import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Church, 
  Clock, 
  CalendarDays, 
  MessageSquare, 
  Users, 
  Phone, 
  HelpCircle,
  Globe,
  LogOut
} from 'lucide-react';

interface LayoutProps {
  userRole?: 'member' | 'admin' | null;
  onLogout?: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ userRole, onLogout, children }) => {
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    onLogout?.();
    toast({
      title: "Sessão terminada",
      description: "Até breve!",
    });
  };

  const navItems = [
    { path: '/', label: 'Início', icon: Church },
    { path: '/horario', label: 'Horário', icon: Clock },
    { path: '/atividades', label: 'Atividades', icon: CalendarDays },
    { path: '/anuncios', label: 'Anúncios', icon: MessageSquare },
    { path: '/comunidade', label: 'Comunidade', icon: Users },
    { path: '/contacto', label: 'Contacto', icon: Phone },
    { path: '/ajuda', label: 'Ajuda', icon: HelpCircle },
    { path: '/website', label: 'Website', icon: Globe },
  ];

  const adminItems = [
    { path: '/admin', label: 'Painel Admin', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero shadow-deep border-b border-border/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Church className="h-8 w-8 text-primary-foreground" />
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">
                  ADPM Casa de Zadoque
                </h1>
                <p className="text-primary-foreground/80 text-sm">Montijo</p>
              </div>
            </div>
            
            {userRole && (
              <div className="flex items-center space-x-4">
                <span className="text-primary-foreground/90 text-sm">
                  {userRole === 'admin' ? 'Administrador' : 'Membro'}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      {userRole && (
        <nav className="bg-card border-b border-border shadow-soft">
          <div className="container mx-auto px-4">
            <div className="flex space-x-1 overflow-x-auto py-2">
              {(userRole === 'admin' ? adminItems : navItems).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "sacred" : "ghost"}
                      size="sm"
                      className="whitespace-nowrap min-w-fit"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Church className="h-6 w-6" />
            <span className="font-semibold">ADPM Casa de Zadoque</span>
          </div>
          <p className="text-primary-foreground/80 text-sm">
            Uma comunidade de fé em Montijo • Unidos em Cristo
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;