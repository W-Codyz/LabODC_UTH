// report.service.ts
import axios from '@/services/api/axios.config';

export interface ProjectReport {
  key: string;
  name: string;
  cost: number;
  progress: number;
  status: string;
}

export const getReportSummary = async () => {
  const res = await axios.get('/api/enterprise/reports/summary');
  return res.data;
};

export const getProjectReports = async () => {
  const res = await axios.get('/api/enterprise/reports/projects');
  return res.data;
};
