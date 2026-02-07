import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Progress, Typography, Space, Empty, Modal, Descriptions, message } from 'antd';
import { ProjectOutlined, CalendarOutlined, TeamOutlined, DollarOutlined } from '@ant-design/icons';
import { talentService, TalentProject } from '../../services/talent/talentService';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const MyProjects: React.FC = () => {
  const [projects, setProjects] = useState<TalentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<TalentProject | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      const data = await talentService.getMyProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch my projects:', error);
      message.error('Không thể tải dự án của bạn từ hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      PENDING: 'orange',
      ACTIVE: 'green',
      INACTIVE: 'purple',
      REJECTED: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status?: string): string => {
    const labels: { [key: string]: string } = {
      PENDING: 'Chờ duyệt',
      ACTIVE: 'Đang tham gia',
      INACTIVE: 'Đã kết thúc',
      REJECTED: 'Bị từ chối',
    };
    return (status && labels[status]) || 'Không rõ';
  };

  const getStatusHelp = (status?: string): string => {
    const notes: { [key: string]: string } = {
      PENDING: 'Đơn tham gia đang chờ mentor/lab-admin duyệt.',
      ACTIVE: 'Bạn đã được duyệt và đang là thành viên của dự án.',
      INACTIVE: 'Bạn đã rời dự án hoặc dự án kết thúc.',
      REJECTED: 'Đơn tham gia đã bị từ chối.',
    };
    return (status && notes[status]) || '';
  };

  const getRoleColor = (role: string): string => {
    return role === 'LEADER' ? 'gold' : 'blue';
  };

  if (loading) {
    return <div>Loading my projects...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <Title level={2}>My Projects</Title>
        <Button type="primary" onClick={() => navigate('/talent/projects')}>
          Browse More Projects
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <Empty
            description="You haven't joined any projects yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/talent/projects')}>
              Browse Available Projects
            </Button>
          </Empty>
        </Card>
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
          dataSource={projects}
          renderItem={(project) => (
            <List.Item>
              <Card
                title={project.title}
                size="small"
                extra={
                  <Space>
                    {project.memberRole && (
                      <Tag color={getRoleColor(project.memberRole)}>{project.memberRole}</Tag>
                    )}
                    {project.memberStatus && (
                      <Tag color={getStatusColor(project.memberStatus)}>
                        {getStatusLabel(project.memberStatus)}
                      </Tag>
                    )}
                  </Space>
                }
                actions={[
                  <Button
                    key="view"
                    type="link"
                    size="small"
                    onClick={async () => {
                      try {
                        setDetailLoading(true);
                        const detail = await talentService.getProjectDetail(project.id);
                        setDetailData(detail);
                        setDetailOpen(true);
                      } catch (err) {
                        console.error('Failed to load project detail', err);
                        message.error('Không thể tải chi tiết dự án');
                      } finally {
                        setDetailLoading(false);
                      }
                    }}
                  >
                    View Details
                  </Button>,
                  project.memberStatus === 'ACTIVE' && (
                    <Button
                      key="tasks"
                      type="link"
                      size="small"
                      onClick={() => navigate(`/talent/tasks?projectId=${project.id}`)}
                    >
                      View Tasks
                    </Button>
                  ),
                ].filter(Boolean)}
              >
                <div style={{ marginBottom: '12px' }}>
                  <Text type="secondary">{project.description}</Text>
                </div>

                {project.memberStatus && (
                  <div style={{ marginBottom: '8px' }}>
                    <Text type="secondary">{getStatusHelp(project.memberStatus)}</Text>
                  </div>
                )}

                <Space direction="vertical" style={{ width: '100%' }}>
                  {project.company && (
                    <div>
                      <Text strong>Company: </Text>
                      <Text>{project.company.name}</Text>
                    </div>
                  )}

                  <div>
                    <CalendarOutlined style={{ marginRight: '8px' }} />
                    <Text>
                      {new Date(project.startDate).toLocaleDateString()} -{' '}
                      {new Date(project.endDate).toLocaleDateString()}
                    </Text>
                  </div>

                  {project.technologies && project.technologies.length > 0 && (
                    <div>
                      <div style={{ marginBottom: '4px' }}>
                        <Text strong>Technologies:</Text>
                      </div>
                      <div>
                        {project.technologies.map((tech, index) => (
                          <Tag key={index}>
                            {tech}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <TeamOutlined style={{ marginRight: '8px' }} />
                    <Text>{project.numberOfStudents} members</Text>
                  </div>

                  {project.budget && (
                    <div>
                      <DollarOutlined style={{ marginRight: '8px' }} />
                      <Text>{project.budget.toLocaleString()} VND</Text>
                      {project.allowancePerStudent && (
                        <Text type="secondary"> ({project.allowancePerStudent})</Text>
                      )}
                    </div>
                  )}

                  {/* Progress bar for active projects */}
                  {project.memberStatus === 'ACTIVE' && (
                    <div>
                      <Text strong>Progress:</Text>
                      <Progress percent={project.status === 'COMPLETED' ? 100 : 0} size="small" />
                    </div>
                  )}
                </Space>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title="Chi tiết dự án"
        open={detailOpen}
        onCancel={() => {
          setDetailOpen(false);
          setDetailData(null);
        }}
        footer={null}
      >
        <Descriptions bordered size="small" column={1} labelStyle={{ width: 160 }}>
          <Descriptions.Item label="Tên dự án">
            {detailData?.title ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {detailData?.status ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {detailData?.description ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Công ty">
            {detailData?.company?.name ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngân sách">
            {detailData?.budget ? `${detailData.budget.toLocaleString()} VND` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian">
            {detailData?.startDate
              ? `${new Date(detailData.startDate).toLocaleDateString('vi-VN')} - ${new Date(detailData.endDate).toLocaleDateString('vi-VN')}`
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Công nghệ">
            {detailData?.technologies?.length ? detailData.technologies.join(', ') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Kỹ năng yêu cầu">
            {detailData?.skillRequirements?.length ? detailData.skillRequirements.join(', ') : '-'}
          </Descriptions.Item>
        </Descriptions>
        {detailLoading && <div style={{ marginTop: 12 }}>Đang tải...</div>}
      </Modal>
    </div>
  );
};

export default MyProjects;
