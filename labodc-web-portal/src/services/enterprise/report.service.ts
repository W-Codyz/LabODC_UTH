// Enterprise Report Service
// Mock service – giữ nguyên interface cho frontend

export interface ReportSummary {
  projects: number;
  totalCost: number;
  performance: number;
  completedRate: number;
}

export interface ProjectReport {
  key: number;
  name: string;
  cost: number;
  progress: number;
  status: string;
}

export const getReportSummary = (): ReportSummary => {
  return {
    projects: 8,
    totalCost: 2150000000,
    performance: 82,
    completedRate: 65,
  };
};

export const getProjectReports = (): ProjectReport[] => {
  return [
    {
      key: 1,
      name: 'Hệ thống ERP',
      cost: 950000000,
      progress: 70,
      status: 'IN_PROGRESS',
    },
    {
      key: 2,
      name: 'Website doanh nghiệp',
      cost: 600000000,
      progress: 100,
      status: 'COMPLETED',
    },
    {
      key: 3,
      name: 'Ứng dụng nội bộ',
      cost: 300000000,
      progress: 40,
      status: 'IN_PROGRESS',
    },
  ];
};
