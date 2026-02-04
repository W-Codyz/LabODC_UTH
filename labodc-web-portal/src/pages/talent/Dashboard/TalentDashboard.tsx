import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Button, Table, Tag, Progress } from 'antd';
import { ProjectOutlined, CheckSquareOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { projectService } from '@/services/project.service';
import type { IProject } from '@/types/project.types';
import '@/pages/enterprise/enterprise-modern.css';

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    draft: 'Nháp',
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    inProgress: 'Đang thực hiện',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    rejected: 'Từ chối',
  };
  return map[status?.toLowerCase?.()] ?? status ?? '-';
};

const TalentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projectCount, setProjectCount] = useState(0);
  const [recentProjects, setRecentProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const list = await projectService.getMyProjects();
        setProjectCount(list?.length ?? 0);
        setRecentProjects(list?.slice(0, 5) ?? []);
      } catch {
        setProjectCount(0);
        setRecentProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { title: 'Tên dự án', dataIndex: 'title', key: 'title' },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (v: number) => <Progress percent={v ?? 0} size="small" />,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => (
        <Tag color={s?.toLowerCase() === 'completed' ? 'green' : 'blue'}>
          {getStatusLabel(s)}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: IProject) => (
        <Button type="link" onClick={() => navigate(`/talent/projects/${record.id}`)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Dashboard Talent</h1>
        <Button type="primary" onClick={() => navigate('/talent/projects/browse')}>
          Duyệt dự án
        </Button>
      </div>

      <Row gutter={16} className="stat-row">
        <Col xs={24} sm={12} md={8}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Dự án tham gia"
              value={projectCount}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#6366f1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Nhiệm vụ hoàn thành"
              value={0}
              prefix={<CheckSquareOutlined />}
              valueStyle={{ color: '#22c55e' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Điểm đánh giá"
              value={0}
              suffix="/ 5"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Dự án của tôi"
        className="table-card modern-card"
        loading={loading}
        extra={
          <Button type="link" onClick={() => navigate('/talent/my-projects')}>
            Xem tất cả
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={recentProjects}
          pagination={false}
          locale={{ emptyText: 'Chưa tham gia dự án nào' }}
        />
      </Card>
    </div>
  );
};

export default TalentDashboard;
