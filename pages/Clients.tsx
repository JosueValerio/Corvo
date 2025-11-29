import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Plus, Search, MoreHorizontal, User, DollarSign } from 'lucide-react';
import { Role } from '../types';

export const Clients: React.FC = () => {
  const { clients, users, auth, addClient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Client Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientFee, setNewClientFee] = useState(0);

  const isAdmin = auth.user?.role === Role.ADMIN;
  
  const filteredClients = clients.filter(client => {
    // 1. Permission Check
    const hasAccess = isAdmin || client.assignedUserIds.includes(auth.user?.id || '');
    if (!hasAccess) return false;

    // 2. Search Filter
    return client.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return; // double check

    addClient({
        id: `c${Date.now()}`,
        name: newClientName,
        monthlyFee: newClientFee,
        status: 'ACTIVE',
        briefing: '',
        accessCredentials: '',
        assignedUserIds: [],
        contractUrl: '#',
        files: []
    });
    setIsModalOpen(false);
    setNewClientName('');
    setNewClientFee(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            Novo Cliente
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar clientes..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => {
          // Calculate Commission for current user
          const userCommission = client.commissions?.find(c => c.userId === auth.user?.id);
          const commissionValue = userCommission ? (client.monthlyFee * userCommission.percentage) / 100 : 0;

          return (
            <Link to={`/clients/${client.id}`} key={client.id} className="block group">
              <div className={`
                bg-white p-6 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md
                ${client.status === 'INACTIVE' ? 'border-red-100 bg-red-50/10' : 'border-slate-100 hover:border-primary/30'}
              `}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {client.name.substring(0, 1)}
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${client.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {client.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{client.name}</h3>
                
                {isAdmin ? (
                   <p className="text-slate-500 text-sm mb-4">Mensal: R$ {client.monthlyFee.toLocaleString('pt-BR')}</p>
                ) : (
                   userCommission ? (
                      <div className="mb-4 bg-emerald-50 border border-emerald-100 p-2 rounded-lg inline-block">
                          <p className="text-emerald-700 text-sm font-bold flex items-center gap-1">
                              <DollarSign size={14}/> 
                              Comissão: R$ {commissionValue.toLocaleString('pt-BR')}
                              <span className="text-xs text-emerald-600 font-normal">({userCommission.percentage}%)</span>
                          </p>
                      </div>
                   ) : (
                      <p className="text-slate-400 text-xs mb-4 italic">Sem comissão atribuída</p>
                   )
                )}
  
                <div className="flex items-center -space-x-2 mt-4">
                  {client.assignedUserIds.map(uid => {
                      const u = users.find(user => user.id === uid);
                      if(!u) return null;
                      return (
                          <img key={uid} src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full border-2 border-white" title={u.name} />
                      )
                  })}
                  {client.assignedUserIds.length === 0 && (
                      <span className="text-xs text-slate-400 italic">Sem atribuição</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Simple Modal for Create Client */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                  <h2 className="text-xl font-bold mb-4">Novo Cliente</h2>
                  <form onSubmit={handleCreateClient} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700">Nome da Empresa</label>
                          <input required type="text" className="w-full border p-2 rounded" value={newClientName} onChange={e => setNewClientName(e.target.value)} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700">Valor Mensal (R$)</label>
                          <input required type="number" className="w-full border p-2 rounded" value={newClientFee} onChange={e => setNewClientFee(Number(e.target.value))} />
                      </div>
                      <div className="flex gap-2 justify-end mt-6">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
                          <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-indigo-700">Criar</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};