// payment.service.ts
import axios from '@/services/api/axios.config';

export interface PaymentItem {
  key: string;
  code: string;
  project: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

export const getPaymentSummary = async () => {
  const res = await axios.get('/api/enterprise/payments/summary');
  return res.data;
};

export const getPayments = async () => {
  const res = await axios.get('/api/enterprise/payments');
  return res.data;
};
