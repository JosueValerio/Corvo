export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  photoUrl?: string;
  memberIds: string[];
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string; // New
  status: TaskStatus;
  assignedToUserId?: string; 
  clientId: string;
  dueDate?: string;
  createdByUserId: string; // New
  comments: TaskComment[]; // New
}

export interface Client {
  id: string;
  name: string; // Client Name (Person or Entity)
  companyName?: string; // New
  phone?: string; // New
  area?: string; // New (e.g. Technology, Food)
  notes?: string; // New
  status: 'ACTIVE' | 'INACTIVE';
  monthlyFee: number;
  briefing: string;
  accessCredentials: string; 
  contractUrl?: string; 
  assignedUserIds: string[]; // Users with specific access
  managerId?: string; // Responsible Account Manager
  teamId?: string; // Responsible Squad/Team
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}