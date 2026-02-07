import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Progress, Tag, Typography, Button, Space, Empty } from 'antd';
import {
  ProjectOutlined,
  TrophyOutlined,
  StarOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  talentService,
  TalentDashboard as TalentDashboardType,
} from '../../services/talent/talentService';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const TalentDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<TalentDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await talentService.getDashboard();
      setDashboard(data);
    } catch (error: any) {
      console.error('Failed to fetch dashboard:', error);
      // Don't block - service may have returned mock data before re-throwing
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboard) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Talent Dashboard</Title>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Projects"
              value={dashboard.stats.totalProjects}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Completed Projects"
              value={dashboard.stats.completedProjects}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Ongoing Projects"
              value={dashboard.stats.ongoingProjects}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Average Rating"
              value={dashboard.stats.averageRating}
              precision={1}
              prefix={<StarOutlined />}
              suffix="/ 5"
              valueStyle={{ color: '#fadb14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Skills"
              value={dashboard.stats.totalSkills}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Certifications"
              value={dashboard.stats.totalCertifications}
              prefix={<SafetyCertificateOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Profile Completion */}
        <Col xs={24} lg={8}>
          <Card title="Profile Completion" size="small">
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Progress
                type="circle"
                percent={dashboard.profileCompletion.percentage}
                width={120}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </div>
            {dashboard.profileCompletion.missingFields.length > 0 && (
              <div>
                <Text strong>Missing fields:</Text>
                <div style={{ marginTop: '8px' }}>
                  {dashboard.profileCompletion.missingFields.map((field, index) => (
                    <Tag key={index} color="orange" style={{ marginBottom: '4px' }}>
                      {field}
                    </Tag>
                  ))}
                </div>
                <Button
                  type="primary"
                  size="small"
                  style={{ marginTop: '12px' }}
                  onClick={() => navigate('/talent/profile')}
                >
                  Complete Profile
                </Button>
              </div>
            )}
          </Card>
        </Col>

        {/* Notifications */}
        <Col xs={24} lg={8}>
          <Card title="Notifications" size="small">
            {dashboard.notifications && dashboard.notifications.length > 0 ? (
              <List
                size="small"
                dataSource={dashboard.notifications}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            ) : (
              <Empty description="No notifications yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        {/* Recent Projects */}
        <Col xs={24} lg={16}>
          <Card
            title="Recent Projects"
            size="small"
            extra={
              <Space>
                <Button size="small" onClick={() => navigate('/talent/projects')}>
                  Browse Projects
                </Button>
                <Button size="small" onClick={() => navigate('/talent/my-projects')}>
                  My Projects
                </Button>
              </Space>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={dashboard.recentProjects.slice(0, 5)}
              renderItem={(project) => (
                <List.Item
                  actions={[
                    <Tag color={getStatusColor(project.status)}>{project.status}</Tag>,
                    project.memberRole && <Tag color="blue">{project.memberRole}</Tag>,
                  ]}
                >
                  <List.Item.Meta
                    title={project.title}
                    description={project.description?.substring(0, 80) + '...'}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="Quick Actions" style={{ marginTop: '16px' }}>
        <Space wrap>
          <Button
            type="primary"
            icon={<ProjectOutlined />}
            onClick={() => navigate('/talent/projects')}
          >
            Browse Projects
          </Button>
          <Button icon={<UserOutlined />} onClick={() => navigate('/talent/profile')}>
            Edit Profile
          </Button>
          <Button icon={<ToolOutlined />} onClick={() => navigate('/talent/profile?tab=skills')}>
            Manage Skills
          </Button>
          <Button
            icon={<SafetyCertificateOutlined />}
            onClick={() => navigate('/talent/profile?tab=certifications')}
          >
            Add Certification
          </Button>
        </Space>
      </Card>
    </div>
  );
};

const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    RECRUITING: 'green',
    IN_PROGRESS: 'blue',
    COMPLETED: 'purple',
    PENDING: 'orange',
    APPROVED: 'green',
    ACTIVE: 'blue',
  };
  return colors[status] || 'default';
};

export default TalentDashboard;
