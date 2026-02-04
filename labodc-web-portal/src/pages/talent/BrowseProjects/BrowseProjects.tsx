import React, { useEffect, useState } from 'react';
import { Card, Tag, Button, message } from 'antd';
import { ProjectOutlined } from '@ant-design/icons';
import { projectService } from '@/services/project.service';
import type { IProject } from '@/types/project.types';
import { formatCurrencyVND } from '@/utils/formatters';
import '@/pages/enterprise/enterprise-modern.css';

const BrowseProjects: React.FC = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const list = await projectService.getProjects({ status: 'approved' });
        setProjects(list);
      } catch (e: any) {
        message.error(e?.message ?? 'Không tải được danh sách dự án');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleJoin = async (projectId: string) => {
    try {
      setJoiningId(projectId);
      await projectService.joinProject(projectId);
      message.success('Đã gửi yêu cầu tham gia dự án');
      const list = await projectService.getProjects({ status: 'approved' });
      setProjects(list);
    } catch (e: any) {
      message.error(e?.message ?? 'Tham gia dự án thất bại');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Duyệt dự án</h1>
      </div>

      <p className="project-subtitle" style={{ marginBottom: 24 }}>
        Các dự án đã được phê duyệt, bạn có thể gửi yêu cầu tham gia.
      </p>

      <div className="project-grid" style={{ marginTop: 24 }}>
        {projects.map((project) => (
          <Card
            key={project.id}
            className="modern-card project-card"
            loading={loading}
          >
            <div className="project-card-header">
              <div>
                <div className="project-title">{project.title}</div>
                <div className="project-subtitle">
                  {project.teamSize ? `${project.teamSize} thành viên` : '—'}
                </div>
              </div>
              <Tag color="green">Đã duyệt</Tag>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: 14 }}>
              {project.description || '—'}
            </p>

            {project.technologies?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {project.technologies.map((t) => (
                  <Tag key={t} color="blue">{t}</Tag>
                ))}
              </div>
            )}
            {project.requiredSkills?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <span className="metric-label">Kỹ năng: </span>
                {project.requiredSkills.map((s) => (
                  <Tag key={s} color="green">{s}</Tag>
                ))}
              </div>
            )}

            <div className="project-metrics" style={{ marginBottom: 16 }}>
              <div>
                <div className="metric-label">Ngân sách</div>
                <div className="metric-value">
                  {project.budget != null ? formatCurrencyVND(project.budget) : '—'}
                </div>
              </div>
              <div>
                <div className="metric-label">Tiến độ</div>
                <div className="metric-value">{project.progress ?? 0}%</div>
              </div>
            </div>

            <div className="project-actions">
              <Button
                type="primary"
                icon={<ProjectOutlined />}
                onClick={() => handleJoin(project.id)}
                loading={joiningId === project.id}
              >
                Tham gia
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {!loading && projects.length === 0 && (
        <Card className="modern-card" style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Chưa có dự án nào.</p>
        </Card>
      )}
    </div>
  );
};

export default BrowseProjects;
