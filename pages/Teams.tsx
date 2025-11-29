import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role, Team } from '../types';
import { Plus, Edit2, Trash, X, User as UserIcon, Camera } from 'lucide-react';

export const Teams: React.FC = () => {
  const { teams, users, auth, addTeam, updateTeam, deleteTeam } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Partial<Team>>({});

  if (auth.user?.role !== Role.ADMIN) {
    return <div className="p-8 text-center text-red-500">Acesso Restrito ao Administrador.</div>;
  }

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeam.id) {
        updateTeam(editingTeam as Team);
    } else {
        addTeam({
            id: `team${Date.now()}`,
            name: editingTeam.name || 'Nova Equipe',
            description: editingTeam.description || '',
            memberIds: editingTeam.memberIds || [],
            photoUrl: editingTeam.photoUrl
        });
    }
    setIsModalOpen(false);
    setEditingTeam({});
  };

  const openNewTeamModal = () => {
    setEditingTeam({ memberIds: [] });
    setIsModalOpen(true);
  };

  const openEditTeamModal = (team: Team) => {
    setEditingTeam({ ...team });
    setIsModalOpen(true);
  };

  const toggleMember = (userId: string) => {
    const currentMembers = editingTeam.memberIds || [];
    if (currentMembers.includes(userId)) {
        setEditingTeam({ ...editingTeam, memberIds: currentMembers.filter(id => id !== userId) });
    } else {
        setEditingTeam({ ...editingTeam, memberIds: [...currentMembers, userId] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Gestão de Times</h1>
            <p className="text-slate-500">Organize os colaboradores em squads.</p>
        </div>
        <button onClick={openNewTeamModal} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2">
            <Plus size={20} /> Novo Time
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
            <div key={team.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                <div className="h-24 bg-indigo-900 relative">
                    {team.photoUrl && <img src={team.photoUrl} alt={team.name} className="w-full h-full object-cover opacity-50" />}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditTeamModal(team)} className="bg-white p-1.5 rounded text-slate-700 hover:text-primary"><Edit2 size={14}/></button>
                        <button onClick={() => deleteTeam(team.id)} className="bg-white p-1.5 rounded text-red-500 hover:bg-red-50"><Trash size={14}/></button>
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{team.name}</h3>
                    <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2">{team.description}</p>
                    
                    <div className="flex items-center -space-x-2 mb-4">
                        {team.memberIds.map(uid => {
                            const u = users.find(user => user.id === uid);
                            if(!u) return null;
                            return <img key={uid} src={u.avatarUrl} title={u.name} className="w-8 h-8 rounded-full border-2 border-white" />;
                        })}
                        {team.memberIds.length === 0 && <span className="text-xs text-slate-400">Sem membros</span>}
                    </div>
                    
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {team.memberIds.length} Membros
                    </div>
                </div>
            </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{editingTeam.id ? 'Editar Time' : 'Criar Novo Time'}</h2>
                    <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-slate-400"/></button>
                </div>
                <form onSubmit={handleSaveTeam} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Time</label>
                        <input required type="text" className="w-full border p-2 rounded bg-white text-slate-900" value={editingTeam.name || ''} onChange={e => setEditingTeam({...editingTeam, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                        <input type="text" className="w-full border p-2 rounded bg-white text-slate-900" value={editingTeam.description || ''} onChange={e => setEditingTeam({...editingTeam, description: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">URL da Foto (Capa)</label>
                        <div className="flex gap-2">
                             <input type="text" className="w-full border p-2 rounded bg-white text-slate-900 text-sm" placeholder="https://..." value={editingTeam.photoUrl || ''} onChange={e => setEditingTeam({...editingTeam, photoUrl: e.target.value})} />
                             <div className="p-2 bg-slate-100 rounded text-slate-500"><Camera size={20}/></div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Membros</label>
                        <div className="max-h-40 overflow-y-auto border border-slate-200 rounded p-2 bg-slate-50 space-y-1">
                            {users.map(u => (
                                <div key={u.id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer" onClick={() => toggleMember(u.id)}>
                                    <input type="checkbox" checked={(editingTeam.memberIds || []).includes(u.id)} readOnly className="rounded text-primary focus:ring-primary" />
                                    <span className="text-sm text-slate-700">{u.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded hover:bg-indigo-700">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};