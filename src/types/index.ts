export type UserRole = "patient" | "doctor" | "caregiver";

export type TaskStatus =
  | "pending"
  | "acknowledged"
  | "completed"
  | "overdue"
  | "help_requested";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface CareTask {
  id: string;
  title: string;
  description: string;
  patientId: string;
  patientName: string;
  ownerId: string;
  ownerName: string;
  ownerRole: UserRole;
  dueDate: string; // ISO
  status: TaskStatus;
  createdAt: string;
  acknowledgedAt?: string;
  completedAt?: string;
  notes?: string;
  priority: "low" | "medium" | "high";
  category: "test" | "visit" | "home_care" | "medication" | "seek_help" | "other";
}

export interface CarePlan {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  summary: string;
  createdBy: string;
  createdAt: string;
  tasks: CareTask[];
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  actorRole: UserRole;
  targetId: string;
  timestamp: string;
  details?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: string;
}
