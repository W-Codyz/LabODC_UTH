// src/services/admin/fundService.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface FundAllocation {
  projectId: number;
  projectTitle: string;
  enterpriseName: string;
  payment: {
    id: number;
    amount: number;
    status: 'PAID' | 'PENDING' | 'FAILED';
    paidAt: string;
  };
  allocation: {
    total: number;
    team: {
      amount: number;
      percentage: number;
      status: 'PENDING_DISTRIBUTION' | 'DISTRIBUTED' | 'DISBURSED';
    };
    mentor: {
      amount: number;
      percentage: number;
      status: 'PENDING_REPORT' | 'READY' | 'DISBURSED';
    };
    lab: {
      amount: number;
      percentage: number;
      status: 'RECEIVED' | 'PENDING';
    };
  };
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED';
}

export interface FundAllocationDetail extends FundAllocation {
  teamDistribution?: {
    distributionId: number;
    createdBy: string;
    members: TeamMemberAllocation[];
    status: 'PENDING_MENTOR_APPROVAL' | 'APPROVED' | 'DISBURSED';
    submittedAt: string;
  };
  mentorInfo?: {
    id: number;
    name: string;
    email: string;
    reportSubmitted: boolean;
    reportSubmittedAt?: string;
  };
}

export interface TeamMemberAllocation {
  talentId: number;
  fullName: string;
  percentage: number;
  amount: number;
  reason: string;
}

export interface DisburseMentorRequest {
  mentorId: number;
  amount: number;
  note: string;
}

export interface DisburseTeamRequest {
  distributionId: number;
  teamDistribution: {
    talentId: number;
    amount: number;
  }[];
  note: string;
}

export interface HybridFundAdvance {
  id: number;
  projectId: number;
  projectTitle: string;
  enterpriseName: string;
  advanceAmount: number;
  teamAmount: number;
  mentorAmount: number;
  enterpriseDebt: number;
  reason: string;
  expectedRepaymentDate: string;
  status: 'ADVANCED' | 'REPAID' | 'OVERDUE';
  advancedAt: string;
  repaidAt?: string;
  repaidAmount?: number;
  daysLate?: number;
}

export interface CreateHybridFundRequest {
  projectId: number;
  advanceAmount: number;
  recipients: {
    team: {
      amount: number;
      distribute: boolean;
    };
    mentor: {
      amount: number;
      distribute: boolean;
    };
  };
  reason: string;
  expectedRepaymentDate: string;
}

export interface ReconcileHybridFundRequest {
  paymentId: number;
  repaidAmount: number;
  repaidAt: string;
}

export interface DelayedPayment {
  projectId: number;
  projectTitle: string;
  enterprise: {
    id: number;
    name: string;
    email: string;
  };
  payment: {
    id: number;
    amount: number;
    dueDate: string;
    daysPastDue: number;
    status: 'DELAYED';
  };
  teamSize: number;
  mentorAssigned: boolean;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
}

// API Service
class FundService {
  // Lấy danh sách phân bổ quỹ
  async getAllocations(status?: string): Promise<FundAllocation[]> {
    const response = await api.get('/lab-admin/fund-allocations', {
      params: { status }
    });
    return response.data.data;
  }

  // Lấy chi tiết phân bổ quỹ
  async getAllocationByProject(projectId: number): Promise<FundAllocationDetail> {
    const response = await api.get(`/lab-admin/projects/${projectId}/fund-allocation`);
    return response.data.data;
  }

  // Xác nhận phân bổ quỹ
  async confirmAllocation(projectId: number): Promise<void> {
    await api.post(`/lab-admin/projects/${projectId}/fund-allocation/confirm`);
  }

  // Giải ngân cho Mentor
  async disburseMentor(distributionId: number, data: DisburseMentorRequest): Promise<any> {
    const response = await api.post(`/lab-admin/fund-distributions/${distributionId}/disburse-mentor`, data);
    return response.data.data;
  }

  // Giải ngân cho Team
  async disburseTeam(distributionId: number, data: DisburseTeamRequest): Promise<any> {
    const response = await api.post(`/lab-admin/fund-distributions/${distributionId}/disburse-team`, data);
    return response.data.data;
  }

  // Lấy danh sách thanh toán chậm
  async getDelayedPayments(): Promise<DelayedPayment[]> {
    const response = await api.get('/lab-admin/payments/delayed');
    return response.data.data.delayedPayments;
  }

  // Tạo tạm ứng Hybrid Fund
  async createHybridFund(data: CreateHybridFundRequest): Promise<any> {
    const response = await api.post('/lab-admin/hybrid-funds/advance', data);
    return response.data.data;
  }

  // Lấy danh sách Hybrid Fund
  async getHybridFunds(status?: string): Promise<HybridFundAdvance[]> {
    const response = await api.get('/lab-admin/hybrid-funds', {
      params: { status }
    });
    return response.data.data;
  }

  // Quyết toán Hybrid Fund
  async reconcileHybridFund(advanceId: number, data: ReconcileHybridFundRequest): Promise<any> {
    const response = await api.put(`/lab-admin/hybrid-funds/${advanceId}/reconcile`, data);
    return response.data.data;
  }

  // Lấy thống kê fund
  async getFundStatistics(): Promise<any> {
    const response = await api.get('/lab-admin/fund-statistics');
    return response.data.data;
  }
}

export const fundService = new FundService();