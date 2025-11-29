import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Feather, Lock } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-primary">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 text-white shadow-lg">
            <Feather size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CORVO MARKETING</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-medium">Área Restrita</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Corporativo</label>
            <div className="relative">
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@corvomarketing.com"
                className="w-full pl-4 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                required
                />
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg text-xs text-slate-600 border border-slate-200">
            <p className="font-semibold mb-1 flex items-center gap-1"><Lock size={12}/> Acesso Demo:</p>
            <p className="font-mono">Admin: admin@corvomarketing.com</p>
            <p className="font-mono">Time: atendimento@corvomarketing.com</p>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-indigo-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Acessar Painel
          </button>
        </form>
        
        <p className="text-center text-slate-400 text-xs mt-8">
            &copy; {new Date().getFullYear()} Corvo Marketing. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};