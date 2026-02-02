import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Button, Table, Tag } from 'antd';
import {
  ProjectOutlined,
  DollarOutlined,
  TeamOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  getEnterpriseDashboardSummary,
  getRecentProjects,
} from '@/services/enterprise/dashboard.service';
import { formatCurrencyVND } from '@/utils/formatters';
import '../enterprise-modern.css';

const EnterpriseDashboard: React.FC = () => {
  const navigate = useNavigate();

  // ✅ STATE
  const [summary, setSummary] = useState<any>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: 0,
  });

  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const summaryRes = await getEnterpriseDashboardSummary();
        const projectsRes = await getRecentProjects();

        setSummary(summaryRes);
        setRecentProjects(projectsRes);
      } catch (error) {
        console.error('Load dashboard failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'Tên dự án',
      dataIndex: 'name',
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      render: (v: number) => <Progress percent={v} />,
    },
    {
      title: 'Thành viên',
      dataIndex: 'members',
      render: (v: number) => (
        <>
          <TeamOutlined /> {v}
        </>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (s: string) => (
        <Tag color={s === 'COMPLETED' ? 'green' : 'blue'}>{s}</Tag>
      ),
    },
    {
      title: 'Hành động',
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={() => navigate(`/enterprise/projects/${record.id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <div className="page-header">
        <h1>Dashboard Doanh nghiệp</h1>
        <Button type="primary" onClick={() => navigate('/enterprise/projects/new')}>
          Đề xuất dự án mới
        </Button>
      </div>

      {/* SUMMARY */}
      <Row gutter={16} className="stat-row">
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic title="Tổng dự án" value={summary.totalProjects} prefix={<ProjectOutlined />} />
          </Card>
        </Col>

        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Đang thực hiện"
              value={summary.activeProjects}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Hoàn thành"
              value={summary.completedProjects}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#22c55e' }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Tổng chi phí"
              value={summary.totalSpent}
              prefix={<DollarOutlined />}
              formatter={(v) => formatCurrencyVND(Number(v))}
            />
          </Card>
        </Col>
      </Row>

      {/* TABLE */}
      <Card
        title="Dự án gần đây"
        className="table-card"
        loading={loading}
        extra={
          <Button type="link" onClick={() => navigate('/enterprise/projects')}>
            Xem tất cả
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={recentProjects}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default EnterpriseDashboard;
