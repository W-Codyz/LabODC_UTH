export interface Project {
  key: string;
  name: string;
  budget: number;
  spent: number;
  progress: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
}

export const getProjectSummary = () => ({
  total: 12,
  inProgress: 6,
  completed: 4,
  totalBudget: 3200000000,
});

export const getProjects = (status: string): Project[] => {
  const data: Project[] = [
    {
      key: '1',
      name: 'Hệ thống ERP',
      budget: 800000000,
      spent: 500000000,
      progress: 65,
      status: 'IN_PROGRESS',
    },
    {
      key: '2',
      name: 'Website doanh nghiệp',
      budget: 300000000,
      spent: 300000000,
      progress: 100,
      status: 'COMPLETED',
    },
    {
      key: '3',
      name: 'Mobile App',
      budget: 600000000,
      spent: 200000000,
      progress: 35,
      status: 'ON_HOLD',
    },
  ];

  return status === 'ALL'
    ? data
    : data.filter(p => p.status === status);
};
