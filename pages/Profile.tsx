import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Save, User, Mail, Camera } from 'lucide-react';

export const Profile: React.FC = () => {
  const { auth, updateUserProfile } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (auth.user) {
        setName(auth.user.name);
        setEmail(auth.user.email);
        setAvatarUrl(auth.user.avatarUrl || '');
    }
  }, [auth.user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (auth.user) {
        updateUserProfile(auth.user.id, name, email, avatarUrl);
        alert('Perfil atualizado com sucesso!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Meu Perfil</h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                    <img src={avatarUrl || 'https://via.placeholder.com/150'} alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-100 object-cover" />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="text-white" size={24} />
                    </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Cole a URL da imagem abaixo para alterar</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><User size={16}/> Nome Completo</label>
                <input type="text" className="w-full border p-3 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-primary outline-none" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><Mail size={16}/> Email Corporativo</label>
                <input type="email" className="w-full border p-3 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-primary outline-none" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><Camera size={16}/> URL do Avatar</label>
                <input type="text" className="w-full border p-3 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-primary outline-none text-sm" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-indigo-900 flex items-center gap-2 font-medium shadow-lg transition-transform transform active:scale-95">
                    <Save size={20} /> Salvar Alterações
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};