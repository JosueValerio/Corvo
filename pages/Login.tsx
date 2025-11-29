import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CorvoLogo } from '../components/CorvoLogo';
import { Lock, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4 relative overflow-hidden">
      {/* Background Decor - Abstract Brand Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-success/5 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-dark-surface p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/5 relative z-10 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
             <CorvoLogo variant="light" className="scale-125" />
          </div>
          <p className="text-secondary text-sm font-display text-center">
            Sistema de Gestão de Clientes
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Email Corporativo</label>
            <div className="relative">
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@corvomarketing.com"
                className="w-full pl-4 pr-4 py-4 rounded-xl bg-dark border border-white/10 text-white placeholder-white/20 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
                required
                />
            </div>
          </div>
          
          <div className="bg-dark/50 p-4 rounded-xl text-xs text-secondary border border-white/5">
            <p className="font-bold mb-2 flex items-center gap-1 text-primary"><Lock size={12}/> Credenciais de Acesso:</p>
            <p className="font-mono opacity-70 mb-1">Admin: admin@corvomarketing.com</p>
            <p className="font-mono opacity-70">Time: atendimento@corvomarketing.com</p>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-4 rounded-full hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Acessar Painel <ArrowRight size={18} />
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-secondary/40 text-xs font-display">
                &copy; {new Date().getFullYear()} Corvo Marketing. Todos os direitos reservados.
            </p>
        </div>
      </div>
    </div>
  );
};