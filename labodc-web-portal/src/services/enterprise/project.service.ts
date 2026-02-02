import axios from '@/services/api/axios.config';

export interface Project {
  key: string;
  name: string;
  budget: number;
  spent: number;
  progress: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
}

export const getProjectSummary = async () => {
  const res = await axios.get('/api/enterprise/projects/summary');
  return res.data;
};

export const getProjects = async (status: string) => {
  const res = await axios.get('/api/enterprise/projects', {
    params: status !== 'ALL' ? { status } : {},
  });
  return res.data;
};
