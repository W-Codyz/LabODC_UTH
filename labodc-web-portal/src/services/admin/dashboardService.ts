// src/services/admin/dashboardService.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Axios instance với config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types theo SRS document
export interface DashboardStats {
  projects: {
    total: number;
    new: number;
    ongoing: number;
    completed: number;
    cancelled: number;
    successRate: number;
  };
  enterprises: {
    total: number;
    new: number;
    active: number;
    verified: number;
  };
  talents: {
    total: number;
    new: number;
    active: number;
    averageRating: number;
  };
  mentors: {
    total: number;
    active: number;
    averageRating: number;
  };
  financials: {
    totalRevenue: number;
    teamDisbursed: number;
    mentorDisbursed: number;
    labRevenue: number;
    hybridFundAdvanced: number;
    hybridFundRepaid: number;
  };
  performance: {
    avgProjectCompletion: number;
    onTimeDelivery: number;
    customerSatisfaction: number;
  };
}

export interface RecentActivity {
  id: number;
  type: 'project' | 'payment' | 'enterprise' | 'report';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

export interface PendingApproval {
  id: number;
  type: 'enterprise' | 'project';
  title: string;
  submittedAt: string;
  priority: 'high' | 'medium' | 'low';
}

// API Service
class DashboardService {
  // Lấy thống kê tổng quan
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/lab-admin/dashboard/stats');
    return response.data.data;
  }

  // Lấy hoạt động gần đây
  async getRecentActivities(): Promise<RecentActivity[]> {
    const response = await api.get('/lab-admin/dashboard/activities');
    return response.data.data;
  }

  // Lấy danh sách chờ phê duyệt
  async getPendingApprovals(): Promise<PendingApproval[]> {
    const response = await api.get('/lab-admin/dashboard/pending');
    return response.data.data;
  }

  // Lấy dữ liệu biểu đồ doanh thu theo tháng
  async getRevenueChart(months: number = 6): Promise<any[]> {
    const response = await api.get(`/lab-admin/dashboard/revenue-chart?months=${months}`);
    return response.data.data;
  }
}

export const dashboardService = new DashboardService();