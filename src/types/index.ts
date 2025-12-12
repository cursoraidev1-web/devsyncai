import { Request } from 'express';

// ==================== USER TYPES ====================

export enum UserRole {
  ADMIN = 'admin',
  PRODUCT_MANAGER = 'product_manager',
  PRODUCT_OWNER = 'product_owner',
  DEVELOPER = 'developer',
  DESIGNER = 'designer',
  QA_TESTER = 'qa_tester',
  DEVOPS = 'devops',
  VIEWER = 'viewer',
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends User {
  access_token: string;
  refresh_token?: string;
}

// ==================== PROJECT TYPES ====================

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: UserRole;
  joined_at: string;
}

// ==================== PRD TYPES ====================

export enum PRDStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface PRD {
  id: string;
  project_id: string;
  title: string;
  content: string;
  status: PRDStatus;
  version: number;
  created_by: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

// ==================== TASK TYPES ====================

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  IN_QA = 'in_qa',
  BLOCKED = 'blocked',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface Task {
  id: string;
  project_id: string;
  prd_id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: string;
  created_by: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

// ==================== NOTIFICATION TYPES ====================

export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_STATUS_CHANGED = 'task_status_changed',
  PRD_APPROVED = 'prd_approved',
  PRD_REJECTED = 'prd_rejected',
  COMMENT_MENTION = 'comment_mention',
  DEPLOYMENT_SUCCESS = 'deployment_success',
  DEPLOYMENT_FAILED = 'deployment_failed',
  INTEGRATION_CONNECTED = 'integration_connected',
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

// ==================== DOCUMENT TYPES ====================

export interface Document {
  id: string;
  project_id: string;
  name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  tags: string[];
  uploaded_by: string;
  created_at: string;
}

// ==================== EXPRESS REQUEST EXTENSIONS ====================

export interface AuthRequest extends Request {
  user?: User;
  userId?: string;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== ANALYTICS TYPES ====================

export interface AnalyticsMetric {
  metric_name: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ==================== INTEGRATION TYPES ====================

export enum IntegrationType {
  GITHUB = 'github',
  GITLAB = 'gitlab',
  SLACK = 'slack',
  FIGMA = 'figma',
  NOTION = 'notion',
}

export interface Integration {
  id: string;
  project_id: string;
  type: IntegrationType;
  config: Record<string, unknown>;
  is_active: boolean;
  connected_by: string;
  created_at: string;
  updated_at: string;
}
