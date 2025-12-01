import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Client, Task, AuthState, Role, Team, ClientFile } from '../types';
import { MOCK_CLIENTS, MOCK_TASKS, MOCK_USERS, MOCK_TEAMS } from '../constants';

interface AppContextType {
  auth: AuthState;
  users: User[];
  clients: Client[];
  tasks: Task[];
  teams: Team[];
  
  // Auth & Profile
  login: (email: string) => void;
  logout: () => void;
  updateUserProfile: (id: string, name: string, email: string, avatarUrl?: string) => void;

  // User Management (Admin)
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;

  // Clients
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void; // Full update (PUT)
  deleteClient: (id: string) => void;
  uploadContract: (clientId: string, file: File, onProgress?: (progress: number) => void) => Promise<void>;
  deleteContract: (clientId: string) => void;
  uploadClientFile: (clientId: string, file: File, onProgress?: (progress: number) => void) => Promise<void>; // New
  deleteClientFile: (clientId: string, fileId: string) => void; // New

  // Tasks
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;

  // Teams
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);

  // --- Auth & User ---
  const login = (email: string) => {
    const user = users.find((u) => u.email === email);
    if (user) {
      setAuth({ user, isAuthenticated: true });
    } else {
      alert('Usuário não encontrado. Tente admin@corvomarketing.com');
    }
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  const updateUserProfile = (id: string, name: string, email: string, avatarUrl?: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, name, email, avatarUrl: avatarUrl || u.avatarUrl } : u));
    
    // Update auth state if it's the current user
    if (auth.user?.id === id) {
        setAuth(prev => ({
            ...prev,
            user: { ...prev.user!, name, email, avatarUrl: avatarUrl || prev.user?.avatarUrl }
        }));
    }
  };

  // --- User CRUD (Admin) ---
  const addUser = (user: User) => setUsers([...users, user]);
  
  const updateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // --- Clients ---
  const addClient = (client: Client) => setClients([...clients, client]);
  
  const updateClient = (updatedClient: Client) => {
    setClients(clients.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
  };
  
  const deleteClient = (id: string) => setClients(clients.filter((c) => c.id !== id));

  const simulateProgress = (onProgress?: (p: number) => void) => {
      return new Promise<void>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
              progress += 10;
              if (onProgress) onProgress(progress);
              if (progress >= 100) {
                  clearInterval(interval);
                  resolve();
              }
          }, 150); // Total ~1.5s
      });
  };

  const uploadContract = async (clientId: string, file: File, onProgress?: (progress: number) => void): Promise<void> => {
    await simulateProgress(onProgress);
    setClients(prev => prev.map(c => 
        c.id === clientId ? { ...c, contractUrl: URL.createObjectURL(file) } : c
    ));
  };

  const deleteContract = (clientId: string) => {
    setClients(prev => prev.map(c => 
        c.id === clientId ? { ...c, contractUrl: undefined } : c
    ));
  };

  const uploadClientFile = async (clientId: string, file: File, onProgress?: (progress: number) => void): Promise<void> => {
    await simulateProgress(onProgress);
    
    const newFile: ClientFile = {
      id: `f${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size,
      uploadedByUserId: auth.user?.id || 'unknown',
      uploadedAt: new Date().toISOString()
    };

    setClients(prev => prev.map(c => 
      c.id === clientId 
        ? { ...c, files: [...(c.files || []), newFile] }
        : c
    ));
  };

  const deleteClientFile = (clientId: string, fileId: string) => {
     setClients(prev => prev.map(c => 
       c.id === clientId 
        ? { ...c, files: c.files?.filter(f => f.id !== fileId) || [] }
        : c
     ));
  };

  // --- Tasks ---
  const addTask = (task: Task) => setTasks([...tasks, task]);
  
  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };
  
  const deleteTask = (id: string) => setTasks(tasks.filter((t) => t.id !== id));

  // --- Teams ---
  const addTeam = (team: Team) => setTeams([...teams, team]);
  const updateTeam = (team: Team) => setTeams(teams.map(t => t.id === team.id ? team : t));
  const deleteTeam = (id: string) => setTeams(teams.filter(t => t.id !== id));

  return (
    <AppContext.Provider
      value={{
        auth,
        users,
        clients,
        tasks,
        teams,
        login,
        logout,
        updateUserProfile,
        addUser,
        updateUser,
        deleteUser,
        addClient,
        updateClient,
        deleteClient,
        uploadContract,
        deleteContract,
        uploadClientFile,
        deleteClientFile,
        addTask,
        updateTask,
        deleteTask,
        addTeam,
        updateTeam,
        deleteTeam
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};