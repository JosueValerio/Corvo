import React from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { Shield, User as UserIcon } from 'lucide-react';

export const Users: React.FC = () => {
  const { users, auth } = useApp();

  if (auth.user?.role !== Role.ADMIN) {
    return <div className="p-8 text-center text-red-500">Acesso Restrito ao Administrador.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gerenciar Usuários</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm">
            Adicionar Usuário
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
            <thead className="bg-slate-50">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Permissão</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                                <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full bg-slate-200" />
                                <span className="font-medium text-slate-900">{user.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === Role.ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                {user.role === Role.ADMIN ? <Shield size={12}/> : <UserIcon size={12}/>}
                                {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-primary hover:text-indigo-900">Editar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};