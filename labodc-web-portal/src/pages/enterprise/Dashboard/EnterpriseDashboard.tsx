// Enterprise Dashboard
import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Button, Table } from 'antd';
import {
  ProjectOutlined,
  DollarOutlined,
  TeamOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatCurrencyVND } from '@/utils/formatters';
import styles from './EnterpriseDashboard.module.css';

const EnterpriseDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - replace with real data from API
  const stats = {
    totalProjects: 12,
    activeProjects: 5,
    completedProjects: 7,
    totalSpent: 500000000,
    pendingPayments: 50000000,
  };

  const recentProjects = [
    {
      key: '1',
      name: 'Website E-commerce',
      status: 'IN_PROGRESS',
      progress: 65,
      members: 5,
    },
    {
      key: '2',
      name: 'Mobile App iOS',
      status: 'IN_PROGRESS',
      progress: 40,
      members: 4,
    },
    {
      key: '3',
      name: 'AI Chatbot',
      status: 'COMPLETED',
      progress: 100,
      members: 3,
    },
  ];

  const columns = [
    {
      title: 'Tên dự án',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => <Progress percent={progress} />,
    },
    {
      title: 'Thành viên',
      dataIndex: 'members',
      key: 'members',
      render: (members: number) => (
        <>
          <TeamOutlined /> {members}
        </>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/enterprise/projects/${record.key}`)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className="page-title">Dashboard Doanh nghiệp</h1>
        <Button type="primary" onClick={() => navigate('/enterprise/projects/new')}>
          Đề xuất dự án mới
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng dự án"
              value={stats.totalProjects}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#17a2b8' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang thực hiện"
              value={stats.activeProjects}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#FFC107' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã hoàn thành"
              value={stats.completedProjects}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#4CAF50' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng chi phí"
              value={stats.totalSpent}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrencyVND(Number(value))}
              valueStyle={{ color: '#17a2b8' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Dự án gần đây" extra={<Button type="link">Xem tất cả</Button>}>
            <Table columns={columns} dataSource={recentProjects} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EnterpriseDashboard;
