import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Role, TaskStatus } from '../types';
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
  Bell,
  Clock,
  AlertCircle
} from 'lucide-react';

export const Layout: React.FC = () => {
  const { auth, logout, tasks } = useApp();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Notifications Logic
  const notifications = React.useMemo(() => {
      if (!auth.user) return [];
      const now = new Date();
      const userTasks = tasks.filter(t => t.assignedToUserId === auth.user?.id && t.status !== TaskStatus.DONE);
      
      const alerts = [];

      userTasks.forEach(t => {
          if (t.dueDate) {
              const dueDate = new Date(t.dueDate);
              const diffTime = dueDate.getTime() - now.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (diffDays < 0) {
                  alerts.push({ id: t.id, title: t.title, type: 'OVERDUE', days: Math.abs(diffDays) });
              } else if (diffDays <= 2) {
                  alerts.push({ id: t.id, title: t.title, type: 'UPCOMING', days: diffDays });
              }
          }
      });
      return alerts;
  }, [tasks, auth.user]);

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
        <div className="flex gap-4">
             {/* Mobile Notification Icon */}
             <div className="relative">
                <Bell size={24} className="text-white" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {notifications.length}
                    </span>
                )}
             </div>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>
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

        {/* Nav Items Container */}
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

            {/* Desktop Notification Trigger */}
            <div className="mt-4 px-4 hidden md:block relative">
                <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary hover:bg-dark-surface hover:text-white w-full transition-all"
                >
                    <div className="relative">
                        <Bell size={20} />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                                {notifications.length}
                            </span>
                        )}
                    </div>
                    Notificações
                </button>

                {/* Notification Dropdown */}
                {isNotificationsOpen && (
                    <div className="absolute left-full top-0 ml-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-0 z-50 overflow-hidden animate-fade-in">
                        <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-sm">Alertas de Tarefas</h3>
                            <button onClick={() => setIsNotificationsOpen(false)}><X size={16} className="text-slate-400 hover:text-slate-700"/></button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-slate-500 text-sm">
                                    <Bell size={24} className="mx-auto mb-2 opacity-20"/>
                                    Nenhuma notificação nova.
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start gap-2">
                                            {notif.type === 'OVERDUE' ? (
                                                <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                            ) : (
                                                <Clock size={16} className="text-amber-500 mt-0.5 shrink-0" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 line-clamp-2">{notif.title}</p>
                                                <p className={`text-xs mt-1 ${notif.type === 'OVERDUE' ? 'text-red-600 font-bold' : 'text-amber-600'}`}>
                                                    {notif.type === 'OVERDUE' 
                                                        ? `Atrasada há ${notif.days} dias!`
                                                        : `Vence em ${notif.days === 0 ? 'breve' : notif.days + ' dias'}`
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Footer Section */}
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

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 relative scroll-smooth">
        <div className="max-w-7xl mx-auto pb-10">
            <Outlet />
        </div>
      </main>
    </div>
  );
};