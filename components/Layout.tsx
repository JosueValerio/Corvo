import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { CorvoLogo } from './CorvoLogo';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  LogOut, 
  FileText,
  Menu,
  X,
  Shield,
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { auth, logout } = useApp();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = auth.user?.role === Role.ADMIN;

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/clients', icon: Briefcase, label: 'Clientes' },
    ...(isAdmin ? [
        { to: '/teams', icon: Users, label: 'Times & Acesso' },
        { to: '/users', icon: Shield, label: 'Usuários' }
    ] : []),
    { to: '/documentation', icon: FileText, label: 'Documentação' },
  ];

  return (
    <div className="h-screen bg-background flex flex-col md:flex-row font-sans text-dark-surface overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-dark p-4 flex justify-between items-center shadow-lg z-20 sticky top-0 shrink-0">
        <div>
            <CorvoLogo variant="light" />
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar - Corvo Dark Theme (#161616) */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-dark border-r border-dark-surface transform transition-transform duration-200 ease-in-out text-secondary
        md:relative md:translate-x-0 flex flex-col h-full
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-dark-surface flex items-center justify-start pl-6 shrink-0">
            <CorvoLogo variant="light" />
        </div>

        {/* Nav Items Container - Allows scrolling ONLY if menu is too tall, pushes footer down */}
        <div className="p-4 mt-4 flex flex-col gap-2 flex-1 overflow-y-auto">
            <p className="px-4 text-xs font-bold text-secondary/50 uppercase tracking-widest mb-2 font-display">Menu Principal</p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 shrink-0
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-secondary hover:bg-dark-surface hover:text-white'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
        </div>

        {/* Footer Section - Fixed at bottom due to flex-col and flex-1 above */}
        <div className="p-4 border-t border-dark-surface bg-dark shrink-0">
          <NavLink to="/profile" className="flex items-center gap-3 mb-4 px-3 hover:bg-dark-surface p-2 rounded-xl transition-colors group">
            <div className="w-10 h-10 rounded-full bg-primary-dark border-2 border-dark-surface overflow-hidden flex items-center justify-center shrink-0">
               <img src={auth.user?.avatarUrl} alt="Avatar" className="w-full h-full object-cover"/>
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{auth.user?.name}</p>
              <p className="text-[10px] text-secondary truncate uppercase tracking-wider font-display">Meu Perfil</p>
            </div>
          </NavLink>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-sm text-[#F87171] hover:text-white hover:bg-[#DC2626] py-3 rounded-xl font-bold w-full transition-all"
          >
            <LogOut size={18} /> Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content - Independent Scroll */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 relative scroll-smooth">
        <div className="max-w-7xl mx-auto pb-10">
            <Outlet />
        </div>
      </main>
    </div>
  );
};