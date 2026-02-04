// Project Types
import type { ITask } from './task.types';
import type { IReport } from './report.types';

export type TProjectStatus = 
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type TProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

/** Backend ProjectResponse shape (id number, name, status lowercase, etc.) */
export interface IProjectBackend {
  id: number;
  name: string;
  description?: string;
  objective?: string;
  technologies?: string[];
  requiredSkills?: string[];
  status?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  enterpriseId?: number;
  mentorId?: number;
  requiredTalents?: number;
  progressPercentage?: number;
  validated?: string;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProject {
  id: string;
  title: string;
  description: string;
  status: TProjectStatus;
  priority?: TProjectPriority;
  budget: number;
  startDate: string;
  endDate: string;
  enterpriseId: string;
  enterpriseName?: string;
  mentorId?: string;
  mentorName?: string;
  teamSize?: number;
  requiredSkills: string[];
  technologies: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}

/** Map backend project to frontend IProject for display */
export function mapBackendProject(p: IProjectBackend): IProject {
  return {
    id: String(p.id),
    title: p.name ?? '',
    description: p.description ?? '',
    status: (p.status?.toUpperCase?.() ?? 'PENDING_APPROVAL') as TProjectStatus,
    budget: p.budget ?? 0,
    startDate: p.startDate ?? '',
    endDate: p.endDate ?? '',
    enterpriseId: p.enterpriseId != null ? String(p.enterpriseId) : '',
    teamSize: p.requiredTalents ?? 0,
    requiredSkills: p.requiredSkills ?? [],
    technologies: p.technologies ?? [],
    progress: p.progressPercentage ?? 0,
    createdAt: p.createdAt ?? '',
    updatedAt: p.updatedAt ?? '',
  };
}

export interface IProjectProposal {
  title: string;
  description: string;
  objectives: string;
  scope: string;
  budget: number;
  duration: number; // in months
  startDate: string;
  requiredSkills: string[];
  technologies: string[];
  teamSize: number;
  expectedOutcomes: string;
  attachments?: string[];
}

export interface IProjectDetail extends IProject {
  objectives: string;
  scope: string;
  expectedOutcomes: string;
  attachments: string[];
  teamMembers: ITeamMember[];
  tasks: ITask[];
  reports: IReport[];
}

export interface ITeamMember {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role: 'LEADER' | 'MEMBER';
  joinedAt: string;
  performance?: number;
}
