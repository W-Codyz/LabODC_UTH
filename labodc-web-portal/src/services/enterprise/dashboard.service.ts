// Enterprise Dashboard Service
// Mock service – giữ nguyên interface để sau này nối API thật

export interface DashboardSummary {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalSpent: number;
}

export interface RecentProject {
  key: number;
  name: string;
  progress: number;
  members: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

export const getEnterpriseDashboardSummary = (): DashboardSummary => {
  return {
    totalProjects: 12,
    activeProjects: 5,
    completedProjects: 7,
    totalSpent: 1250000000,
  };
};

export const getRecentProjects = (): RecentProject[] => {
  return [
    {
      key: 1,
      name: 'Hệ thống ERP',
      progress: 70,
      members: 6,
      status: 'IN_PROGRESS',
    },
    {
      key: 2,
      name: 'Website doanh nghiệp',
      progress: 100,
      members: 4,
      status: 'COMPLETED',
    },
  ];
};
