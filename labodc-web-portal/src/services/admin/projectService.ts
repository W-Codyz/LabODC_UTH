// src/services/admin/projectService.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface Project {
  id: number;
  title: string;
  description: string;
  enterprise: {
    id: number;
    name: string;
    logoUrl?: string;
    verified: boolean;
  };
  objectives: string[];
  technologies: string[];
  startDate: string;
  endDate: string;
  duration: string;
  budget: number;
  numberOfStudents: number;
  skillRequirements: SkillRequirement[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  submittedAt: string;
  attachments?: ProjectAttachment[];
  feasibilityScore?: number;
}

export interface SkillRequirement {
  skill: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  required: boolean;
}

export interface ProjectAttachment {
  fileName: string;
  url: string;
  fileSize?: number;
}

export interface ProjectDetail extends Project {
  validatedBy?: number;
  validatedAt?: string;
  rejectionReason?: string;
  mentor?: {
    id: number;
    name: string;
    email: string;
    expertise: string[];
  };
  fundDistribution?: {
    total: number;
    team: number;
    mentor: number;
    lab: number;
  };
}

export interface Mentor {
  id: number;
  fullName: string;
  expertise: string[];
  yearsOfExperience: number;
  currentProjects: number;
  maxProjects: number;
  available: boolean;
  averageRating: number;
  projectsCompleted: number;
}

export interface ApproveProjectRequest {
  note: string;
  adjustments?: {
    numberOfStudents?: number;
    duration?: string;
  };
}

export interface RejectProjectRequest {
  reason: string;
  details: string;
}

export interface AssignMentorRequest {
  mentorId: number;
  message: string;
}

export interface ProjectListParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProjectListResponse {
  projects: Project[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

// API Service
class ProjectService {
  // Lấy danh sách dự án
  async getProjects(params: ProjectListParams): Promise<ProjectListResponse> {
    const response = await api.get('/lab-admin/projects', { params });
    return response.data.data;
  }

  // Lấy danh sách dự án chờ xác thực
  async getPendingProjects(): Promise<Project[]> {
    const response = await api.get('/lab-admin/projects/pending');
    return response.data.data.projects;
  }

  // Lấy chi tiết dự án
  async getProjectById(id: number): Promise<ProjectDetail> {
    const response = await api.get(`/lab-admin/projects/${id}`);
    return response.data.data;
  }

  // Phê duyệt dự án
  async approveProject(id: number, data: ApproveProjectRequest): Promise<void> {
    await api.post(`/lab-admin/projects/${id}/approve`, data);
  }

  // Từ chối dự án
  async rejectProject(id: number, data: RejectProjectRequest): Promise<void> {
    await api.post(`/lab-admin/projects/${id}/reject`, data);
  }

  // Lấy danh sách mentor có sẵn
  async getAvailableMentors(technologies?: string[]): Promise<Mentor[]> {
    const response = await api.get('/lab-admin/mentors/available', {
      params: { technologies: technologies?.join(',') }
    });
    return response.data.data.mentors;
  }

  // Gán mentor cho dự án
  async assignMentor(projectId: number, data: AssignMentorRequest): Promise<void> {
    await api.post(`/lab-admin/projects/${projectId}/assign-mentor`, data);
  }

  // Tìm kiếm dự án
  async searchProjects(keyword: string): Promise<Project[]> {
    const response = await api.get('/lab-admin/projects/search', {
      params: { q: keyword }
    });
    return response.data.data;
  }
}

export const projectService = new ProjectService();