import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Database, Server, Shield, Layout } from 'lucide-react';

export const Documentation: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Manual Técnico Corvo Marketing</h1>
            <p className="text-indigo-200">Versão 1.0 • Sistema de Gestão de Agência</p>
        </div>
        <div className="absolute -right-10 -bottom-20 opacity-10 text-white">
            <Layout size={200} />
        </div>
      </div>

      {/* Architecture Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><Server size={20} className="text-primary"/> Arquitetura & Stack</h2>
            <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex justify-between border-b pb-2"><span>Frontend</span> <strong className="text-slate-900">React 18 + TypeScript</strong></li>
                <li className="flex justify-between border-b pb-2"><span>Estilização</span> <strong className="text-slate-900">Tailwind CSS (Tema Corvo)</strong></li>
                <li className="flex justify-between border-b pb-2"><span>State Management</span> <strong className="text-slate-900">Context API</strong></li>
                <li className="flex justify-between border-b pb-2"><span>Inteligência Artificial</span> <strong className="text-slate-900">Google Gemini Flash 2.5</strong></li>
                <li className="flex justify-between"><span>Deploy Alvo</span> <strong className="text-slate-900">Vercel / Netlify</strong></li>
            </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><Database size={20} className="text-primary"/> Modelagem de Dados</h2>
            <div className="bg-slate-900 text-indigo-100 p-4 rounded-lg font-mono text-xs overflow-auto h-48">
{`interface Client {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  monthlyFee: number;
  briefing: string; // Markdown supported
  accessCredentials: string; // Encrypted field
  contractUrl: string; // S3 Bucket URL
  assignedUserIds: string[]; // Many-to-Many
}

interface Task {
  id: string;
  title: string;
  status: 'PENDING' | 'DONE';
  clientId: string; // Foreign Key
  assignedToUserId?: string;
}

interface User {
  id: string;
  role: 'ADMIN' | 'USER'; // RBAC
}`}
            </div>
        </div>
      </div>

      {/* Feature Checklist (Green/Yellow/Red) */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Roadmap de Funcionalidades</h2>
        
        <div className="space-y-8">
            {/* Version 1.0 */}
            <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Versão 1.0 (Essencial - Entregue)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        "Dashboard Global & Individual",
                        "Gestão de Clientes (CRUD)",
                        "Integração Google Gemini IA",
                        "Controle de Permissões (Admin/User)",
                        "Gestão de Tarefas Simples",
                        "Design System 'Corvo Marketing'",
                        "Upload de Contratos (Simulado)",
                        "Área de Acessos Seguros"
                    ].map(item => (
                        <div key={item} className="flex items-center gap-2 text-slate-700 bg-emerald-50/50 p-2 rounded border border-emerald-100">
                            <CheckCircle size={16} className="text-emerald-500" />
                            <span className="text-sm font-medium">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-slate-100"/>

            {/* Version 2.0 */}
            <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Versão 2.0 (Backlog - Futuro)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        "Integração Real com S3 (AWS) para PDF",
                        "Notificações por Email (SMTP)",
                        "Login com Google/SSO",
                        "Chat Interno no Contexto do Cliente",
                        "Histórico de Alterações (Audit Log Completo)"
                    ].map(item => (
                        <div key={item} className="flex items-center gap-2 text-slate-600 bg-amber-50/50 p-2 rounded border border-amber-100">
                            <div className="w-4 h-4 border-2 border-amber-400 rounded-full"></div>
                            <span className="text-sm">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-slate-100"/>

            {/* Critical Verification */}
            <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-red-600 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Pontos de Atenção (Verificar Urgente)
                </h3>
                <div className="space-y-2">
                    <div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg border border-red-100">
                        <Shield className="text-red-600 mt-0.5" size={20} />
                        <div>
                            <strong className="text-red-900 block text-sm">Criptografia de Dados</strong>
                            <p className="text-red-800 text-sm">O armazenamento de senhas de clientes no banco de dados exige criptografia de ponta (AES-256). Alternativa recomendada: Armazenar apenas links para cofres seguros (LastPass/1Password).</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg border border-red-100">
                        <AlertTriangle className="text-red-600 mt-0.5" size={20} />
                        <div>
                            <strong className="text-red-900 block text-sm">LGPD & Compliance</strong>
                            <p className="text-red-800 text-sm">Necessário termo de aceite para os usuários da agência sobre a confidencialidade dos dados visualizados.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};