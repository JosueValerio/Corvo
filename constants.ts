import { User, Role, Client, Task, TaskStatus, Team } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Diretoria Corvo',
    email: 'admin@corvomarketing.com',
    role: Role.ADMIN,
    avatarUrl: 'https://ui-avatars.com/api/?name=Diretoria+Corvo&background=312e81&color=fff',
  },
  {
    id: 'u2',
    name: 'Gerente de Contas',
    email: 'atendimento@corvomarketing.com',
    role: Role.USER,
    avatarUrl: 'https://ui-avatars.com/api/?name=Gerente+Contas&background=6366f1&color=fff',
  },
  {
    id: 'u3',
    name: 'Redator Sênior',
    email: 'redacao@corvomarketing.com',
    role: Role.USER,
    avatarUrl: 'https://ui-avatars.com/api/?name=Redator+Senior&background=6366f1&color=fff',
  },
];

export const MOCK_TEAMS: Team[] = [
  {
    id: 'team1',
    name: 'Performance & Ads',
    description: 'Equipe responsável por tráfego pago e métricas.',
    memberIds: ['u2'],
    photoUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'team2',
    name: 'Conteúdo & Criativo',
    description: 'Redação, Design e Social Media.',
    memberIds: ['u3'],
    photoUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=200'
  }
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Grupo TechSolutions',
    companyName: 'TechSolutions Ltda',
    phone: '(11) 99999-1010',
    area: 'Tecnologia',
    status: 'ACTIVE',
    monthlyFee: 5500,
    briefing: 'Objetivo: Aumentar leads B2B via LinkedIn Ads. Linguagem corporativa, sóbria. Foco em tecnologia de nuvem.',
    accessCredentials: 'LinkedIn: social@techsolutions / SenhaSegura123',
    assignedUserIds: ['u2'],
    managerId: 'u2',
    teamId: 'team1',
    contractUrl: 'contract_mock.pdf',
    notes: 'Cliente prefere reuniões às terças-feiras.'
  },
  {
    id: 'c2',
    name: 'Bistrô La Vie',
    companyName: 'La Vie Gastronomia',
    phone: '(21) 98888-2020',
    area: 'Gastronomia',
    status: 'ACTIVE',
    monthlyFee: 2200,
    briefing: 'Objetivo: Tráfego local para almoço executivo. Reels diários mostrando os pratos. Estilo visual: Elegante e Apetitoso.',
    accessCredentials: 'Instagram: @bistrolavie / Croissant2024',
    assignedUserIds: ['u3'],
    managerId: 'u3',
    teamId: 'team2',
    contractUrl: 'contract_mock.pdf',
    notes: 'Focar em fotos de pratos iluminados.'
  },
  {
    id: 'c3',
    name: 'Advocacia Mendes',
    companyName: 'Mendes Associados',
    phone: '(31) 97777-3030',
    area: 'Jurídico',
    status: 'INACTIVE',
    monthlyFee: 4000,
    briefing: 'Reformulação de identidade visual e site institucional.',
    accessCredentials: '',
    assignedUserIds: ['u1'],
    managerId: 'u1',
    teamId: undefined,
    contractUrl: '#',
    notes: 'Contrato suspenso temporariamente.'
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Planejamento Editorial: Mês das Mães',
    description: 'Criar 12 posts para o feed e 20 stories cobrindo a campanha de dia das mães. Focar em emoção.',
    status: TaskStatus.PENDING,
    clientId: 'c2',
    assignedToUserId: 'u3',
    createdByUserId: 'u1',
    dueDate: '2023-11-15',
    comments: [
      { id: 'cm1', userId: 'u1', userName: 'Diretoria Corvo', text: 'Lembre de usar as cores da paleta nova.', createdAt: '2023-11-01T10:00:00Z'}
    ]
  },
  {
    id: 't2',
    title: 'Revisão de Artigo: Cloud Computing',
    description: 'Revisar gramática e SEO do artigo sobre AWS vs Azure.',
    status: TaskStatus.IN_PROGRESS,
    clientId: 'c1',
    assignedToUserId: 'u2',
    createdByUserId: 'u1',
    dueDate: '2023-11-20',
    comments: []
  },
  {
    id: 't3',
    title: 'Assinatura Renovação Contrato',
    description: 'Enviar minuta atualizada para o setor jurídico do cliente.',
    status: TaskStatus.PENDING,
    clientId: 'c3',
    assignedToUserId: 'u1',
    createdByUserId: 'u1',
    dueDate: '2023-11-10',
    comments: []
  },
];