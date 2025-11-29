import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role, Team } from '../types';
import { Plus, Edit2, Trash, X, User as UserIcon, Camera, UploadCloud } from 'lucide-react';

export const Teams: React.FC = () => {
  const { teams, users, auth, addTeam, updateTeam, deleteTeam } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Partial<Team>>({});

  if (auth.user?.role !== Role.ADMIN) {
    return <div className="p-8 text-center text-red-500 bg-white rounded-xl shadow-sm border border-red-100">🚫 Acesso Restrito ao Administrador.</div>;
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const imageUrl = URL.createObjectURL(file);
          setEditingTeam({ ...editingTeam, photoUrl: imageUrl });
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Gestão de Times</h1>
            <p className="text-slate-500">Organize os colaboradores em squads.</p>
        </div>
        <button onClick={openNewTeamModal} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition-colors">
            <Plus size={20} /> Novo Time
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => (
            <div key={team.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all">
                <div className="h-32 bg-slate-900 relative">
                    {team.photoUrl ? (
                         <img src={team.photoUrl} alt={team.name} className="w-full h-full object-cover opacity-80" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                            <UserIcon size={48} className="text-white"/>
                        </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditTeamModal(team)} className="bg-white p-2 rounded-lg text-slate-700 hover:text-primary shadow-sm"><Edit2 size={16}/></button>
                        <button onClick={() => deleteTeam(team.id)} className="bg-white p-2 rounded-lg text-red-500 hover:bg-red-50 shadow-sm"><Trash size={16}/></button>
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{team.name}</h3>
                    <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2">{team.description || 'Sem descrição definida.'}</p>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center -space-x-2">
                            {team.memberIds.map(uid => {
                                const u = users.find(user => user.id === uid);
                                if(!u) return null;
                                return <img key={uid} src={u.avatarUrl} title={u.name} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />;
                            })}
                            {team.memberIds.length === 0 && <span className="text-xs text-slate-400 italic">Nenhum membro</span>}
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {team.memberIds.length} {team.memberIds.length === 1 ? 'Membro' : 'Membros'}
                        </span>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">{editingTeam.id ? 'Editar Time' : 'Criar Novo Time'}</h2>
                    <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-slate-400 hover:text-slate-600"/></button>
                </div>
                <form onSubmit={handleSaveTeam} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Time</label>
                        <input required type="text" className="w-full border p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary outline-none" value={editingTeam.name || ''} onChange={e => setEditingTeam({...editingTeam, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                        <textarea rows={2} className="w-full border p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary outline-none resize-none" value={editingTeam.description || ''} onChange={e => setEditingTeam({...editingTeam, description: e.target.value})} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Foto do Time</label>
                        <div className="flex gap-2 items-center">
                                {editingTeam.photoUrl && (
                                    <img src={editingTeam.photoUrl} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                                )}
                                <div className="flex-1 relative">
                                    <input 
                                        type="text" 
                                        className="w-full border p-2 pl-9 rounded bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary outline-none" 
                                        placeholder="Cole uma URL ou faça upload" 
                                        value={editingTeam.photoUrl || ''} 
                                        onChange={e => setEditingTeam({...editingTeam, photoUrl: e.target.value})} 
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Camera size={16}/></div>
                                </div>
                                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 p-2 rounded text-slate-600 transition-colors border border-slate-200" title="Fazer Upload">
                                    <UploadCloud size={20}/>
                                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Membros do Time</label>
                        <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50 space-y-1">
                            {users.map(u => (
                                <div key={u.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors" onClick={() => toggleMember(u.id)}>
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                        (editingTeam.memberIds || []).includes(u.id) ? 'bg-primary border-primary' : 'bg-white border-slate-300'
                                    }`}>
                                        {(editingTeam.memberIds || []).includes(u.id) && <UserIcon size={12} className="text-white"/>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src={u.avatarUrl} className="w-6 h-6 rounded-full" />
                                        <span className="text-sm text-slate-700">{u.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-slate-100">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-lg font-medium">Salvar Time</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};