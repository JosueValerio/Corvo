import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  LogOut, 
  FileText,
  Menu,
  X,
  Feather,
  Shield,
  UserCircle
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
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 p-4 flex justify-between items-center shadow-lg z-20 sticky top-0">
        <div className="flex items-center gap-2 text-white">
            <Feather size={24} />
            <span className="font-bold tracking-tight">CORVO MKT</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar - Dark Theme for Corvo Brand */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out text-slate-300
        md:relative md:translate-x-0 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3 text-white mb-1">
                <div className="p-2 bg-indigo-600 rounded-lg">
                    <Feather size={24} />
                </div>
                <div>
                    <h1 className="text-lg font-bold leading-none tracking-tight">CORVO</h1>
                    <p className="text-xs text-indigo-400 font-medium tracking-widest">MARKETING</p>
                </div>
            </div>
        </div>

        <div className="p-4 mt-4 flex flex-col gap-1 flex-1">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu Principal</p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <NavLink to="/profile" className="flex items-center gap-3 mb-4 px-2 hover:bg-slate-800 p-2 rounded-lg transition-colors group">
            <div className="w-10 h-10 rounded-full bg-indigo-900 border border-indigo-700 overflow-hidden flex items-center justify-center">
               <img src={auth.user?.avatarUrl} alt="Avatar" className="w-full h-full object-cover"/>
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-sm font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">{auth.user?.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">Meu Perfil</p>
            </div>
          </NavLink>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 py-2 rounded-lg font-medium w-full transition-colors"
          >
            <LogOut size={16} /> Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-100/50">
        <div className="max-w-7xl mx-auto">
            <Outlet />
        </div>
      </main>
    </div>
  );
};