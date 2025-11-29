import { User, Role, Client, Task, TaskStatus, Team } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Diretoria Corvo',
    email: 'admin@corvomarketing.com',
    role: Role.ADMIN,
    jobTitle: 'CEO / Diretor Geral',
    avatarUrl: 'https://ui-avatars.com/api/?name=Diretoria+Corvo&background=312e81&color=fff',
  },
  {
    id: 'u2',
    name: 'Roberto Silva',
    email: 'atendimento@corvomarketing.com',
    role: Role.USER,
    jobTitle: 'Gerente de Tráfego',
    avatarUrl: 'https://ui-avatars.com/api/?name=Roberto+Silva&background=6366f1&color=fff',
  },
  {
    id: 'u3',
    name: 'Ana Costa',
    email: 'redacao@corvomarketing.com',
    role: Role.USER,
    jobTitle: 'Copywriter Senior',
    avatarUrl: 'https://ui-avatars.com/api/?name=Ana+Costa&background=10b981&color=fff',
  },
  {
    id: 'u4',
    name: 'Lucas Designer',
    email: 'design@corvomarketing.com',
    role: Role.USER,
    jobTitle: 'Designer Gráfico',
    avatarUrl: 'https://ui-avatars.com/api/?name=Lucas+Designer&background=f59e0b&color=fff',
  },
];

export const MOCK_TEAMS: Team[] = [
  {
    id: 'team1',
    name: 'Meta Ads',
    description: 'Equipe responsável por Facebook e Instagram Ads.',
    memberIds: ['u2', 'u4'],
    photoUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'team2',
    name: 'Google Ads',
    description: 'Equipe de Search, YouTube e Display.',
    memberIds: ['u3'],
    photoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=200'
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
    assignedUserIds: ['u2', 'u3'],
    managerId: 'u2',
    teamId: 'team1',
    contractUrl: 'contract_mock.pdf',
    notes: 'Cliente prefere reuniões às terças-feiras.',
    commissions: [
        { userId: 'u2', percentage: 10 },
        { userId: 'u3', percentage: 5 }
    ],
    files: []
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
    assignedUserIds: ['u3', 'u4'],
    managerId: 'u3',
    teamId: 'team2',
    contractUrl: 'contract_mock.pdf',
    notes: 'Focar em fotos de pratos iluminados.',
    commissions: [
        { userId: 'u3', percentage: 10 },
        { userId: 'u4', percentage: 5 }
    ],
    files: []
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
    notes: 'Contrato suspenso temporariamente.',
    commissions: [],
    files: []
  },
  {
    id: 'c4',
    name: 'Academia FitLife',
    companyName: 'FitLife Gym',
    phone: '(11) 91234-5678',
    area: 'Saúde e Fitness',
    status: 'ACTIVE',
    monthlyFee: 3000,
    briefing: 'Campanha de Verão: Matrícula grátis. Foco em Instagram Stories e TikTok.',
    accessCredentials: 'FB Manager ID: 123456',
    assignedUserIds: ['u2', 'u4'],
    managerId: 'u2',
    teamId: 'team1',
    notes: 'Enviar relatório quinzenal.',
    commissions: [
        { userId: 'u2', percentage: 8 },
        { userId: 'u4', percentage: 5 }
    ],
    files: []
  },
  {
    id: 'c5',
    name: 'Dr. Lucas Dermato',
    companyName: 'Clínica Lucas Pele',
    phone: '(41) 99888-7766',
    area: 'Saúde',
    status: 'ACTIVE',
    monthlyFee: 4500,
    briefing: 'Captação de pacientes para procedimentos estéticos de alto valor (Botox, Preenchimento). Google Ads Rede de Pesquisa.',
    accessCredentials: 'GAds: 999-999-9999',
    assignedUserIds: ['u3'],
    managerId: 'u3',
    teamId: 'team2',
    notes: 'Cuidado com termos proibidos pelo CFM.',
    commissions: [
        { userId: 'u3', percentage: 15 }
    ],
    files: []
  },
  {
    id: 'c6',
    name: 'E-commerce ModaFina',
    companyName: 'ModaFina Store',
    phone: '(47) 96666-5555',
    area: 'Varejo',
    status: 'ACTIVE',
    monthlyFee: 8000,
    briefing: 'ROAS foco 5.0. Google Shopping e Meta Ads Catalog Sales.',
    accessCredentials: 'Shopify: admin@modafina',
    assignedUserIds: ['u2', 'u3', 'u4'],
    managerId: 'u2',
    teamId: 'team1',
    notes: 'Sazonalidade forte em datas comemorativas.',
    commissions: [
        { userId: 'u2', percentage: 10 },
        { userId: 'u3', percentage: 2 },
        { userId: 'u4', percentage: 3 }
    ],
    files: []
  },
  {
    id: 'c7',
    name: 'Construtora Horizonte',
    companyName: 'Horizonte Construções',
    phone: '(11) 94444-3333',
    area: 'Imobiliário',
    status: 'ACTIVE',
    monthlyFee: 6500,
    briefing: 'Lançamento do empreendimento "Vista Verde". Lead Generation Facebook Forms.',
    accessCredentials: 'CRM: Pipedrive API Key',
    assignedUserIds: ['u2'],
    managerId: 'u2',
    teamId: 'team1',
    commissions: [
        { userId: 'u2', percentage: 12 }
    ],
    files: []
  }
];

