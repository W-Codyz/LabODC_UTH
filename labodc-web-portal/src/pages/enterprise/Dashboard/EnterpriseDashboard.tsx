import React from 'react';
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
} from '@/services/enterprise/enterpriseDashboard.service';
import { formatCurrencyVND } from '@/utils/formatters';
import styles from './EnterpriseDashboard.module.css';

const EnterpriseDashboard: React.FC = () => {
  const navigate = useNavigate();

  const summary = getEnterpriseDashboardSummary();
  const recentProjects = getRecentProjects();

  const columns = [
    {
      title: 'Tên dự án',
      dataIndex: 'name',
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      render: (progress: number) => <Progress percent={progress} />,
    },
    {
      title: 'Thành viên',
      dataIndex: 'members',
      render: (members: number) => (
        <>
          <TeamOutlined /> {members}
        </>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === 'COMPLETED' ? 'green' : 'blue'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={() => navigate(`/enterprise/projects/${record.key}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.dashboard}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>Dashboard Doanh nghiệp</h1>
        <Button
          type="primary"
          onClick={() => navigate('/enterprise/projects/new')}
        >
          Đề xuất dự án mới
        </Button>
      </div>

      {/* SUMMARY CARDS */}
      <Row gutter={16} className={styles.cardRow}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng dự án"
              value={summary.totalProjects}
              prefix={<ProjectOutlined />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Đang thực hiện"
              value={summary.activeProjects}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={summary.completedProjects}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng chi phí"
              value={summary.totalSpent}
              prefix={<DollarOutlined />}
              formatter={(v) => formatCurrencyVND(Number(v))}
            />
          </Card>
        </Col>
      </Row>

      {/* RECENT PROJECTS */}
      <Card
        title="Dự án gần đây"
        extra={
          <Button type="link" onClick={() => navigate('/enterprise/projects')}>
            Xem tất cả
          </Button>
        }
        className={styles.tableCard}
      >
        <Table
          columns={columns}
          dataSource={recentProjects}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default EnterpriseDashboard;
