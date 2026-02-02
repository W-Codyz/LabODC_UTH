import React from "react";
import {
  TeamOutlined,
  ProjectOutlined,
  FileDoneOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import "../mentor-modern.css";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, trend }) => {
  return (
    <div className="modern-card stat-card">
      <div className="stat-icon-wrapper" style={{ background: color }}>
        {icon}
      </div>
      <p className="stat-title">{title}</p>
      <h2 className="stat-value">{value}</h2>
      {trend && (
        <div style={{ 
          marginTop: '12px', 
          fontSize: '14px', 
          color: trend.isPositive ? 'var(--success)' : 'var(--danger)',
          fontWeight: 600
        }}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% so với tháng trước
        </div>
      )}
    </div>
  );
};

const MentorDashboard: React.FC = () => {
  const stats = [
    {
      icon: <TeamOutlined />,
      title: "Sinh viên",
      value: 24,
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      trend: { value: 12, isPositive: true }
    },
    {
      icon: <ProjectOutlined />,
      title: "Dự án",
      value: 8,
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      trend: { value: 5, isPositive: true }
    },
    {
      icon: <FileDoneOutlined />,
      title: "Báo cáo",
      value: 12,
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      trend: { value: 8, isPositive: true }
    },
    {
      icon: <ClockCircleOutlined />,
      title: "Chờ xử lý",
      value: 5,
      color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      trend: { value: 3, isPositive: false }
    }
  ];

  return (
    <div className="mentor-modern-page">
      <div className="page-header">
        <h1 className="fancy-title">Mentor Dashboard</h1>
        <p className="fancy-subtitle">
          Tổng quan hoạt động hướng dẫn & dự án sinh viên
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="modern-card" style={{ marginTop: '24px' }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          marginBottom: '20px',
          color: 'var(--text-primary)'
        }}>
          Thao tác nhanh
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <button className="btn btn-primary">
            <ProjectOutlined /> Tạo dự án mới
          </button>
          <button className="btn btn-success">
            <FileDoneOutlined /> Xem báo cáo
          </button>
          <button className="btn btn-primary">
            <TeamOutlined /> Quản lý sinh viên
          </button>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="modern-card" style={{ marginTop: '24px' }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          marginBottom: '20px',
          color: 'var(--text-primary)'
        }}>
          Hoạt động gần đây
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { action: 'Nguyễn Văn A đã nộp báo cáo Sprint 1', time: '2 giờ trước', type: 'success' },
            { action: 'Trần Thị B đã cập nhật tiến độ dự án', time: '5 giờ trước', type: 'info' },
            { action: 'Dự án AI Chatbot cần phê duyệt', time: '1 ngày trước', type: 'warning' }
          ].map((activity, idx) => (
            <div key={idx} style={{
              padding: '16px',
              borderLeft: `4px solid ${
                activity.type === 'success' ? 'var(--success)' : 
                activity.type === 'warning' ? 'var(--warning)' : 
                'var(--primary)'
              }`,
              background: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                {activity.action}
              </span>
              <span style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}>
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;