// GENERATE TASKS FOR ALL 2025
// This ensures that when the user switches months in the Dashboard, data changes.
const generate2025Tasks = (): Task[] => {
  const tasks: Task[] = [];
  const years = [2024, 2025];
  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Jan-Dec
  
  // Base tasks that repeat or vary per month
  const templates = [
      { title: 'Relatório Mensal', prefix: 'REL', daysOffset: 5, type: 'recurring' },
      { title: 'Planejamento de Conteúdo', prefix: 'PLAN', daysOffset: 1, type: 'recurring' },
      { title: 'Otimização de Campanhas', prefix: 'OPT', daysOffset: 15, type: 'recurring' },
      { title: 'Reunião de Alinhamento', prefix: 'MEET', daysOffset: 10, type: 'recurring' },
      { title: 'Criação de Criativos', prefix: 'DES', daysOffset: 20, type: 'random' }
  ];

  years.forEach(year => {
      months.forEach(month => {
          // For each active client, generate tasks
          MOCK_CLIENTS.filter(c => c.status === 'ACTIVE').forEach((client, clientIndex) => {
              
              // Determine if we should generate tasks for this client this month (add some randomness)
              // Clients have different loads
              const taskCount = Math.floor(Math.random() * 4) + 1; // 1 to 4 tasks per month

              for(let i=0; i < taskCount; i++) {
                  const template = templates[i % templates.length];
                  const userIndex = i % (client.assignedUserIds.length || 1);
                  const assignedUser = client.assignedUserIds[userIndex] || 'u1';
                  
                  // Date Logic
                  const day = Math.min(28, Math.max(1, template.daysOffset + Math.floor(Math.random() * 5)));
                  const dueDate = new Date(year, month, day);
                  const dueDateStr = dueDate.toISOString().split('T')[0];

                  // Status Logic: Past tasks are mostly Done, Future are Pending
                  const today = new Date();
                  let status = TaskStatus.PENDING;
                  let completedAt = undefined;

                  if (dueDate < today) {
                      // 80% chance it's done if in the past
                      if (Math.random() > 0.2) {
                          status = TaskStatus.DONE;
                          // Completed within 2 days of due date
                          const compDate = new Date(dueDate);
                          compDate.setDate(compDate.getDate() + (Math.random() > 0.5 ? 1 : -1));
                          completedAt = compDate.toISOString().split('T')[0];
                      } else {
                          status = TaskStatus.IN_PROGRESS; // Overdue/In Progress
                      }
                  }

                  tasks.push({
                      id: `t_${year}_${month}_${client.id}_${i}`,
                      title: `${template.title} - ${client.name}`,
                      description: `Tarefa gerada automaticamente para o ciclo ${month + 1}/${year}.`,
                      status: status,
                      clientId: client.id,
                      assignedToUserId: assignedUser,
                      createdByUserId: 'u1',
                      dueDate: dueDateStr,
                      completedAt: completedAt,
                      comments: []
                  });
              }
          });
      });
  });

  return tasks;
};

export const MOCK_TASKS: Task[] = generate2025Tasks();