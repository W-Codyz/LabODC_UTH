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
    // Mock data - backend chưa sẵn sàng
    console.log('📊 Loading dashboard stats...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockStats: DashboardStats = {
      projects: {
        total: 45,
        new: 8,
        ongoing: 22,
        completed: 15,
        cancelled: 0,
        successRate: 88.5,
      },
      enterprises: {
        total: 28,
        new: 5,
        active: 23,
        verified: 25,
      },
      talents: {
        total: 156,
        new: 24,
        active: 142,
        averageRating: 4.2,
      },
      mentors: {
        total: 18,
        active: 16,
        averageRating: 4.5,
      },
      financials: {
        totalRevenue: 2450000000,
        teamDisbursed: 1715000000,
        mentorDisbursed: 490000000,
        labRevenue: 245000000,
        hybridFundAdvanced: 850000000,
        hybridFundRepaid: 680000000,
      },
      performance: {
        avgProjectCompletion: 85,
        onTimeDelivery: 92,
        customerSatisfaction: 4.3,
      },
    };
    
    console.log('✅ Stats loaded:', mockStats);
    return mockStats;
    
    /* // Uncomment khi backend ready
    try {
      const response = await api.get('/lab-admin/dashboard/stats');
      return response.data.data;
    } catch (error) {
      console.warn('Backend not ready, using mock data');
      return mockStats;
    }
    */
  }

  // Lấy hoạt động gần đây
  async getRecentActivities(): Promise<RecentActivity[]> {
    console.log('📝 Loading recent activities...');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockActivities: RecentActivity[] = [
      {
        id: 1,
        type: 'project',
        title: 'Dự án AI Chatbot được phê duyệt',
        description: 'Công ty TNHH Tech Innovation',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'success',
      },
      {
        id: 2,
        type: 'payment',
        title: 'Giải ngân 70% cho Team DA-001',
        description: 'Số tiền: 350,000,000 VNĐ',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'success',
      },
      {
        id: 3,
        type: 'enterprise',
        title: 'DN mới đăng ký: ABC Corp',
        description: 'Chờ xác thực giấy tờ',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'warning',
      },
      {
        id: 4,
        type: 'report',
        title: 'Báo cáo tháng 12/2025 đã được tạo',
        description: 'Xem chi tiết báo cáo minh bạch',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'info',
      },
      {
        id: 5,
        type: 'project',
        title: 'Dự án Web App cần bổ sung thông tin',
        description: 'Thiếu mô tả kỹ thuật chi tiết',
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        status: 'warning',
      },
    ];
    
    console.log('✅ Activities loaded:', mockActivities.length);
    return mockActivities;
  }

  // Lấy danh sách chờ phê duyệt
  async getPendingApprovals(): Promise<PendingApproval[]> {
    console.log('⏳ Loading pending approvals...');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockApprovals: PendingApproval[] = [
      {
        id: 1,
        type: 'enterprise',
        title: 'Công ty TNHH XYZ Solutions',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
      },
      {
        id: 2,
        type: 'project',
        title: 'Dự án Mobile App cho Logistics',
        submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
      },
      {
        id: 3,
        type: 'enterprise',
        title: 'Công ty CP Digital Marketing',
        submittedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
      },
      {
        id: 4,
        type: 'project',
        title: 'Dự án E-commerce Platform',
        submittedAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
      },
      {
        id: 5,
        type: 'project',
        title: 'Dự án IoT Smart Home',
        submittedAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
        priority: 'low',
      },
    ];
    
    console.log('✅ Approvals loaded:', mockApprovals.length);
    return mockApprovals;
  }

  // Lấy dữ liệu biểu đồ doanh thu theo tháng
  async getRevenueChart(months: number = 6): Promise<any[]> {
    console.log('📈 Loading revenue chart...');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const now = new Date();
    const chartData = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
      
      chartData.push({
        month: monthName,
        revenue: Math.floor(300000000 + Math.random() * 200000000),
        teamDisbursed: Math.floor(210000000 + Math.random() * 140000000),
        mentorDisbursed: Math.floor(60000000 + Math.random() * 40000000),
        labRevenue: Math.floor(30000000 + Math.random() * 20000000),
      });
    }
    
    console.log('✅ Chart data loaded:', chartData.length);
    return chartData;
  }
}

export const dashboardService = new DashboardService();