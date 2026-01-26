export interface Proposal {
  key: string;
  name: string;
  budget: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export const getProposalSummary = () => ({
  total: 8,
  pending: 3,
  approved: 4,
  rejected: 1,
  totalBudget: 1800000000,
});

export const getProposals = (status: string): Proposal[] => {
  const data: Proposal[] = [
    {
      key: '1',
      name: 'Hệ thống ERP',
      budget: 500000000,
      status: 'PENDING',
      createdAt: '12/01/2026',
    },
    {
      key: '2',
      name: 'Website doanh nghiệp',
      budget: 300000000,
      status: 'APPROVED',
      createdAt: '05/01/2026',
    },
  ];

  return status === 'ALL'
    ? data
    : data.filter(item => item.status === status);
};
