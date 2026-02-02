// proposal.service.ts
import axios from '@/services/api/axios.config';

export interface Proposal {
  key: string;
  name: string;
  budget: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export const getProposalSummary = async () => {
  const res = await axios.get('/api/enterprise/proposals/summary');
  return res.data;
};

export const getProposals = async (status: string) => {
  const res = await axios.get('/api/enterprise/proposals', {
    params: status !== 'ALL' ? { status } : {},
  });
  return res.data;
};
