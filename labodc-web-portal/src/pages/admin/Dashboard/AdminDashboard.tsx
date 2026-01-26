import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Timeline,
  Progress,
  Typography,
  Space,
  Button,
  Alert,
  Spin
} from 'antd';
import {
  ProjectOutlined,
  ShopOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { dashboardService } from '../../services/admin/dashboardService';
import type { DashboardStats, RecentActivity, PendingApproval } from '../../services/admin/dashboardService';
import styles from './Dashboard.module.css';

const { Title, Text } = Typography;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, activitiesData, approvalsData, chartData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivities(),
        dashboardService.getPendingApprovals(),
        dashboardService.getRevenueChart(6)
      ]);

      setStats(statsData);
      setActivities(activitiesData);
      setPendingApprovals(approvalsData);
      setRevenueData(chartData);
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      setError(error.response?.data?.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <ClockCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'processing';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      default: return 'blue';
    }
  };

  const pendingColumns = [
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'enterprise' ? 'blue' : 'green'}>
          {type === 'enterprise' ? 'Doanh nghiệp' : 'Dự án'}
        </Tag>
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'high' ? 'Cao' : priority === 'medium' ? 'Trung bình' : 'Thấp'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: PendingApproval) => (
        <Space>
          <Button type="link" size="small">Xem chi tiết</Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" danger onClick={loadDashboardData}>
            Thử lại
          </Button>
        }
      />
    );
  }

  if (!stats) return null;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Dashboard Quản trị</Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số Dự án"
              value={stats.projects.total}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={
                <Text type="secondary" style={{ fontSize: 14 }}>
                  +{stats.projects.new} mới
                </Text>
              }
            />
            <Progress
              percent={stats.projects.successRate}
              size="small"
              status="active"
              style={{ marginTop: 8 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Tỷ lệ thành công
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh nghiệp"
              value={stats.enterprises.total}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={
                <Text type="secondary" style={{ fontSize: 14 }}>
                  +{stats.enterprises.new} mới
                </Text>
              }
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Đang hoạt động: <Text strong>{stats.enterprises.active}</Text>
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sinh viên"
              value={stats.talents.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix={
                <Text type="secondary" style={{ fontSize: 14 }}>
                  +{stats.talents.new} mới
                </Text>
              }
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Đánh giá TB: <Text strong>{stats.talents.averageRating}/10</Text>
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={stats.financials.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#cf1322' }}
              formatter={(value) => formatCurrency(value as number)}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Lab: {formatCurrency(stats.financials.labRevenue)}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="Tiến độ Dự án" size="small">
            <Statistic
              title="Hoàn thành trung bình"
              value={stats.performance.avgProjectCompletion}
              suffix="%"
              prefix={stats.performance.avgProjectCompletion >= 75 ? <RiseOutlined /> : <FallOutlined />}
              valueStyle={{
                color: stats.performance.avgProjectCompletion >= 75 ? '#3f8600' : '#cf1322'
              }}
            />
            <Progress
              percent={stats.performance.avgProjectCompletion}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Giao hàng Đúng hạn" size="small">
            <Statistic
              title="Tỷ lệ"
              value={stats.performance.onTimeDelivery}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
            <Progress
              percent={stats.performance.onTimeDelivery}
              status="active"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Hài lòng Khách hàng" size="small">
            <Statistic
              title="Đánh giá"
              value={stats.performance.customerSatisfaction}
              suffix="/ 5.0"
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress
              percent={(stats.performance.customerSatisfaction / 5) * 100}
              strokeColor="#52c41a"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Doanh thu 6 tháng gần đây" size="small">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}B`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="Doanh thu"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Phân bổ Quỹ (70/20/10)" size="small">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Team', value: stats.financials.teamDisbursed, percent: 70 },
                  { name: 'Mentor', value: stats.financials.mentorDisbursed, percent: 20 },
                  { name: 'Lab', value: stats.financials.labRevenue, percent: 10 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}B`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Activities & Approvals */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Hoạt động gần đây" size="small">
            <Timeline>
              {activities.map((activity) => (
                <Timeline.Item
                  key={activity.id}
                  dot={getStatusIcon(activity.status)}
                >
                  <div>
                    <Text strong>{activity.title}</Text>
                    <br />
                    <Text type="secondary">{activity.description}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <ClockCircleOutlined /> {activity.timestamp}
                    </Text>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={`Chờ phê duyệt (${pendingApprovals.length})`}
            size="small"
            extra={<Button type="primary" size="small">Xem tất cả</Button>}
          >
            <Table
              dataSource={pendingApprovals}
              columns={pendingColumns}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}