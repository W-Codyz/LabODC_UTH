export interface EnterpriseProject {
  key: string;
  name: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  progress: number;
  members: number;
}

export const getEnterpriseDashboardSummary = () => ({
  totalProjects: 14,
  activeProjects: 6,
  completedProjects: 8,
  totalSpent: 4200000000,
  pendingPayments: 350000000,
});

export const getRecentProjects = (): EnterpriseProject[] => [
  {
    key: '1',
    name: 'Hệ thống ERP',
    status: 'IN_PROGRESS',
    progress: 70,
    members: 6,
  },
  {
    key: '2',
    name: 'Website doanh nghiệp',
    status: 'COMPLETED',
    progress: 100,
    members: 4,
  },
  {
    key: '3',
    name: 'Mobile App',
    status: 'IN_PROGRESS',
    progress: 45,
    members: 5,
  },
];
