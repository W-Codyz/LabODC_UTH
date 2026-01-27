export interface ProjectReport {
  key: string;
  name: string;
  cost: number;
  progress: number;
  status: string;
}

export const getReportSummary = () => ({
  projects: 12,
  totalCost: 2300000000,
  performance: 87,
  completedRate: 65,
});

export const getProjectReports = (): ProjectReport[] => [
  {
    key: '1',
    name: 'ERP System',
    cost: 800000000,
    progress: 75,
    status: 'IN_PROGRESS',
  },
  {
    key: '2',
    name: 'Website CMS',
    cost: 300000000,
    progress: 100,
    status: 'COMPLETED',
  },
];
