import React, { useState } from "react";
import { 
  EyeOutlined, 
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import "../mentor-modern.css";

interface Report {
  id: string;
  student: string;
  studentId: string;
  reportName: string;
  status: 'submitted' | 'pending' | 'late';
  submittedDate?: string;
  dueDate: string;
  score?: number;
  fileSize?: string;
}

const ReportSubmission: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const reports: Report[] = [
    {
      id: '1',
      student: 'Nguyễn Văn A',
      studentId: 'SV001',
      reportName: 'Báo cáo Sprint 1',
      status: 'submitted',
      submittedDate: '2026-01-30',
      dueDate: '2026-02-01',
      score: 9.5,
      fileSize: '2.4 MB'
    },
    {
      id: '2',
      student: 'Trần Thị B',
      studentId: 'SV002',
      reportName: 'Báo cáo Sprint 1',
      status: 'pending',
      dueDate: '2026-02-01'
    },
    {
      id: '3',
      student: 'Lê Văn C',
      studentId: 'SV003',
      reportName: 'Báo cáo Sprint 1',
      status: 'submitted',
      submittedDate: '2026-02-01',
      dueDate: '2026-02-01',
      score: 8.5,
      fileSize: '1.8 MB'
    },
    {
      id: '4',
      student: 'Phạm Thị D',
      studentId: 'SV004',
      reportName: 'Báo cáo Sprint 1',
      status: 'late',
      submittedDate: '2026-02-03',
      dueDate: '2026-02-01',
      score: 7.0,
      fileSize: '3.1 MB'
    },
    {
      id: '5',
      student: 'Hoàng Văn E',
      studentId: 'SV005',
      reportName: 'Báo cáo Sprint 2',
      status: 'submitted',
      submittedDate: '2026-02-02',
      dueDate: '2026-02-05',
      score: 9.0,
      fileSize: '2.2 MB'
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reportName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'submitted':
        return { 
          icon: <CheckCircleOutlined />, 
          text: 'Đã nộp', 
          color: 'var(--success)',
          bg: 'rgba(16, 185, 129, 0.1)'
        };
      case 'pending':
        return { 
          icon: <ClockCircleOutlined />, 
          text: 'Chưa nộp', 
          color: 'var(--warning)',
          bg: 'rgba(245, 158, 11, 0.1)'
        };
      case 'late':
        return { 
          icon: <CloseCircleOutlined />, 
          text: 'Nộp trễ', 
          color: 'var(--danger)',
          bg: 'rgba(239, 68, 68, 0.1)'
        };
      default:
        return { 
          icon: null, 
          text: '', 
          color: '',
          bg: ''
        };
    }
  };

  const stats = {
    total: reports.length,
    submitted: reports.filter(r => r.status === 'submitted').length,
    pending: reports.filter(r => r.status === 'pending').length,
    late: reports.filter(r => r.status === 'late').length,
    avgScore: reports.filter(r => r.score).reduce((sum, r) => sum + (r.score || 0), 0) / 
              reports.filter(r => r.score).length
  };

  return (
    <div className="mentor-modern-page">
      <div className="page-header">
        <h1 className="fancy-title">Báo cáo sinh viên</h1>
        <p className="fancy-subtitle">Theo dõi & kiểm tra báo cáo nộp</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
          <div className="stat-title">Tổng báo cáo</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>{stats.total}</div>
        </div>
        
        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
          <div className="stat-title">Đã nộp</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>{stats.submitted}</div>
          <div style={{ color: 'var(--success)', marginTop: '8px', fontSize: '14px' }}>
            {Math.round((stats.submitted / stats.total) * 100)}% tỷ lệ hoàn thành
          </div>
        </div>

        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏰</div>
          <div className="stat-title">Chưa nộp</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>{stats.pending}</div>
        </div>

        <div className="modern-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⭐</div>
          <div className="stat-title">Điểm TB</div>
          <div className="stat-value" style={{ fontSize: '36px' }}>
            {stats.avgScore.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="modern-card" style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <SearchOutlined style={{ 
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              fontSize: '16px'
            }} />
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên hoặc báo cáo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                border: '2px solid #f0f0f0',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = '#f0f0f0'}
            />
          </div>

          {/* Filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn"
              onClick={() => setFilterStatus('all')}
              style={{
                background: filterStatus === 'all' ? 'var(--primary)' : 'white',
                color: filterStatus === 'all' ? 'white' : 'var(--text-primary)',
                border: filterStatus === 'all' ? 'none' : '2px solid #f0f0f0'
              }}
            >
              <FilterOutlined /> Tất cả
            </button>
            <button
              className="btn"
              onClick={() => setFilterStatus('submitted')}
              style={{
                background: filterStatus === 'submitted' ? 'var(--success)' : 'white',
                color: filterStatus === 'submitted' ? 'white' : 'var(--text-primary)',
                border: filterStatus === 'submitted' ? 'none' : '2px solid #f0f0f0'
              }}
            >
              Đã nộp
            </button>
            <button
              className="btn"
              onClick={() => setFilterStatus('pending')}
              style={{
                background: filterStatus === 'pending' ? 'var(--warning)' : 'white',
                color: filterStatus === 'pending' ? 'white' : 'var(--text-primary)',
                border: filterStatus === 'pending' ? 'none' : '2px solid #f0f0f0'
              }}
            >
              Chưa nộp
            </button>
            <button
              className="btn"
              onClick={() => setFilterStatus('late')}
              style={{
                background: filterStatus === 'late' ? 'var(--danger)' : 'white',
                color: filterStatus === 'late' ? 'white' : 'var(--text-primary)',
                border: filterStatus === 'late' ? 'none' : '2px solid #f0f0f0'
              }}
            >
              Nộp trễ
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="modern-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="modern-table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>SINH VIÊN</th>
                <th>BÁO CÁO</th>
                <th>TRẠNG THÁI</th>
                <th>NGÀY NỘP</th>
                <th>DEADLINE</th>
                <th>ĐIỂM</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => {
                const statusInfo = getStatusInfo(report.status);
                return (
                  <tr key={report.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {report.student}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {report.studentId}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 500 }}>{report.reportName}</div>
                        {report.fileSize && (
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            {report.fileSize}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
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
                    </td>
                    <td>
                      {report.submittedDate ? (
                        <span style={{ color: 'var(--text-primary)' }}>
                          {new Date(report.submittedDate).toLocaleDateString('vi-VN')}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-light)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {new Date(report.dueDate).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td>
                      {report.score ? (
                        <span style={{
                          fontWeight: 700,
                          fontSize: '16px',
                          color: report.score >= 8 ? 'var(--success)' : 
                                 report.score >= 5 ? 'var(--warning)' : 'var(--danger)'
                        }}>
                          {report.score}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-light)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '13px' }}
                        >
                          <EyeOutlined /> Xem
                        </button>
                        {report.status === 'submitted' && (
                          <button 
                            className="btn"
                            style={{ 
                              padding: '8px 16px', 
                              fontSize: '13px',
                              background: 'white',
                              border: '2px solid #f0f0f0',
                              color: 'var(--text-primary)'
                            }}
                          >
                            <DownloadOutlined />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* No results message */}
      {filteredReports.length === 0 && (
        <div className="modern-card" style={{ textAlign: 'center', padding: '60px 20px', marginTop: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Không tìm thấy kết quả
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportSubmission;