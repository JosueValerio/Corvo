import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role, TaskStatus } from '../types';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, Clock, Users, DollarSign, Briefcase, PieChart as PieChartIcon, ChevronLeft, ChevronRight, Calendar, ArrowRight, X } from 'lucide-react';

const COLORS = ['#312e81', '#6366f1', '#94a3b8', '#cbd5e1'];

export const Dashboard: React.FC = () => {
  const { auth, clients, tasks, users } = useApp();
  const isAdmin = auth.user?.role === Role.ADMIN;
  const userId = auth.user?.id || '';

  // Date Filtering State - Start with current date
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Commission Modal State
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);

  // Helper to change month
  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const formattedDate = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  
  // Checks if a task falls within the selected month
  const isInSelectedMonth = (dateString?: string) => {
    if (!dateString) return false;
    // Handle timezone offsets by splitting string directly
    const [year, month] = dateString.split('-').map(Number);
    // Month in date string is 1-12, getMonth() is 0-11
    return (month - 1) === currentDate.getMonth() && year === currentDate.getFullYear();
  };

  // Filter Data
  const myClients = isAdmin ? clients : clients.filter(c => c.assignedUserIds.includes(userId));
  
  const myTasks = isAdmin 
    ? tasks 
    : tasks.filter(t => t.assignedToUserId === userId);

  // Apply Date Filter to Metrics
  // Pending: Tasks that are NOT done, and Due Date is in selected month (or overdue? For this logic, strict month view)
  const pendingTasks = myTasks.filter(t => t.status !== TaskStatus.DONE && isInSelectedMonth(t.dueDate)).length;
  
  // Done: Tasks that are DONE, and CompletedAt is in selected month
  const doneTasks = myTasks.filter(t => t.status === TaskStatus.DONE && isInSelectedMonth(t.completedAt)).length;
  
  // In Progress: Tasks IN PROGRESS, Due Date in selected month
  const inProgressTasks = myTasks.filter(t => t.status === TaskStatus.IN_PROGRESS && isInSelectedMonth(t.dueDate)).length;

  // --- Revenue Logic ---
  // Revenue is calculated based on CURRENTLY Active clients. 
  // If a client is deleted (removed from 'clients' array), they disappear from here immediately.
  const activeClientsInMonth = myClients.filter(c => c.status === 'ACTIVE');

  const totalRevenue = isAdmin 
    ? activeClientsInMonth.reduce((acc, c) => acc + c.monthlyFee, 0) 
    : 0;

  let totalCommission = 0;
  const commissionDetails: { clientId: string, clientName: string, amount: number, percentage: number }[] = [];

  if (!isAdmin) {
      activeClientsInMonth.forEach(client => {
          if (client.commissions) {
              const userCommission = client.commissions.find(c => c.userId === userId);
              if (userCommission) {
                  const amount = (client.monthlyFee * userCommission.percentage) / 100;
                  totalCommission += amount;
                  commissionDetails.push({
                      clientId: client.id,
                      clientName: client.name,
                      amount: amount,
                      percentage: userCommission.percentage
                  });
              }
          }
      });
  }

  // --- Admin: Team Overview Logic ---
  const teamPerformance = users.filter(u => u.role !== Role.ADMIN).map(u => {
      let userCommissionTotal = 0;
      let userCompletedTasks = 0;
      let userPendingTasks = 0;

      // Calculate Commission for this user (based on current active clients)
      clients.forEach(c => {
          if(c.status === 'ACTIVE' && c.commissions) {
              const comm = c.commissions.find(uc => uc.userId === u.id);
              if(comm) {
                  userCommissionTotal += (c.monthlyFee * comm.percentage) / 100;
              }
          }
      });

      // Calculate Tasks for this user in selected month
      const userTasks = tasks.filter(t => t.assignedToUserId === u.id);
      userCompletedTasks = userTasks.filter(t => t.status === TaskStatus.DONE && isInSelectedMonth(t.completedAt)).length;
      userPendingTasks = userTasks.filter(t => t.status !== TaskStatus.DONE && isInSelectedMonth(t.dueDate)).length;

      return {
          user: u,
          commission: userCommissionTotal,
          completed: userCompletedTasks,
          pending: userPendingTasks
      };
  });


  // Chart Data
  const taskStatusData = [
    { name: 'Pendentes', value: pendingTasks },
    { name: 'Em Andamento', value: inProgressTasks },
    { name: 'Concluídas', value: doneTasks },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Visão geral de desempenho e atividades.</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 px-4 min-w-[180px] justify-center">
                <Calendar size={18} className="text-primary"/>
                <span className="font-bold text-slate-800 capitalize select-none">{formattedDate}</span>
            </div>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                <ChevronRight size={20} />
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Clientes Ativos</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{activeClientsInMonth.length}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Users size={28} /></div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pendências (Mês)</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{pendingTasks}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Clock size={28} /></div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Entregas (Mês)</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{doneTasks}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={28} /></div>
        </div>

        {isAdmin ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Faturamento (Mês)</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">R$ {totalRevenue.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-3 bg-slate-900 text-white rounded-lg"><DollarSign size={28} /></div>
          </div>
        ) : (
            <div 
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow group relative"
                onClick={() => setIsCommissionModalOpen(true)}
            >
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  Comissões (Mês) <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary"/>
              </p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">R$ {totalCommission.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign size={28} /></div>
          </div>
        )}
      </div>

      {/* Admin Team Overview */}
      {isAdmin && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Briefcase size={20}/> Visão Geral da Equipe ({formattedDate})</h2>
              </div>
              <table className="w-full">
                  <thead className="bg-slate-50">
                      <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Colaborador</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Cargo</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Entregas</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Pendências</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Comissão Gerada</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {teamPerformance.map(item => (
                          <tr key={item.user.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                      <img src={item.user.avatarUrl} className="w-8 h-8 rounded-full"/>
                                      <span className="font-medium text-slate-900">{item.user.name}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">{item.user.jobTitle}</td>
                              <td className="px-6 py-4 text-center">
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">{item.completed}</span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">{item.pending}</span>
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-slate-700">
                                  R$ {item.commission.toLocaleString('pt-BR')}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><Briefcase size={20}/> Status de Tarefas ({formattedDate})</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskStatusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" fontSize={12} stroke="#64748b" width={100} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#312e81" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><PieChartIcon size={20}/> Distribuição ({formattedDate})</h2>
            <div className="h-72 flex justify-center items-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={taskStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {taskStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                 </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Commission Detail Modal (User Only) */}
      {isCommissionModalOpen && !isAdmin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                  <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                      <div>
                          <h2 className="text-xl font-bold">Detalhamento de Comissões</h2>
                          <p className="text-indigo-200 text-sm">{formattedDate}</p>
                      </div>
                      <button onClick={() => setIsCommissionModalOpen(false)} className="text-slate-400 hover:text-white"><X/></button>
                  </div>
                  
                  <div className="p-0 max-h-[60vh] overflow-y-auto">
                      {commissionDetails.length === 0 ? (
                          <div className="p-8 text-center text-slate-500">
                              Nenhuma comissão registrada para este período.
                          </div>
                      ) : (
                          <div className="divide-y divide-slate-100">
                              {commissionDetails.map(item => (
                                  <Link 
                                    to={`/clients/${item.clientId}`} 
                                    key={item.clientId}
                                    className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors group"
                                  >
                                      <div>
                                          <p className="font-bold text-slate-800 group-hover:text-primary transition-colors">{item.clientName}</p>
                                          <p className="text-xs text-slate-500">Sua parte: {item.percentage}%</p>
                                      </div>
                                      <div className="text-right">
                                          <span className="block font-bold text-emerald-600">R$ {item.amount.toLocaleString('pt-BR')}</span>
                                          <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">Ver detalhes &rarr;</span>
                                      </div>
                                  </Link>
                              ))}
                          </div>
                      )}
                  </div>

                  <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-600">Total no Período</span>
                      <span className="font-bold text-xl text-emerald-700">R$ {totalCommission.toLocaleString('pt-BR')}</span>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};