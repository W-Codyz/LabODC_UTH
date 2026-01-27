export interface Payment {
  key: string;
  code: string;
  project: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

export const getPaymentSummary = () => ({
  paid: 1200000000,
  pending: 250000000,
  overdue: 50000000,
  remaining: 500000000,
});

export const getPayments = (): Payment[] => [
  {
    key: '1',
    code: 'PAY-001',
    project: 'ERP System',
    amount: 200000000,
    dueDate: '20/01/2026',
    status: 'PAID',
  },
  {
    key: '2',
    code: 'PAY-002',
    project: 'CRM Platform',
    amount: 150000000,
    dueDate: '25/01/2026',
    status: 'OVERDUE',
  },
];
