import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Button, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '@/services/project.service';
import type { IProjectDetail } from '@/types/project.types';
import { formatCurrencyVND } from '@/utils/formatters';
import '@/pages/enterprise/enterprise-modern.css';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<IProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await projectService.getProjectById(id);
        setProject(data);
      } catch (e: any) {
        message.error(e?.message ?? 'Không tải được dự án');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-wrapper">
        <Card className="modern-card">
          <p style={{ marginBottom: 16 }}>Không tìm thấy dự án.</p>
          <Button type="primary" onClick={() => navigate('/talent/my-projects')}>
            Quay lại Dự án của tôi
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Chi tiết dự án</h1>
        <Button onClick={() => navigate('/talent/my-projects')}>Quay lại</Button>
      </div>

      <Card className="modern-card">
        <Descriptions bordered column={1} labelStyle={{ width: 160 }}>
          <Descriptions.Item label="Tên dự án">{project.title}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">{project.description || '—'}</Descriptions.Item>
          <Descriptions.Item label="Mục tiêu">{project.objectives || '—'}</Descriptions.Item>
          <Descriptions.Item label="Ngân sách">
            {project.budget != null ? formatCurrencyVND(project.budget) : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{project.status}</Descriptions.Item>
          <Descriptions.Item label="Tiến độ">{project.progress ?? 0}%</Descriptions.Item>
          <Descriptions.Item label="Công nghệ">
            {project.technologies?.length ? project.technologies.join(', ') : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Kỹ năng yêu cầu">
            {project.requiredSkills?.length ? project.requiredSkills.join(', ') : '—'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProjectDetail;
