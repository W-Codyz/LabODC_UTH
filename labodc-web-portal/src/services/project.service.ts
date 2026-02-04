// Project Service
import axiosInstance from './api/axios.config';
import {
  IProject,
  IProjectBackend,
  IProjectProposal,
  IProjectDetail,
  mapBackendProject,
} from '@/types/project.types';
import { IApiResponse } from '@/types/api.types';

const PROJECT_ENDPOINTS = {
  BASE: '/projects',
  PROPOSALS: '/projects/proposals',
  VALIDATE: '/projects/validate',
};

export const projectService = {
  /**
   * Get all projects (backend returns list, optional status filter)
   */
  getProjects: async (params?: { status?: string }): Promise<IProject[]> => {
    const response = await axiosInstance.get<IApiResponse<IProjectBackend[]>>(
      PROJECT_ENDPOINTS.BASE,
      { params }
    );
    const list = response.data?.data ?? response.data ?? [];
    return Array.isArray(list) ? list.map(mapBackendProject) : [];
  },

  /**
   * Get project by ID (backend returns ProjectResponse)
   */
  getProjectById: async (id: string): Promise<IProjectDetail> => {
    const response = await axiosInstance.get<IApiResponse<IProjectBackend>>(
      `${PROJECT_ENDPOINTS.BASE}/${id}`
    );
    const data = response.data?.data ?? response.data;
    if (!data) throw new Error('Project not found');
    const base = mapBackendProject(data);
    return {
      ...base,
      objectives: data.objective ?? '',
      scope: '',
      expectedOutcomes: '',
      attachments: data.attachments ?? [],
      teamMembers: [],
      tasks: [],
      reports: [],
    };
  },

  /**
   * Create project proposal
   */
  createProposal: async (data: IProjectProposal): Promise<IProject> => {
    const response = await axiosInstance.post<IApiResponse<IProject>>(
      PROJECT_ENDPOINTS.PROPOSALS,
      data
    );
    return response.data.data;
  },

  /**
   * Update project
   */
  updateProject: async (id: string, data: Partial<IProjectProposal>): Promise<IProject> => {
    const response = await axiosInstance.put<IApiResponse<IProject>>(
      `${PROJECT_ENDPOINTS.BASE}/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Delete project
   */
  deleteProject: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${PROJECT_ENDPOINTS.BASE}/${id}`);
  },

  /**
   * Validate project (Admin)
   */
  validateProject: async (
    id: string,
    data: { status: 'APPROVED' | 'REJECTED'; comments: string }
  ): Promise<IProject> => {
    const response = await axiosInstance.post<IApiResponse<IProject>>(
      `${PROJECT_ENDPOINTS.VALIDATE}/${id}`,
      data
    );
    return response.data.data;
  },

  /**
   * Join project (Talent) - backend: POST /api/projects/{projectId}/join
   */
  joinProject: async (projectId: string, motivationLetter?: string): Promise<void> => {
    await axiosInstance.post<IApiResponse<null>>(
      `${PROJECT_ENDPOINTS.BASE}/${projectId}/join`,
      motivationLetter != null ? { motivationLetter } : {}
    );
  },

  /**
   * Leave project (Talent) - backend: POST /api/projects/{projectId}/leave
   */
  leaveProject: async (projectId: string): Promise<void> => {
    await axiosInstance.post(`${PROJECT_ENDPOINTS.BASE}/${projectId}/leave`);
  },

  /**
   * Get my projects - backend: GET /api/projects/my
   */
  getMyProjects: async (): Promise<IProject[]> => {
    const response = await axiosInstance.get<IApiResponse<IProjectBackend[]>>(
      `${PROJECT_ENDPOINTS.BASE}/my`
    );
    const list = response.data?.data ?? response.data ?? [];
    return Array.isArray(list) ? list.map(mapBackendProject) : [];
  },

  /**
   * Get projects by enterprise
   */
  getEnterpriseProjects: async (enterpriseId: string): Promise<IProject[]> => {
    const response = await axiosInstance.get<IApiResponse<IProject[]>>(
      `${PROJECT_ENDPOINTS.BASE}/enterprise/${enterpriseId}`
    );
    return response.data.data;
  },
};
