import React, { useState } from "react";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import "../mentor-modern.css";

interface Student {
  id: string;
  name: string;
  status: 'excellent' | 'good' | 'average';
  statusText: string;
  technicalSkills: number;
  progress: number;
  attendance: number;
  teamwork: number;
  avatar: string;
}

interface RatingProps {
  value: number;
  max?: number;
}

const Rating: React.FC<RatingProps> = ({ value, max = 5 }) => {
  return (
    <div className="rating-stars">
      {[...Array(max)].map((_, index) => (
        <span key={index} className="star">
          {index < value ? <StarFilled /> : <StarOutlined />}
        </span>
      ))}
    </div>
  );
};

interface ProgressBarProps {
  percent: number;
  type?: 'success' | 'warning' | 'danger';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent, type = 'success' }) => {
  const getColor = () => {
    if (type === 'warning') return 'warning';
    if (type === 'danger') return 'var(--danger)';
    return 'success';
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: 600
      }}>
        <span style={{ color: 'var(--text-secondary)' }}>Tiến độ</span>
        <span style={{ color: 'var(--text-primary)' }}>{percent}%</span>
      </div>
      <div className="progress-wrapper">
        <div 
          className={`progress-bar ${getColor()}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const Evaluation: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const students: Student[] = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      status: 'excellent',
      statusText: 'Xuất sắc',
      technicalSkills: 5,
      progress: 95,
      attendance: 100,
      teamwork: 5,
      avatar: '👨‍💻'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      status: 'good',
      statusText: 'Khá',
      technicalSkills: 4,
      progress: 70,
      attendance: 85,
      teamwork: 4,
      avatar: '👩‍💻'
    },
    {
      id: '3',
      name: 'Lê Văn C',
      status: 'excellent',
      statusText: 'Xuất sắc',
      technicalSkills: 5,
      progress: 88,
      attendance: 95,
      teamwork: 5,
      avatar: '👨‍🎓'
    },
    {
      id: '4',
      name: 'Phạm Thị D',
      status: 'good',
      statusText: 'Khá',
      technicalSkills: 4,
      progress: 75,
      attendance: 90,
      teamwork: 4,
      avatar: '👩‍🎓'
    }
  ];

  return (
    <div className="mentor-modern-page">
      <div className="page-header">
        <h1 className="fancy-title">Đánh giá sinh viên</h1>
        <p className="fancy-subtitle">
          Chất lượng làm việc & mức độ hoàn thành
        </p>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⭐</div>
          <div className="stat-title">Điểm trung bình</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>4.5</div>
          <div style={{ color: 'var(--success)', marginTop: '8px', fontSize: '14px', fontWeight: 600 }}>
            ↑ 0.3 so với kỳ trước
          </div>
        </div>
        
        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
          <div className="stat-title">Tiến độ TB</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>82%</div>
          <div style={{ color: 'var(--success)', marginTop: '8px', fontSize: '14px', fontWeight: 600 }}>
            ↑ 12% so với tháng trước
          </div>
        </div>

        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
          <div className="stat-title">Hoàn thành</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>75%</div>
          <div style={{ color: 'var(--warning)', marginTop: '8px', fontSize: '14px', fontWeight: 600 }}>
            ↓ 5% so với kỳ trước
          </div>
        </div>
      </div>

      {/* Student Evaluation Cards */}
      <div className="content-grid">
        {students.map((student) => (
          <div 
            key={student.id}
            className="modern-card evaluation-card"
            style={{ 
              cursor: 'pointer',
              border: selectedStudent === student.id ? '2px solid var(--primary)' : 'none'
            }}
            onClick={() => setSelectedStudent(
              selectedStudent === student.id ? null : student.id
            )}
          >
            {/* Header */}
            <div className="evaluation-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  fontSize: '32px',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px'
                }}>
                  {student.avatar}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                    {student.name}
                  </h3>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    MSSV: SV{student.id.padStart(6, '0')}
                  </span>
                </div>
              </div>
              <span className={`status-badge ${student.status}`}>
                {student.statusText}
              </span>
            </div>

            {/* Metrics */}
            <div className="eval-metric">
              <label className="eval-label">Kỹ năng kỹ thuật</label>
              <Rating value={student.technicalSkills} />
            </div>

            <div className="eval-metric">
              <label className="eval-label">Tiến độ dự án</label>
              <ProgressBar 
                percent={student.progress} 
                type={student.progress >= 80 ? 'success' : 'warning'}
              />
            </div>

            <div className="eval-metric">
              <label className="eval-label">Chuyên cần</label>
              <ProgressBar 
                percent={student.attendance}
                type={student.attendance >= 90 ? 'success' : 'warning'}
              />
            </div>

            <div className="eval-metric">
              <label className="eval-label">Làm việc nhóm</label>
              <Rating value={student.teamwork} />
            </div>

            {/* Detailed Info - Show when selected */}
            {selectedStudent === student.id && (
              <div style={{ 
                marginTop: '20px', 
                paddingTop: '20px',
                borderTop: '1px solid #f0f0f0',
                animation: 'fadeInUp 0.3s ease-out'
              }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: 700, 
                  marginBottom: '12px',
                  color: 'var(--text-primary)'
                }}>
                  Nhận xét chi tiết
                </h4>
                <p style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  marginBottom: '16px'
                }}>
                  Sinh viên thể hiện tốt trong các nhiệm vụ được giao. 
                  Có khả năng tự học và nghiên cứu tốt. Cần cải thiện kỹ năng 
                  làm việc nhóm và giao tiếp.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary" style={{ flex: 1 }}>
                    Cập nhật đánh giá
                  </button>
                  <button className="btn btn-success" style={{ flex: 1 }}>
                    Xem chi tiết
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Assessment */}
      <div className="modern-card" style={{ marginTop: '32px' }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          marginBottom: '20px',
          color: 'var(--text-primary)'
        }}>
          Nhận xét chung
        </h3>
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          padding: '20px',
          borderRadius: '12px',
          borderLeft: '4px solid var(--primary)'
        }}>
          <p style={{ 
            fontSize: '15px', 
            lineHeight: '1.7',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Nhìn chung, các sinh viên trong nhóm đều có tiến bộ rõ rệt so với đầu kỳ. 
            Kỹ năng kỹ thuật được cải thiện đáng kể thông qua các dự án thực tế. 
            Tuy nhiên, cần tăng cường hoạt động teamwork và kỹ năng mềm để chuẩn bị 
            tốt hơn cho môi trường làm việc chuyên nghiệp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Evaluation;