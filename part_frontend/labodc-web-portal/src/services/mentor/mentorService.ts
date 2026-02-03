import axiosInstance from '@/services/api/axios.config';
import type { AxiosResponse } from 'axios';
import { IApiResponse } from '@/types/api.types';
import {
  IMentorDashboardPayload,
  IMentorInvitation,
  IMentorProjectOption,
  IMentorReport,
  IMentorTask,
  IMentorTalentEvaluation,
  IMentorTalentOption,
} from '@/types/mentor.types';

const fetchData = async <T>(promise: Promise<AxiosResponse<IApiResponse<T>>>): Promise<T> => {
  const response = await promise;
  return response.data.data;
};

export const mentorService = {
  // Dashboard
  getDashboardOverview: async (): Promise<IMentorDashboardPayload> =>
    fetchData(axiosInstance.get<IApiResponse<IMentorDashboardPayload>>('/mentor/dashboard')),

  // Invitations
  getInvitations: async (): Promise<IMentorInvitation[]> =>
    fetchData(axiosInstance.get<IApiResponse<IMentorInvitation[]>>('/mentor/invitations')),

  acceptInvitation: async (id: string): Promise<void> => {
    await axiosInstance.post(`/mentor/invitations/${id}/accept`);
  },

  rejectInvitation: async (id: string, reason?: string): Promise<void> => {
    await axiosInstance.post(`/mentor/invitations/${id}/reject`, { reason });
  },

  // Projects (for selectors)
  getProjects: async (): Promise<IMentorProjectOption[]> =>
    fetchData(axiosInstance.get<IApiResponse<IMentorProjectOption[]>>('/mentor/projects')),

  // Tasks
  getTasks: async (projectId?: string | number): Promise<IMentorTask[]> => {
    const url = projectId ? `/mentor/projects/${projectId}/tasks` : '/mentor/tasks';
    return fetchData(axiosInstance.get<IApiResponse<IMentorTask[]>>(url));
  },

  createTask: async (
    projectId: string | number,
    taskData: Partial<IMentorTask>
  ): Promise<IMentorTask> =>
    fetchData(
      axiosInstance.post<IApiResponse<IMentorTask>>(`/mentor/projects/${projectId}/tasks`, taskData)
    ),

  updateTask: async (
    projectId: string | number,
    taskId: string,
    taskData: Partial<IMentorTask>
  ): Promise<IMentorTask> =>
    fetchData(
      axiosInstance.put<IApiResponse<IMentorTask>>(
        `/mentor/projects/${projectId}/tasks/${taskId}`,
        taskData
      )
    ),

  deleteTask: async (projectId: string | number, taskId: string): Promise<void> => {
    await axiosInstance.delete(`/mentor/projects/${projectId}/tasks/${taskId}`);
  },

  // Evaluations
  getProjectTalents: async (projectId: string | number): Promise<IMentorTalentOption[]> =>
    fetchData(
      axiosInstance.get<IApiResponse<IMentorTalentOption[]>>(
        `/mentor/projects/${projectId}/talents`
      )
    ),

  getEvaluations: async (projectId?: string | number): Promise<IMentorTalentEvaluation[]> => {
    const url = projectId ? `/mentor/projects/${projectId}/evaluations` : '/mentor/evaluations';
    return fetchData(axiosInstance.get<IApiResponse<IMentorTalentEvaluation[]>>(url));
  },

  submitEvaluation: async (
    projectId: string | number,
    evaluationData: Partial<IMentorTalentEvaluation> & {
      talentId: string | number;
      evaluationPeriod: string;
    }
  ): Promise<IMentorTalentEvaluation> =>
    fetchData(
      axiosInstance.post<IApiResponse<IMentorTalentEvaluation>>(
        `/mentor/projects/${projectId}/evaluations`,
        evaluationData
      )
    ),

  // Reports
  getReports: async (): Promise<IMentorReport[]> =>
    fetchData(axiosInstance.get<IApiResponse<IMentorReport[]>>('/mentor/reports')),

  downloadReportFile: async (reportId: string | number) =>
    axiosInstance.get(`/mentor/reports/${reportId}/file`, { responseType: 'blob' }),

  submitReport: async (reportData: FormData | Partial<IMentorReport>): Promise<IMentorReport> =>
    // When sending FormData, let axios/browser set the proper multipart boundary.
    fetchData(axiosInstance.post<IApiResponse<IMentorReport>>('/mentor/reports', reportData)),
};
