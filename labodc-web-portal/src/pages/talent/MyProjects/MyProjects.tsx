import React, { useEffect, useState } from 'react';
import { Card, Tag, Progress, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { projectService } from '@/services/project.service';
import type { IProject } from '@/types/project.types';
import { ROUTES } from '@/utils/constants';
import '@/pages/enterprise/enterprise-modern.css';

const statusLabel: Record<string, string> = {
  draft: 'Nháp',
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  inProgress: 'Đang thực hiện',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  rejected: 'Từ chối',
};

const getStatusColor = (status: string) => {
  const s = status?.toLowerCase?.();
  if (s === 'completed') return 'green';
  if (s === 'inprogress') return 'blue';
  if (s === 'approved') return 'cyan';
  return 'default';
};

const MyProjects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        setLoading(true);
        const list = await projectService.getMyProjects();
        setProjects(list);
      } catch (e: any) {
        message.error(e?.message ?? 'Không tải được dự án của tôi');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProjects();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Dự án của tôi</h1>
        <Button type="primary" onClick={() => navigate('/talent/projects/browse')}>
          Duyệt thêm dự án
        </Button>
      </div>

      <p className="project-subtitle" style={{ marginBottom: 24 }}>
        Các dự án bạn đã tham gia.
      </p>

      <div className="project-grid">
        {projects.map((project) => (
          <Card key={project.id} className="modern-card project-card" loading={loading}>
            <div className="project-card-header">
              <div>
                <Link to={ROUTES.TALENT_PROJECT_DETAIL.replace(':id', project.id)}>
                  <div className="project-title">{project.title}</div>
                </Link>
                <div className="project-subtitle">
                  Trạng thái: {statusLabel[project.status?.toLowerCase?.()] ?? project.status}
                </div>
              </div>
              <Tag color={getStatusColor(project.status ?? '')}>
                {statusLabel[project.status?.toLowerCase?.()] ?? project.status}
              </Tag>
            </div>

            {project.description && (
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: 14 }}>
                {project.description}
              </p>
            )}

            <div className="project-progress">
              <div className="metric-label">Tiến độ</div>
              <Progress percent={project.progress ?? 0} />
            </div>

            <div className="project-actions" style={{ marginTop: 16 }}>
              <Button type="link" onClick={() => navigate(`/talent/projects/${project.id}`)}>
                Xem chi tiết
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {!loading && projects.length === 0 && (
        <Card className="modern-card" style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Bạn chưa tham gia dự án nào.</p>
          <Button type="primary" onClick={() => navigate('/talent/projects/browse')}>
            Duyệt dự án
          </Button>
        </Card>
      )}
    </div>
  );
};

export default MyProjects;
