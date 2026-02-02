import axios from '@/services/api/axios.config';

// Dashboard summary
export const getEnterpriseDashboardSummary = async () => {
  const res = await axios.get('/projects/dashboard/summary');
  return res.data;
};

// Recent projects
export const getRecentProjects = async () => {
  const res = await axios.get('/projects/dashboard/recent-projects');
  return res.data;
};
