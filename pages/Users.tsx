import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Role, User } from '../types';
import { Shield, User as UserIcon, Plus, Edit2, Trash, X, AlertTriangle, Timer } from 'lucide-react';

export const Users: React.FC = () => {
  const { users, auth, addUser, updateUser, deleteUser } = useApp();
  
  // CRUD Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User>>({});

  // Safe Delete Modal State
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteCountdown, setDeleteCountdown] = useState(5);
  const [deleteConfirmationChecked, setDeleteConfirmationChecked] = useState(false);

  // Timer Effect for Delete
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (userToDelete && deleteCountdown > 0) {
      timer = setTimeout(() => {
        setDeleteCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [userToDelete, deleteCountdown]);

  if (auth.user?.role !== Role.ADMIN) {
    return <div className="p-8 text-center text-red-500">Acesso Restrito ao Administrador.</div>;
  }

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser.id) {
        updateUser(editingUser as User);
    } else {
        addUser({
            id: `u${Date.now()}`,
            name: editingUser.name || 'Novo Usuário',
            email: editingUser.email || '',
            role: editingUser.role || Role.USER,
            jobTitle: editingUser.jobTitle || 'Colaborador',
            avatarUrl: editingUser.avatarUrl || `https://ui-avatars.com/api/?name=${editingUser.name}&background=random`
        });
    }
    setIsModalOpen(false);
    setEditingUser({});
  };

  const openNewUserModal = () => {
      setEditingUser({ role: Role.USER, avatarUrl: '' });
      setIsModalOpen(true);
  };

  const openEditUserModal = (user: User) => {
      setEditingUser({ ...user });
      setIsModalOpen(true);
  };

  // Opens the safe delete modal
  const initiateDeleteUser = (user: User) => {
      setUserToDelete(user);
      setDeleteCountdown(5); // Reset timer
      setDeleteConfirmationChecked(false); // Reset checkbox
  };

  // Executes the actual deletion
  const executeDeleteUser = () => {
      if (userToDelete) {
          deleteUser(userToDelete.id);
          setUserToDelete(null);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gerenciar Usuários</h1>
        <button onClick={openNewUserModal} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2">
            <Plus size={20} /> Adicionar Usuário
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
            <thead className="bg-slate-50">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Função / Cargo</th>
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
                                <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full bg-slate-200 border border-slate-100" />
                                <span className="font-medium text-slate-900">{user.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                            {user.jobTitle || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === Role.ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                {user.role === Role.ADMIN ? <Shield size={12}/> : <UserIcon size={12}/>}
                                {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => openEditUserModal(user)} className="text-primary hover:text-indigo-900 mr-4 transition-colors">Editar</button>
                            <button onClick={() => initiateDeleteUser(user)} className="text-red-500 hover:text-red-700 transition-colors">Remover</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* User CRUD Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-900">{editingUser.id ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                      <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-slate-400 hover:text-slate-600"/></button>
                  </div>
                  
                  <form onSubmit={handleSaveUser} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                          <input required type="text" className="w-full border p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary outline-none" value={editingUser.name || ''} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Email de Acesso</label>
                          <input required type="email" className="w-full border p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary outline-none" value={editingUser.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Função / Cargo</label>
                            <input type="text" placeholder="Ex: Analista SEO" className="w-full border p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary outline-none" value={editingUser.jobTitle || ''} onChange={e => setEditingUser({...editingUser, jobTitle: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Permissão</label>
                            <select className="w-full border p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary outline-none" value={editingUser.role || Role.USER} onChange={e => setEditingUser({...editingUser, role: e.target.value as Role})}>
                                <option value={Role.USER}>Usuário</option>
                                <option value={Role.ADMIN}>Administrador</option>
                            </select>
                        </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">URL da Foto (Avatar)</label>
                          <input type="text" placeholder="https://..." className="w-full border p-2 rounded bg-white text-slate-900 focus:ring-2 focus:ring-primary outline-none text-xs" value={editingUser.avatarUrl || ''} onChange={e => setEditingUser({...editingUser, avatarUrl: e.target.value})} />
                      </div>

                      <div className="flex gap-2 justify-end mt-6">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
                          <button type="submit" className="px-6 py-2 bg-primary text-white rounded hover:bg-indigo-700 shadow-md">Salvar</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Safe Delete Modal */}
      {userToDelete && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in border-t-4 border-red-500">
                  <div className="p-6">
                      <div className="flex flex-col items-center text-center mb-6">
                          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                              <AlertTriangle size={32} />
                          </div>
                          <h2 className="text-xl font-bold text-slate-900">Remover Usuário?</h2>
                          <p className="text-slate-500 text-sm mt-2">
                              Você está prestes a remover <strong className="text-slate-800">{userToDelete.name}</strong>. 
                              <br/>Esta ação é irreversível e removerá o acesso ao sistema.
                          </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                          <label className="flex items-start gap-3 cursor-pointer">
                              <input 
                                  type="checkbox" 
                                  className="mt-1 w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                  checked={deleteConfirmationChecked}
                                  onChange={(e) => setDeleteConfirmationChecked(e.target.checked)}
                              />
                              <span className="text-sm text-slate-700 select-none">
                                  Estou ciente e <strong>confirmo</strong> que desejo remover este usuário permanentemente.
                              </span>
                          </label>
                      </div>

                      <div className="flex gap-3">
                          <button 
                              onClick={() => setUserToDelete(null)} 
                              className="flex-1 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                          >
                              Cancelar
                          </button>
                          <button 
                              onClick={executeDeleteUser}
                              disabled={deleteCountdown > 0 || !deleteConfirmationChecked}
                              className={`flex-1 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2
                                ${deleteCountdown > 0 || !deleteConfirmationChecked 
                                    ? 'bg-slate-300 cursor-not-allowed' 
                                    : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
                                }
                              `}
                          >
                              {deleteCountdown > 0 ? (
                                  <>
                                    <Timer size={18} className="animate-pulse"/>
                                    Aguarde {deleteCountdown}s
                                  </>
                              ) : (
                                  <>
                                    <Trash size={18}/>
                                    Remover Agora
                                  </>
                              )}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};