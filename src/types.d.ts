export type PlanType = 'free' | 'standard' | 'premium' | 'enterprise';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  plan: PlanType;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  team_name: string;
  status: 'active' | 'archived' | 'completed';
  owner_id: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done' | 'backlog';
  priority: 'low' | 'medium' | 'high';
  assignee?: User;
}














