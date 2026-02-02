import React, { useState } from "react";
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  TeamOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import "../mentor-modern.css";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
  assignedTo: string[];
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  projectName: string;
}

const TaskManagement: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Thiết kế ERD Database',
      description: 'Thiết kế sơ đồ cơ sở dữ liệu cho hệ thống quản lý sinh viên',
      status: 'completed',
      progress: 100,
      assignedTo: ['Nguyễn Văn A', 'Trần Thị B'],
      dueDate: '2026-01-25',
      priority: 'high',
      projectName: 'Student Management System'
    },
    {
      id: '2',
      title: 'Viết tài liệu SRS',
      description: 'Hoàn thiện tài liệu yêu cầu phần mềm (Software Requirements Specification)',
      status: 'in-progress',
      progress: 65,
      assignedTo: ['Lê Văn C'],
      dueDate: '2026-02-10',
      priority: 'high',
      projectName: 'Student Management System'
    },
    {
      id: '3',
      title: 'Implement Authentication',
      description: 'Xây dựng hệ thống đăng nhập và phân quyền người dùng',
      status: 'in-progress',
      progress: 40,
      assignedTo: ['Nguyễn Văn A'],
      dueDate: '2026-02-15',
      priority: 'high',
      projectName: 'E-Commerce Platform'
    },
    {
      id: '4',
      title: 'Thiết kế UI/UX',
      description: 'Thiết kế giao diện người dùng cho trang web thương mại điện tử',
      status: 'pending',
      progress: 0,
      assignedTo: ['Trần Thị B', 'Phạm Thị D'],
      dueDate: '2026-02-20',
      priority: 'medium',
      projectName: 'E-Commerce Platform'
    },
    {
      id: '5',
      title: 'Setup CI/CD Pipeline',
      description: 'Cấu hình pipeline tự động hóa triển khai',
      status: 'pending',
      progress: 0,
      assignedTo: ['Hoàng Văn E'],
      dueDate: '2026-02-25',
      priority: 'low',
      projectName: 'DevOps Automation'
    },
    {
      id: '6',
      title: 'Viết Unit Tests',
      description: 'Viết test case cho các module chính của hệ thống',
      status: 'in-progress',
      progress: 55,
      assignedTo: ['Lê Văn C', 'Hoàng Văn E'],
      dueDate: '2026-02-18',
      priority: 'medium',
      projectName: 'Quality Assurance'
    }
  ];

  const filteredTasks = selectedStatus === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === selectedStatus);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircleOutlined />,
          text: 'Hoàn thành',
          color: 'var(--success)',
          bg: 'rgba(16, 185, 129, 0.1)'
        };
      case 'in-progress':
        return {
          icon: <ClockCircleOutlined />,
          text: 'Đang làm',
          color: 'var(--warning)',
          bg: 'rgba(245, 158, 11, 0.1)'
        };
      case 'pending':
        return {
          icon: <ExclamationCircleOutlined />,
          text: 'Chưa bắt đầu',
          color: 'var(--text-secondary)',
          bg: 'rgba(107, 114, 128, 0.1)'
        };
      default:
        return { icon: null, text: '', color: '', bg: '' };
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return { color: 'var(--danger)', text: 'Cao' };
      case 'medium':
        return { color: 'var(--warning)', text: 'Trung bình' };
      case 'low':
        return { color: 'var(--success)', text: 'Thấp' };
      default:
        return { color: '', text: '' };
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    avgProgress: Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length)
  };

  return (
    <div className="mentor-modern-page">
      <div className="page-header">
        <h1 className="fancy-title">Quản lý công việc</h1>
        <p className="fancy-subtitle">Theo dõi tiến độ sinh viên & nhiệm vụ dự án</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
          <div className="stat-title">Tổng công việc</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>{stats.total}</div>
        </div>
        
        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
          <div className="stat-title">Hoàn thành</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>{stats.completed}</div>
        </div>

        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔄</div>
          <div className="stat-title">Đang làm</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>{stats.inProgress}</div>
        </div>

        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
          <div className="stat-title">Tiến độ TB</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>{stats.avgProgress}%</div>
        </div>
      </div>

      {/* Status Filter */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <button
          className="btn"
          onClick={() => setSelectedStatus('all')}
          style={{
            background: selectedStatus === 'all' ? 'var(--primary)' : 'white',
            color: selectedStatus === 'all' ? 'white' : 'var(--text-primary)',
            border: selectedStatus === 'all' ? 'none' : '2px solid #f0f0f0'
          }}
        >
          Tất cả ({tasks.length})
        </button>
        <button
          className="btn"
          onClick={() => setSelectedStatus('completed')}
          style={{
            background: selectedStatus === 'completed' ? 'var(--success)' : 'white',
            color: selectedStatus === 'completed' ? 'white' : 'var(--text-primary)',
            border: selectedStatus === 'completed' ? 'none' : '2px solid #f0f0f0'
          }}
        >
          Hoàn thành ({stats.completed})
        </button>
        <button
          className="btn"
          onClick={() => setSelectedStatus('in-progress')}
          style={{
            background: selectedStatus === 'in-progress' ? 'var(--warning)' : 'white',
            color: selectedStatus === 'in-progress' ? 'white' : 'var(--text-primary)',
            border: selectedStatus === 'in-progress' ? 'none' : '2px solid #f0f0f0'
          }}
        >
          Đang làm ({stats.inProgress})
        </button>
        <button
          className="btn"
          onClick={() => setSelectedStatus('pending')}
          style={{
            background: selectedStatus === 'pending' ? 'var(--text-secondary)' : 'white',
            color: selectedStatus === 'pending' ? 'white' : 'var(--text-primary)',
            border: selectedStatus === 'pending' ? 'none' : '2px solid #f0f0f0'
          }}
        >
          Chưa bắt đầu ({stats.pending})
        </button>
        <button
          className="btn btn-primary"
          style={{ marginLeft: 'auto' }}
        >
          <PlusOutlined /> Thêm công việc
        </button>
      </div>

      {/* Task Cards Grid */}
      <div className="content-grid">
        {filteredTasks.map((task, index) => {
          const statusInfo = getStatusInfo(task.status);
          const priorityInfo = getPriorityInfo(task.priority);
          
          return (
            <div 
              key={task.id}
              className="modern-card"
              style={{ 
                padding: '24px',
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    margin: '0 0 8px 0'
                  }}>
                    {task.title}
                  </h3>
                  <p style={{ 
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    margin: 0
                  }}>
                    {task.projectName}
                  </p>
                </div>
                <div style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: priorityInfo.color + '15',
                  color: priorityInfo.color,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {priorityInfo.text}
                </div>
              </div>

              {/* Description */}
              <p style={{ 
                fontSize: '14px',
                lineHeight: '1.6',
                color: 'var(--text-secondary)',
                marginBottom: '16px'
              }}>
                {task.description}
              </p>

              {/* Status Badge */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: statusInfo.bg,
                  color: statusInfo.color
                }}>
                  {statusInfo.icon} {statusInfo.text}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: 600
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Tiến độ</span>
                  <span style={{ color: 'var(--text-primary)' }}>{task.progress}%</span>
                </div>
                <div className="progress-wrapper">
                  <div 
                    className={`progress-bar ${
                      task.progress === 100 ? 'success' : 
                      task.progress >= 50 ? 'warning' : 'success'
                    }`}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>

              {/* Meta Info */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderTop: '1px solid #f0f0f0',
                fontSize: '13px'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--text-secondary)'
                }}>
                  <TeamOutlined />
                  <span>{task.assignedTo.length} người</span>
                </div>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--text-secondary)'
                }}>
                  <CalendarOutlined />
                  <span>{new Date(task.dueDate).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              {/* Assigned Members */}
              <div style={{ marginTop: '12px' }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '8px'
                }}>
                  Người thực hiện:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {task.assignedTo.map((person, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}
                    >
                      {person}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button 
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  marginTop: '16px',
                  justifyContent: 'center'
                }}
              >
                Xem chi tiết
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Task Button - Floating */}
      <button
        className="btn btn-primary"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          padding: 0,
          fontSize: '24px',
          boxShadow: 'var(--shadow-2xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <PlusOutlined />
      </button>
    </div>
  );
};

export default TaskManagement;