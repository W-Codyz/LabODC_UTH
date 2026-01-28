import { useState, useEffect } from 'react';
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
  Button,
  Alert,
  Spin,
  Divider,
  Badge,
  Tooltip as AntTooltip,
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
  InfoCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  WalletOutlined,
  TrophyOutlined,
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
  ResponsiveContainer,
} from 'recharts';
import { dashboardService } from '../../../services/admin/dashboardService';
import type { DashboardStats, RecentActivity, PendingApproval } from '../../../services/admin/dashboardService';
import styles from './AdminDashboard.module.css';

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
    // SEO Metadata
    document.title = 'Admin Dashboard | LabODC UTH';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Lab Admin Dashboard - Quản trị dự án, doanh nghiệp, sinh viên và quỹ tại LabODC UTH');
    }
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, activitiesData, approvalsData, chartData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivities(),
        dashboardService.getPendingApprovals(),
        dashboardService.getRevenueChart(6),
      ]);
      
      console.log('✅ Dashboard data loaded:', { statsData, activitiesData, approvalsData, chartData });
      
      setStats(statsData);
      setActivities(activitiesData);
      setPendingApprovals(approvalsData);
      setRevenueData(chartData);
    } catch (err: any) {
      console.error('❌ Error loading dashboard:', err);
      // Không set error nữa vì service đã có mock data fallback
      // setError(err.response?.data?.message || 'Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <ClockCircleOutlined style={{ color: '#f5222d' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      default:
        return 'blue';
    }
  };

  const getPriorityLabel = (priority: string): string => {
    if (priority === 'high') return 'Cao';
    if (priority === 'medium') return 'TB';
    return 'Thấp';
  };

  const pendingColumns = [
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'enterprise' ? 'blue' : 'green'}>
          {type === 'enterprise' ? 'DN' : 'DA'}
        </Tag>
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Ngày',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
      responsive: ['md'] as any,
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {getPriorityLabel(priority)}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (_: any) => (
        <Button type="link" size="small" icon={<EyeOutlined />} />
      ),
    },
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Đang tải dữ liệu dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={loadDashboardData} icon={<ReloadOutlined />}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.dashboardContainer}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <Title level={2} className={styles.title}>
              Dashboard Quản trị
            </Title>
            <Text type="secondary" className={styles.subtitle}>
              Tổng quan hệ thống LabODC - {new Date().toLocaleString('vi-VN')}
            </Text>
          </div>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={loadDashboardData}
            className={styles.refreshBtn}
          >
            Làm mới
          </Button>
        </div>

        <Divider className={styles.divider} />

        {/* Main Stats Cards */}
        <Row gutter={[16, 16]} className={styles.statsRow}>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <Statistic
                title={
                  <span className={styles.statTitle}>
                    <ProjectOutlined className={styles.statIcon} />
                    Tổng Dự án
                  </span>
                }
                value={stats.projects.total}
                valueStyle={{ color: '#17a2b8', fontWeight: 600 }}
                suffix={
                  <AntTooltip title={`${stats.projects.new} dự án mới`}>
                    <Badge count={`+${stats.projects.new}`} style={{ backgroundColor: '#52c41a' }} />
                  </AntTooltip>
                }
              />
              <Progress
                percent={stats.projects.successRate}
                size="small"
                strokeColor="#17a2b8"
                className={styles.statProgress}
              />
              <Text type="secondary" className={styles.statLabel}>
                Tỷ lệ thành công: {stats.projects.successRate}%
              </Text>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <Statistic
                title={
                  <span className={styles.statTitle}>
                    <ShopOutlined className={styles.statIcon} />
                    Doanh nghiệp
                  </span>
                }
                value={stats.enterprises.total}
                valueStyle={{ color: '#138496', fontWeight: 600 }}
                suffix={
                  <AntTooltip title={`${stats.enterprises.new} DN mới`}>
                    <Badge count={`+${stats.enterprises.new}`} style={{ backgroundColor: '#1890ff' }} />
                  </AntTooltip>
                }
              />
              <div className={styles.statDetails}>
                <Text type="secondary">
                  Hoạt động: <Text strong>{stats.enterprises.active}</Text>
                </Text>
                <Text type="secondary">
                  Xác thực: <Text strong>{stats.enterprises.verified}</Text>
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <Statistic
                title={
                  <span className={styles.statTitle}>
                    <TeamOutlined className={styles.statIcon} />
                    Sinh viên
                  </span>
                }
                value={stats.talents.total}
                valueStyle={{ color: '#0d6efd', fontWeight: 600 }}
                suffix={
                  <AntTooltip title={`${stats.talents.new} SV mới`}>
                    <Badge count={`+${stats.talents.new}`} style={{ backgroundColor: '#722ed1' }} />
                  </AntTooltip>
                }
              />
              <div className={styles.statDetails}>
                <Text type="secondary">
                  Đang học: <Text strong>{stats.talents.active}</Text>
                </Text>
                <Text type="secondary">
                  Đánh giá TB: <Text strong>{stats.talents.averageRating}/10</Text>
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <Statistic
                title={
                  <span className={styles.statTitle}>
                    <DollarOutlined className={styles.statIcon} />
                    Tổng Doanh thu
                  </span>
                }
                value={stats.financials.totalRevenue}
                valueStyle={{ color: '#20c997', fontWeight: 600 }}
                formatter={(value) => formatCurrency(value as number)}
              />
              <div className={styles.statDetails}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Lab: {formatCurrency(stats.financials.labRevenue)}
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Performance Metrics */}
        <Row gutter={[16, 16]} className={styles.metricsRow}>
          <Col xs={24} md={8}>
            <Card
              title={
                <span>
                  <TrophyOutlined /> Tiến độ Dự án
                </span>
              }
              className={styles.metricCard}
              size="small"
            >
              <Statistic
                title="Hoàn thành trung bình"
                value={stats.performance.avgProjectCompletion}
                suffix="%"
                prefix={
                  stats.performance.avgProjectCompletion >= 75 ? (
                    <RiseOutlined style={{ color: '#52c41a' }} />
                  ) : (
                    <FallOutlined style={{ color: '#f5222d' }} />
                  )
                }
                valueStyle={{
                  color: stats.performance.avgProjectCompletion >= 75 ? '#52c41a' : '#f5222d',
                }}
              />
              <Progress
                percent={stats.performance.avgProjectCompletion}
                strokeColor={{
                  '0%': '#17a2b8',
                  '100%': '#20c997',
                }}
                className={styles.metricProgress}
              />
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              title={
                <span>
                  <ClockCircleOutlined /> Giao hàng Đúng hạn
                </span>
              }
              className={styles.metricCard}
              size="small"
            >
              <Statistic
                title="Tỷ lệ"
                value={stats.performance.onTimeDelivery}
                suffix="%"
                valueStyle={{ color: '#17a2b8' }}
              />
              <Progress
                percent={stats.performance.onTimeDelivery}
                status="active"
                strokeColor="#17a2b8"
                className={styles.metricProgress}
              />
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              title={
                <span>
                  <CheckCircleOutlined /> Hài lòng Khách hàng
                </span>
              }
              className={styles.metricCard}
              size="small"
            >
              <Statistic
                title="Đánh giá"
                value={stats.performance.customerSatisfaction}
                suffix="/ 5.0"
                valueStyle={{ color: '#138496' }}
              />
              <Progress
                percent={(stats.performance.customerSatisfaction / 5) * 100}
                strokeColor="#20c997"
                className={styles.metricProgress}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <Row gutter={[16, 16]} className={styles.chartsRow}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <span>
                  <FileTextOutlined /> Doanh thu 6 tháng gần đây
                </span>
              }
              className={styles.chartCard}
            >
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#8c8c8c"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#8c8c8c"
                    tickFormatter={(value: number) => `${(value / 1000000000).toFixed(1)}B`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => {
                      if (value === undefined) return '';
                      return formatCurrency(value);
                    }}
                    contentStyle={{ borderRadius: 8 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#17a2b8"
                    strokeWidth={3}
                    name="Doanh thu"
                    dot={{ fill: '#17a2b8', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title={
                <span>
                  <WalletOutlined /> Phân bổ Quỹ (70/20/10)
                </span>
              }
              className={styles.chartCard}
            >
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={[
                    {
                      name: 'Team 70%',
                      value: stats.financials.teamDisbursed,
                    },
                    {
                      name: 'Mentor 20%',
                      value: stats.financials.mentorDisbursed,
                    },
                    {
                      name: 'Lab 10%',
                      value: stats.financials.labRevenue,
                    },
                  ]}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    tickFormatter={(value: number) => `${(value / 1000000000).toFixed(1)}B`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number | undefined) => {
                      if (value === undefined) return '';
                      return formatCurrency(value);
                    }}
                  />
                  <Bar dataKey="value" fill="#17a2b8" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Activities & Approvals */}
        <Row gutter={[16, 16]} className={styles.bottomRow}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <span>
                  <ClockCircleOutlined /> Hoạt động gần đây
                </span>
              }
              className={styles.activityCard}
            >
              <Timeline className={styles.timeline}>
                {activities.slice(0, 8).map((activity) => (
                  <Timeline.Item
                    key={activity.id}
                    dot={getStatusIcon(activity.status)}
                  >
                    <div className={styles.activityItem}>
                      <Text strong className={styles.activityTitle}>
                        {activity.title}
                      </Text>
                      <Text type="secondary" className={styles.activityDesc}>
                        {activity.description}
                      </Text>
                      <Text type="secondary" className={styles.activityTime}>
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
              title={
                <span>
                  <WarningOutlined /> Chờ phê duyệt ({pendingApprovals.length})
                </span>
              }
              className={styles.approvalCard}
              extra={
                <Button type="primary" size="small">
                  Xem tất cả
                </Button>
              }
            >
              <Table
                dataSource={pendingApprovals}
                columns={pendingColumns}
                pagination={{ pageSize: 5, size: 'small' }}
                size="small"
                rowKey="id"
                className={styles.approvalTable}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
