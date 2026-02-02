// Enterprise Project Service
// Mock service – giữ nguyên interface để frontend không bị lỗi

export interface ProjectSummary {
  total: number;
  inProgress: number;
  completed: number;
  totalBudget: number;
}

export interface Project {
  key: number;
  name: string;
  budget: number;
  spent: number;
  progress: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
}

export const getProjectSummary = (): ProjectSummary => {
  return {
    total: 8,
    inProgress: 4,
    completed: 3,
    totalBudget: 3200000000,
  };
};

export const getProjects = (status: string): Project[] => {
  const data: Project[] = [
    {
      key: 1,
      name: 'Hệ thống ERP',
      budget: 1200000000,
      spent: 800000000,
      progress: 70,
      status: 'IN_PROGRESS',
    },
    {
      key: 2,
      name: 'Website doanh nghiệp',
      budget: 600000000,
      spent: 600000000,
      progress: 100,
      status: 'COMPLETED',
    },
    {
      key: 3,
      name: 'Ứng dụng nội bộ',
      budget: 400000000,
      spent: 150000000,
      progress: 30,
      status: 'ON_HOLD',
    },
  ];

  if (status === 'ALL') return data;
  return data.filter((p) => p.status === status);
};
