import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Role, TaskStatus, Client, Task } from '../types';
import { generateBriefingSuggestions } from '../services/gemini';
import { TaskModal } from '../components/TaskModal';
import { Save, Trash, FileText, Lock, CheckSquare, Wand2, Eye, EyeOff, UploadCloud, Download, AlertTriangle, Edit2, X, Phone, Building, Briefcase, UserCircle, Users, DollarSign, File as FileIcon, Paperclip } from 'lucide-react';

type Tab = 'BRIEFING' | 'ACCESS' | 'TASKS' | 'FILES' | 'CONTRACT';

export const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, users, teams, tasks, auth, updateClient, deleteClient, addTask, updateTask, deleteTask, uploadContract, deleteContract, uploadClientFile, deleteClientFile } = useApp();
  
  const [activeTab, setActiveTab] = useState<Tab>('BRIEFING');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Task Modal
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Contract/File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Client Data States (for direct editing in tabs)
  const [briefing, setBriefing] = useState('');
  const [credentials, setCredentials] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Edit Client Modal State
  const [editFormData, setEditFormData] = useState<Partial<Client>>({});

  const client = clients.find(c => c.id === id);
  const isAdmin = auth.user?.role === Role.ADMIN;

  // Resolve Relations
  const manager = users.find(u => u.id === client?.managerId);
  const team = teams.find(t => t.id === client?.teamId);

  useEffect(() => {
    if (client) {
      setBriefing(client.briefing);
      setCredentials(client.accessCredentials);
      setEditFormData(client);
    }
  }, [client]);

  if (!client) return <div>Cliente não encontrado</div>;

  if (!isAdmin && !client.assignedUserIds.includes(auth.user?.id || '')) {
      return <div className="p-12 text-center text-red-500 font-bold bg-white rounded-xl shadow">🚫 Acesso Negado.</div>
  }

  // --- Handlers ---

  const handleSaveTabContent = () => {
    updateClient({
        ...client,
        briefing,
        accessCredentials: credentials
    });
    alert('Conteúdo atualizado com sucesso.');
  };

  const handleUpdateClientInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if(editFormData.id) {
        updateClient(editFormData as Client);
        setIsEditModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('ATENÇÃO: Isso removerá permanentemente o cliente. Continuar?')) {
        deleteClient(client.id);
        navigate('/clients');
    }
  };

  const handleGenerateAI = async () => {
    setIsLoadingAI(true);
    const suggestion = await generateBriefingSuggestions(client.name, briefing);
    setBriefing(prev => prev + '\n\n--- SUGESTÃO CORVO AI ---\n' + suggestion);
    setIsLoadingAI(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
        id: `t${Date.now()}`,
        title: newTaskTitle,
        status: TaskStatus.PENDING,
        clientId: client.id,
        assignedToUserId: auth.user?.id,
        createdByUserId: auth.user?.id || '',
        comments: []
    });
    setNewTaskTitle('');
  };

  // Contract Upload
  const handleContractUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type !== 'application/pdf') {
            alert('Apenas arquivos PDF são permitidos.');
            return;
        }
        setIsUploading(true);
        setUploadProgress(0);
        try {
            await uploadContract(client.id, file, (progress) => setUploadProgress(progress));
        } catch (error) {
            console.error(error);
            alert('Erro ao fazer upload.');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    }
  };

  // Generic File Upload (Max 64MB)
  const handleGenericFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        
        // Check size (64MB)
        const maxSize = 64 * 1024 * 1024; // 64MB in bytes
        if (file.size > maxSize) {
            alert('O arquivo excede o limite de 64MB.');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        try {
            await uploadClientFile(client.id, file, (progress) => setUploadProgress(progress));
        } catch (error) {
            console.error(error);
            alert('Erro ao enviar arquivo.');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    }
  };

  // Commission Handler
  const handleCommissionChange = (userId: string, percentage: number) => {
      const currentCommissions = editFormData.commissions || [];
      const existingIndex = currentCommissions.findIndex(c => c.userId === userId);
      
      let newCommissions = [...currentCommissions];
      if (existingIndex >= 0) {
          if (percentage === 0) {
              newCommissions = newCommissions.filter(c => c.userId !== userId);
          } else {
              newCommissions[existingIndex] = { userId, percentage };
          }
      } else if (percentage > 0) {
          newCommissions.push({ userId, percentage });
      }
      
      setEditFormData({ ...editFormData, commissions: newCommissions });
  };

  const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clientTasks = tasks.filter(t => t.clientId === client.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-slate-900">{client.name}</h1>
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${client.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {client.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                    {client.companyName && <span className="flex items-center gap-1"><Building size={14}/> {client.companyName}</span>}
                    {client.area && <span className="flex items-center gap-1"><Briefcase size={14}/> {client.area}</span>}
                    {client.phone && <span className="flex items-center gap-1"><Phone size={14}/> {client.phone}</span>}
                </div>
                
                {/* Manager & Team Display */}
                <div className="flex gap-4 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm">
                        <UserCircle size={16} className="text-primary"/>
                        <span className="text-slate-500">Gestor:</span>
                        <span className="font-medium text-slate-900">{manager ? manager.name : 'Não atribuído'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Users size={16} className="text-primary"/>
                        <span className="text-slate-500">Time:</span>
                        <span className="font-medium text-slate-900">{team ? team.name : 'Geral'}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-3">
                {isAdmin && (
                    <button onClick={() => setIsEditModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:border-primary hover:text-primary transition-colors font-medium shadow-sm">
                        <Edit2 size={16} /> Editar Dados
                    </button>
                )}
                <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash size={18} />
                </button>
            </div>
        </div>
        {client.notes && (
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-sm text-indigo-900 italic">
                "{client.notes}"
            </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto bg-white/50 backdrop-blur-sm px-6 rounded-t-xl">
        {[
            { id: 'BRIEFING', label: 'Briefing & Estratégia', icon: FileText },
            { id: 'ACCESS', label: 'Segurança & Acessos', icon: Lock },
            { id: 'TASKS', label: `Tarefas (${clientTasks.length})`, icon: CheckSquare },
            { id: 'FILES', label: `Arquivos (${client.files?.length || 0})`, icon: Paperclip },
            ...(isAdmin ? [{ id: 'CONTRACT', label: 'Contrato', icon: FileText }] : [])
        ].map(tab => (
            <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)} 
                className={`flex items-center gap-2 py-4 font-medium text-sm transition-all border-b-2 ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
                <tab.icon size={16} />
                {tab.label}
            </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white p-8 rounded-b-xl shadow-sm border border-slate-200 min-h-[500px]">
        
        {/* BRIEFING TAB */}
        {activeTab === 'BRIEFING' && (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-slate-800">Briefing do Cliente</h2>
                    <div className="flex gap-2">
                         <button 
                            onClick={handleGenerateAI} 
                            disabled={isLoadingAI}
                            className="flex items-center gap-2 text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-4 py-2 rounded-lg shadow-sm transition-all disabled:opacity-70"
                        >
                            <Wand2 size={16} />
                            {isLoadingAI ? 'Corvo AI...' : 'Expandir com IA'}
                        </button>
                        <button onClick={handleSaveTabContent} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-900 transition-colors shadow-md text-sm font-medium">Salvar</button>
                    </div>
                </div>
                <textarea 
                    value={briefing}
                    onChange={(e) => setBriefing(e.target.value)}
                    className="w-full h-96 p-6 rounded-xl border border-indigo-900/30 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none font-mono text-sm leading-relaxed shadow-inner placeholder-slate-500"
                    placeholder="Descreva o briefing..."
                />
            </div>
        )}

        {/* ACCESS TAB */}
        {activeTab === 'ACCESS' && (
            <div className="space-y-6">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg text-sm text-amber-800 flex items-start gap-3">
                    <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                    <div>
                        <strong className="block mb-1 font-bold">Ambiente Seguro</strong>
                        Dados sensíveis são visualizados apenas por usuários autorizados. 
                    </div>
                </div>
                
                <div className="relative group">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-slate-700">Credenciais & Notas Seguras</label>
                        <button onClick={handleSaveTabContent} className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-indigo-900 text-xs font-medium">Salvar</button>
                    </div>
                    
                    <textarea 
                        value={credentials}
                        onChange={(e) => setCredentials(e.target.value)}
                        className={`w-full h-64 p-6 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-primary outline-none font-mono text-sm transition-all ${!showPassword ? 'blur-sm select-none opacity-50' : 'opacity-100'}`}
                        placeholder="Login: admin / Senha: ..."
                        readOnly={!showPassword} 
                    />
                    <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-12 right-4 bg-white p-2 rounded-lg shadow-md border border-slate-200 text-slate-600 hover:text-primary z-10"
                    >
                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                </div>
            </div>
        )}

        {/* TASKS TAB */}
        {activeTab === 'TASKS' && (
            <div className="space-y-6">
                <form onSubmit={handleAddTask} className="flex gap-3">
                    <input 
                        type="text" 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Adicionar nova tarefa..." 
                        className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary outline-none shadow-sm bg-white text-slate-900"
                    />
                    <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-black font-medium transition-colors">
                        Adicionar
                    </button>
                </form>

                <div className="space-y-3">
                    {clientTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group bg-white shadow-sm cursor-pointer" onClick={() => setSelectedTask(task)}>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateTask({...task, status: task.status === TaskStatus.DONE ? TaskStatus.PENDING : TaskStatus.DONE})
                                    }}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === TaskStatus.DONE ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-primary'}`}
                                >
                                    {task.status === TaskStatus.DONE && <CheckSquare size={14} />}
                                </button>
                                <div>
                                    <span className={`font-medium block ${task.status === TaskStatus.DONE ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</span>
                                    <span className="text-xs text-slate-400">Entrega: {task.dueDate || 'Sem data'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${task.status === TaskStatus.DONE ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {task.status === TaskStatus.DONE ? 'Concluída' : 'Pendente'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* FILES TAB (NEW) */}
        {activeTab === 'FILES' && (
             <div className="space-y-6">
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-indigo-50/50 transition-colors">
                    {isUploading ? (
                        <div className="text-center w-full max-w-xs">
                            <div className="flex justify-between text-xs text-slate-500 mb-1 font-bold uppercase">
                                <span>Enviando...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2">
                                <div className="bg-primary h-2.5 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                            <p className="text-primary font-medium text-sm animate-pulse">Processando arquivo...</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <UploadCloud size={32} className="text-primary" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">Upload de Arquivos</h3>
                            <p className="text-sm text-slate-500 mb-6">Todos os formatos aceitos. Tamanho máximo: 64MB.</p>
                            <label className="cursor-pointer bg-primary text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-indigo-700 transition-colors">
                                Selecionar Arquivo
                                <input type="file" onChange={handleGenericFileUpload} className="hidden" />
                            </label>
                        </>
                    )}
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Arquivos Enviados ({client.files?.length || 0})</h3>
                    {(!client.files || client.files.length === 0) && (
                        <p className="text-center text-slate-400 italic py-8">Nenhum arquivo encontrado.</p>
                    )}
                    {client.files?.map(file => {
                        const uploader = users.find(u => u.id === file.uploadedByUserId);
                        return (
                            <div key={file.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-primary/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                        <FileIcon size={20}/>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 truncate max-w-[200px] md:max-w-md">{file.name}</p>
                                        <p className="text-xs text-slate-500 flex items-center gap-2">
                                            <span>{formatFileSize(file.size)}</span>
                                            <span>•</span>
                                            <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>Enviado por {uploader?.name || 'Desconhecido'}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a 
                                        href={file.url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        download={file.name}
                                        className="p-2 text-slate-500 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors" 
                                        title="Baixar"
                                    >
                                        <Download size={18}/>
                                    </a>
                                    <button 
                                        onClick={() => {
                                            if(window.confirm('Excluir este arquivo?')) deleteClientFile(client.id, file.id);
                                        }}
                                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash size={18}/>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
             </div>
        )}

        {/* CONTRACT TAB */}
        {activeTab === 'CONTRACT' && isAdmin && (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                
                {client.contractUrl && client.contractUrl !== '#' ? (
                    <div className="text-center w-full max-w-md animate-fade-in">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4 inline-block">
                            <FileText size={48} className="text-emerald-600" />
                        </div>
                        <h3 className="text-slate-900 font-bold text-lg mb-1">Contrato Vigente</h3>
                        <p className="text-slate-500 text-sm mb-8">Documento armazenado e vinculado.</p>
                        
                        <div className="flex gap-4 justify-center mb-8">
                            <a 
                                href={client.contractUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm font-medium"
                            >
                                <Download size={18} /> Visualizar PDF
                            </a>
                            <button 
                                onClick={() => {
                                    if(window.confirm('Tem certeza que deseja remover o contrato atual?')) {
                                        deleteContract(client.id);
                                    }
                                }} 
                                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-all shadow-sm font-medium"
                            >
                                <Trash size={18} /> Remover
                            </button>
                        </div>

                        <div className="relative border-t border-slate-200 pt-6">
                            <p className="text-xs text-slate-400 uppercase font-bold mb-3">Substituir Documento</p>
                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm">
                                <UploadCloud size={16} />
                                <span>Escolher novo arquivo...</span>
                                <input 
                                    type="file" 
                                    accept=".pdf" 
                                    onChange={handleContractUpload} 
                                    className="hidden" 
                                />
                            </label>
                            {isUploading && (
                                <div className="mt-3 w-full max-w-[200px] mx-auto">
                                    <div className="w-full bg-indigo-100 rounded-full h-1.5">
                                        <div className="bg-indigo-600 h-1.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                    <p className="text-[10px] text-indigo-600 mt-1 text-center">Enviando {uploadProgress}%</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center w-full max-w-md">
                        <div className="bg-indigo-50 p-6 rounded-full inline-block mb-4">
                            <UploadCloud size={40} className="text-indigo-600" />
                        </div>
                        <h3 className="text-slate-900 font-bold text-xl mb-2">Upload de Contrato</h3>
                        <p className="text-slate-500 text-sm mb-8 px-8">Nenhum contrato vinculado a este cliente. Faça upload do PDF para arquivamento seguro.</p>
                        
                        {isUploading ? (
                             <div className="flex flex-col items-center justify-center gap-3 text-indigo-600 p-8 bg-white rounded-xl shadow-sm border border-indigo-100">
                                <div className="w-full bg-indigo-100 rounded-full h-2">
                                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-100" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                                <span className="font-medium animate-pulse text-sm">Carregando {uploadProgress}%</span>
                             </div>
                        ) : (
                            <label className="cursor-pointer relative group block w-full">
                                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 rounded-lg transition-opacity"></div>
                                <div className="relative flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-lg hover:bg-indigo-800 transition-all shadow-lg transform group-hover:-translate-y-0.5">
                                    <UploadCloud size={24} />
                                    <span className="font-bold">Selecionar Arquivo PDF</span>
                                </div>
                                <input 
                                    type="file" 
                                    accept=".pdf" 
                                    onChange={handleContractUpload} 
                                    className="hidden" 
                                />
                            </label>
                        )}
                        <p className="text-xs text-slate-400 mt-4">Formatos aceitos: PDF (Max 10MB)</p>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Edit Client Modal */}
      {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Editar Cliente</h2>
                    <button onClick={() => setIsEditModalOpen(false)}><X size={24} className="text-slate-400 hover:text-slate-600"/></button>
                  </div>
                  
                  <form onSubmit={handleUpdateClientInfo} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Cliente</label>
                            <input required type="text" className="w-full border p-2 rounded bg-white text-slate-900" value={editFormData.name || ''} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Empresa (Razão Social)</label>
                            <input type="text" className="w-full border p-2 rounded bg-white text-slate-900" value={editFormData.companyName || ''} onChange={e => setEditFormData({...editFormData, companyName: e.target.value})} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                            <input type="text" className="w-full border p-2 rounded bg-white text-slate-900" value={editFormData.phone || ''} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Área de Atuação</label>
                            <input type="text" className="w-full border p-2 rounded bg-white text-slate-900" value={editFormData.area || ''} onChange={e => setEditFormData({...editFormData, area: e.target.value})} />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Gestor Responsável</label>
                            <select 
                                className="w-full border p-2 rounded bg-white text-slate-900"
                                value={editFormData.managerId || ''}
                                onChange={e => setEditFormData({...editFormData, managerId: e.target.value})}
                            >
                                <option value="">Selecione um gestor...</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Time Responsável</label>
                            <select 
                                className="w-full border p-2 rounded bg-white text-slate-900"
                                value={editFormData.teamId || ''}
                                onChange={e => setEditFormData({...editFormData, teamId: e.target.value})}
                            >
                                <option value="">Selecione um time...</option>
                                {teams.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                      </div>
                      
                      {/* Commissions Section */}
                      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                           <h3 className="text-sm font-bold text-emerald-900 mb-3 flex items-center gap-2">
                               <DollarSign size={16}/> Comissões (% do Mensal)
                           </h3>
                           <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                               {users.map(u => {
                                   const currentComm = editFormData.commissions?.find(c => c.userId === u.id)?.percentage || 0;
                                   return (
                                       <div key={u.id} className="flex justify-between items-center bg-white p-2 rounded border border-emerald-100">
                                            <span className="text-sm text-slate-700">{u.name}</span>
                                            <div className="flex items-center gap-1">
                                                <input 
                                                    type="number" 
                                                    min="0" 
                                                    max="100" 
                                                    className="w-16 border p-1 rounded text-right"
                                                    value={currentComm}
                                                    onChange={(e) => handleCommissionChange(u.id, Number(e.target.value))}
                                                />
                                                <span className="text-sm text-slate-500">%</span>
                                            </div>
                                       </div>
                                   )
                               })}
                           </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                          <select className="w-full border p-2 rounded bg-white text-slate-900" value={editFormData.status || 'ACTIVE'} onChange={e => setEditFormData({...editFormData, status: e.target.value as any})}>
                              <option value="ACTIVE">Ativo</option>
                              <option value="INACTIVE">Inativo</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Notas Internas</label>
                          <textarea className="w-full border p-2 rounded bg-white text-slate-900" rows={3} value={editFormData.notes || ''} onChange={e => setEditFormData({...editFormData, notes: e.target.value})} />
                      </div>

                      <div className="flex gap-2 justify-end mt-6">
                          <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
                          <button type="submit" className="px-6 py-2 bg-primary text-white rounded hover:bg-indigo-700">Salvar Alterações</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal 
            task={selectedTask}
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={updateTask}
            users={users}
            currentUser={auth.user}
        />
      )}
    </div>
  );
};