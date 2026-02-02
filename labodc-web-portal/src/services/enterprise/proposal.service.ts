// Enterprise Proposal Service
// Mock service – giữ nguyên interface cho frontend

export interface ProposalSummary {
  total: number;
  pending: number;
  approved: number;
  totalBudget: number;
}

export interface Proposal {
  key: number;
  name: string;
  budget: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export const getProposalSummary = (): ProposalSummary => {
  return {
    total: 6,
    pending: 2,
    approved: 3,
    totalBudget: 1800000000,
  };
};

export const getProposals = (status: string): Proposal[] => {
  const data: Proposal[] = [
    {
      key: 1,
      name: 'Nâng cấp hệ thống ERP',
      budget: 500000000,
      status: 'PENDING',
      createdAt: '2026-01-05',
    },
    {
      key: 2,
      name: 'Website bán hàng B2B',
      budget: 800000000,
      status: 'APPROVED',
      createdAt: '2026-01-10',
    },
    {
      key: 3,
      name: 'Ứng dụng quản lý nội bộ',
      budget: 300000000,
      status: 'REJECTED',
      createdAt: '2026-01-15',
    },
  ];

  if (status === 'ALL') return data;
  return data.filter((p) => p.status === status);
};