import React, { useState } from 'react';
import { Task, TaskStatus, User, TaskComment } from '../types';
import { X, Calendar, User as UserIcon, MessageSquare, Send } from 'lucide-react';

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  users: User[];
  currentUser: User | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onUpdate, users, currentUser }) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [newComment, setNewComment] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate(editedTask);
    onClose();
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;
    const comment: TaskComment = {
        id: `cm${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        text: newComment,
        createdAt: new Date().toISOString()
    };
    setEditedTask({ ...editedTask, comments: [...(editedTask.comments || []), comment] });
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50 rounded-t-xl">
            <div className="flex-1">
                <input 
                    type="text" 
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                    className="text-xl font-bold bg-transparent border-none focus:ring-0 w-full text-slate-900 placeholder-slate-400"
                    placeholder="Título da Tarefa"
                />
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Status:</span>
                    <select 
                        value={editedTask.status}
                        onChange={(e) => setEditedTask({...editedTask, status: e.target.value as TaskStatus})}
                        className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                            editedTask.status === TaskStatus.DONE ? 'bg-emerald-100 text-emerald-700' :
                            editedTask.status === TaskStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                        }`}
                    >
                        <option value={TaskStatus.PENDING}>Pendente</option>
                        <option value={TaskStatus.IN_PROGRESS}>Em Andamento</option>
                        <option value={TaskStatus.DONE}>Concluído</option>
                    </select>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={24}/></button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Description */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição</label>
                <textarea 
                    value={editedTask.description || ''}
                    onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                    className="w-full h-32 p-3 border border-slate-200 rounded-lg text-slate-900 bg-white focus:ring-2 focus:ring-primary outline-none resize-none"
                    placeholder="Adicione detalhes sobre essa tarefa..."
                />
            </div>

            {/* Meta Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                        <UserIcon size={14}/> Responsável
                    </label>
                    <select 
                        value={editedTask.assignedToUserId || ''}
                        onChange={(e) => setEditedTask({...editedTask, assignedToUserId: e.target.value})}
                        className="w-full bg-transparent text-sm font-medium text-slate-900 border-none focus:ring-0 p-0"
                    >
                        <option value="">Sem atribuição</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                        <Calendar size={14}/> Data de Entrega
                    </label>
                    <input 
                        type="date"
                        value={editedTask.dueDate || ''}
                        onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                        className="w-full bg-transparent text-sm font-medium text-slate-900 border-none focus:ring-0 p-0"
                    />
                </div>
            </div>

            {/* Comments Section */}
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <MessageSquare size={16}/> Comentários
                </h3>
                <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                    {(editedTask.comments || []).length === 0 && <p className="text-xs text-slate-400 italic">Nenhum comentário ainda.</p>}
                    {(editedTask.comments || []).map(comment => (
                        <div key={comment.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-indigo-700">{comment.userName}</span>
                                <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-slate-700">{comment.text}</p>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escreva um comentário..."
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 focus:outline-none focus:border-primary"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button onClick={handleAddComment} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-colors">
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium">Cancelar</button>
            <button onClick={handleSave} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-800 transition-colors shadow-lg font-medium">Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
};