import React, { useState } from "react";
import { 
  TeamOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import "../mentor-modern.css";

interface Invitation {
  id: string;
  projectName: string;
  groupName: string;
  studentCount: number;
  description: string;
  deadline: string;
  skills: string[];
  receivedDate: string;
  priority: 'high' | 'medium' | 'low';
}

const ProjectInvitations: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: '1',
      projectName: 'AI Chatbot cho Giáo dục',
      groupName: 'SE2024-A',
      studentCount: 4,
      description: 'Phát triển chatbot hỗ trợ học tập sử dụng NLP và Machine Learning',
      deadline: '2026-03-15',
      skills: ['Python', 'NLP', 'TensorFlow'],
      receivedDate: '2026-02-01',
      priority: 'high'
    },
    {
      id: '2',
      projectName: 'E-Commerce Platform',
      groupName: 'SE2024-B',
      studentCount: 5,
      description: 'Xây dựng nền tảng thương mại điện tử với React và Node.js',
      deadline: '2026-04-20',
      skills: ['React', 'Node.js', 'MongoDB'],
      receivedDate: '2026-01-28',
      priority: 'medium'
    },
    {
      id: '3',
      projectName: 'IoT Smart Home System',
      groupName: 'SE2024-C',
      studentCount: 3,
      description: 'Hệ thống nhà thông minh với IoT devices và mobile app',
      deadline: '2026-05-10',
      skills: ['IoT', 'Flutter', 'Firebase'],
      receivedDate: '2026-01-25',
      priority: 'low'
    },
    {
      id: '4',
      projectName: 'Blockchain Voting System',
      groupName: 'SE2024-D',
      studentCount: 4,
      description: 'Hệ thống bỏ phiếu điện tử sử dụng công nghệ blockchain',
      deadline: '2026-03-30',
      skills: ['Blockchain', 'Solidity', 'Web3'],
      receivedDate: '2026-02-02',
      priority: 'high'
    }
  ]);

  const handleAccept = (id: string) => {
    setInvitations(invitations.filter(inv => inv.id !== id));
    // Show success notification
    alert('Đã chấp nhận lời mời thành công!');
  };

  const handleReject = (id: string) => {
    setInvitations(invitations.filter(inv => inv.id !== id));
    // Show notification
    alert('Đã từ chối lời mời.');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--text-secondary)';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Ưu tiên cao';
      case 'medium': return 'Ưu tiên trung bình';
      case 'low': return 'Ưu tiên thấp';
      default: return '';
    }
  };

  return (
    <div className="mentor-modern-page">
      <div className="page-header">
        <h1 className="fancy-title">Lời mời hướng dẫn</h1>
        <p className="fancy-subtitle">
          Quản lý các lời mời tham gia hướng dẫn dự án sinh viên
        </p>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📨</div>
          <div className="stat-title">Tổng lời mời</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>{invitations.length}</div>
        </div>
        
        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔥</div>
          <div className="stat-title">Ưu tiên cao</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>
            {invitations.filter(inv => inv.priority === 'high').length}
          </div>
        </div>

        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
          <div className="stat-title">Sinh viên chờ</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>
            {invitations.reduce((sum, inv) => sum + inv.studentCount, 0)}
          </div>
        </div>
      </div>

      {/* No invitations message */}
      {invitations.length === 0 && (
        <div className="modern-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Không có lời mời mới
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Bạn đã xử lý tất cả các lời mời hướng dẫn
          </p>
        </div>
      )}

      {/* Invitation Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {invitations.map((invitation, index) => (
          <div 
            key={invitation.id}
            className="modern-card"
            style={{ 
              padding: '28px',
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ 
                    fontSize: '22px', 
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>
                    {invitation.projectName}
                  </h3>
                  <span 
                    className="status-badge"
                    style={{ 
                      background: `${getPriorityColor(invitation.priority)}15`,
                      color: getPriorityColor(invitation.priority)
                    }}
                  >
                    {getPriorityText(invitation.priority)}
                  </span>
                </div>
                <p style={{ 
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  <TeamOutlined /> {invitation.groupName} • {invitation.studentCount} sinh viên
                </p>
              </div>
              <div style={{ 
                fontSize: '13px',
                color: 'var(--text-light)',
                textAlign: 'right'
              }}>
                Nhận {new Date(invitation.receivedDate).toLocaleDateString('vi-VN')}
              </div>
            </div>

            {/* Description */}
            <p style={{ 
              fontSize: '15px',
              lineHeight: '1.7',
              color: 'var(--text-secondary)',
              marginBottom: '20px'
            }}>
              {invitation.description}
            </p>

            {/* Skills Tags */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                display: 'block',
                marginBottom: '8px'
              }}>
                Kỹ năng yêu cầu:
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {invitation.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    style={{
                      padding: '6px 14px',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                      color: 'var(--primary)',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Meta Info */}
            <div style={{ 
              display: 'flex',
              gap: '24px',
              padding: '16px',
              background: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined style={{ color: 'var(--primary)', fontSize: '16px' }} />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>Deadline</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {new Date(invitation.deadline).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClockCircleOutlined style={{ color: 'var(--warning)', fontSize: '16px' }} />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>Thời gian còn lại</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {Math.ceil((new Date(invitation.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} ngày
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-success"
                onClick={() => handleAccept(invitation.id)}
                style={{ flex: 1, fontSize: '15px', padding: '12px' }}
              >
                <CheckCircleOutlined /> Chấp nhận
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleReject(invitation.id)}
                style={{ flex: 1, fontSize: '15px', padding: '12px' }}
              >
                <CloseCircleOutlined /> Từ chối
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectInvitations;