// Enterprise Payment Service
// Mock service – giữ nguyên interface cho frontend

export interface PaymentSummary {
  paid: number;
  pending: number;
  overdue: number;
  remaining: number;
}

export interface Payment {
  key: number;
  code: string;
  project: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

export const getPaymentSummary = (): PaymentSummary => {
  return {
    paid: 5,
    pending: 2,
    overdue: 1,
    remaining: 950000000,
  };
};

export const getPayments = (): Payment[] => {
  return [
    {
      key: 1,
      code: 'PAY-001',
      project: 'Hệ thống ERP',
      amount: 300000000,
      dueDate: '2026-01-20',
      status: 'PAID',
    },
    {
      key: 2,
      code: 'PAY-002',
      project: 'Website doanh nghiệp',
      amount: 200000000,
      dueDate: '2026-02-05',
      status: 'PENDING',
    },
    {
      key: 3,
      code: 'PAY-003',
      project: 'Ứng dụng nội bộ',
      amount: 150000000,
      dueDate: '2026-01-10',
      status: 'OVERDUE',
    },
  ];
};
