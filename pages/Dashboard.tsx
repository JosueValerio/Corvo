import React from 'react';
import { useApp } from '../context/AppContext';
import { Role, TaskStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, Clock, Users, DollarSign, Briefcase, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#312e81', '#6366f1', '#94a3b8', '#cbd5e1'];

export const Dashboard: React.FC = () => {
  const { auth, clients, tasks } = useApp();
  const isAdmin = auth.user?.role === Role.ADMIN;

  // Filter logic
  const myClients = isAdmin ? clients : clients.filter(c => c.assignedUserIds.includes(auth.user?.id || ''));
  const myTasks = isAdmin 
    ? tasks 
    : tasks.filter(t => t.assignedToUserId === auth.user?.id);

  const pendingTasks = myTasks.filter(t => t.status === TaskStatus.PENDING).length;
  const inProgressTasks = myTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const doneTasks = myTasks.filter(t => t.status === TaskStatus.DONE).length;

  const totalRevenue = isAdmin 
    ? clients.reduce((acc, c) => c.status === 'ACTIVE' ? acc + c.monthlyFee : acc, 0) 
    : 0;

  // Chart Data
  const taskStatusData = [
    { name: 'Pendentes', value: pendingTasks },
    { name: 'Em Andamento', value: inProgressTasks },
    { name: 'Concluídas', value: doneTasks },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Visão geral de desempenho e atividades.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Clientes Ativos</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{myClients.filter(c => c.status === 'ACTIVE').length}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Users size={28} /></div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pendências</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{pendingTasks}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Clock size={28} /></div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Entregas</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{doneTasks}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={28} /></div>
        </div>

        {isAdmin && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">MRR (Mensal)</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">R$ {totalRevenue.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-3 bg-slate-900 text-white rounded-lg"><DollarSign size={28} /></div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><Briefcase size={20}/> Produtividade da Equipe</h2>
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
            <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2"><PieChartIcon size={20}/> Distribuição de Tarefas</h2>
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
    </div>
  );
};