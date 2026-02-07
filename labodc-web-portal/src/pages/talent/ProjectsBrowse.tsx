import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Input, Select, Typography, Space, message, Modal } from 'antd';
import {
  ProjectOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { talentService, TalentProject } from '../../services/talent/talentService';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProjectsBrowse: React.FC = () => {
  const [projects, setProjects] = useState<TalentProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<TalentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [techFilter, setTechFilter] = useState<string>('');
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<TalentProject | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, statusFilter, techFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await talentService.browseProjects({ page: 0, size: 50 });
      setProjects(data.content || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      message.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    if (techFilter) {
      filtered = filtered.filter((project) =>
        project.technologies?.some((tech) => tech.toLowerCase().includes(techFilter.toLowerCase()))
      );
    }

    setFilteredProjects(filtered);
  };

  const handleJoinProject = (project: TalentProject) => {
    setSelectedProject(project);
    setJoinModalVisible(true);
  };

  const confirmJoinProject = async () => {
    if (!selectedProject) return;

    try {
      await talentService.joinProject(selectedProject.id, {
        message: 'I would like to join this project.',
      });
      message.success('Join request submitted successfully!');
      setJoinModalVisible(false);
      setSelectedProject(null);
      // Optionally refresh the projects list
      fetchProjects();
    } catch (error) {
      message.error('Failed to submit join request');
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      RECRUITING: 'green',
      IN_PROGRESS: 'blue',
      COMPLETED: 'purple',
      CANCELLED: 'red',
    };
    return colors[status] || 'default';
  };

  // Get all unique technologies for filter
  const allTechnologies = Array.from(new Set(projects.flatMap((p) => p.technologies || []))).sort();

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Browse Projects</Title>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Search
              placeholder="Search projects..."
              allowClear
              style={{ width: '300px' }}
              prefix={<SearchOutlined />}
              onSearch={setSearchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: '150px' }}
              value={statusFilter || undefined}
              onChange={setStatusFilter}
            >
              <Option value="RECRUITING">Recruiting</Option>
              <Option value="IN_PROGRESS">In Progress</Option>
              <Option value="COMPLETED">Completed</Option>
            </Select>

            <Select
              placeholder="Filter by technology"
              allowClear
              style={{ width: '200px' }}
              value={techFilter || undefined}
              onChange={setTechFilter}
            >
              {allTechnologies.map((tech) => (
                <Option key={tech} value={tech}>
                  {tech}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <Text type="secondary">
              Showing {filteredProjects.length} of {projects.length} projects
            </Text>
          </div>
        </Space>
      </Card>

      {/* Projects List */}
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
        dataSource={filteredProjects}
        renderItem={(project) => (
          <List.Item>
            <Card
              title={project.title}
              size="small"
              extra={<Tag color={getStatusColor(project.status)}>{project.status}</Tag>}
              actions={[
                project.status === 'RECRUITING' ? (
                  <Button
                    key="join"
                    type="primary"
                    size="small"
                    onClick={() => handleJoinProject(project)}
                  >
                    Join Project
                  </Button>
                ) : (
                  <Button key="view" type="link" size="small">
                    View Details
                  </Button>
                ),
              ]}
            >
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary">{project.description}</Text>
              </div>

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
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <Tag key={index}>
                          {tech}
                        </Tag>
                      ))}
                      {project.technologies.length > 3 && (
                        <Tag>+{project.technologies.length - 3} more</Tag>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <TeamOutlined style={{ marginRight: '8px' }} />
                  <Text>{project.numberOfStudents} members needed</Text>
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

                {project.skillRequirements && project.skillRequirements.length > 0 && (
                  <div>
                    <Text strong>Requirements: </Text>
                    <Text type="secondary">{project.skillRequirements.join(', ')}</Text>
                  </div>
                )}
              </Space>
            </Card>
          </List.Item>
        )}
      />

      {/* Join Project Modal */}
      <Modal
        title="Join Project"
        open={joinModalVisible}
        onOk={confirmJoinProject}
        onCancel={() => setJoinModalVisible(false)}
        okText="Submit Request"
        cancelText="Cancel"
      >
        {selectedProject && (
          <div>
            <Title level={4}>{selectedProject.title}</Title>
            <Text>{selectedProject.description}</Text>
            <div style={{ marginTop: '16px' }}>
              <Text strong>Are you sure you want to join this project?</Text>
            </div>
            <div style={{ marginTop: '8px', color: '#999' }}>
              Your request will be reviewed by the project mentor.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectsBrowse;
