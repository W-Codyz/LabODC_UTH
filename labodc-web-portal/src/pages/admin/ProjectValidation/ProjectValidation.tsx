import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Modal,
  Typography,
  Descriptions,
  message,
  Tabs,
  Badge,
  Drawer,
  Alert,
  Select,
  Row,
  Col,
  Statistic,
  Progress,
  List,
  Avatar,
  InputNumber
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ProjectOutlined,
  FileTextOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserAddOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { projectService } from "@/services/admin/projectService";
import type { Project, ProjectDetail, Mentor } from '@/services/admin/projectService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function ProjectValidation() {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [mentorModalVisible, setMentorModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('PENDING');
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  // Available mentors
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<number | null>(null);

  // Form states
  const [approveNote, setApproveNote] = useState('');
  const [adjustStudents, setAdjustStudents] = useState<number | undefined>();
  const [adjustDuration, setAdjustDuration] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDetails, setRejectDetails] = useState('');
  const [mentorMessage, setMentorMessage] = useState('');

  useEffect(() => {
    loadProjects();
  }, [activeTab, pagination.current]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await projectService.getProjects({
        status: activeTab,
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText
      });
      setProjects(response.projects);
      setPagination(prev => ({ ...prev, total: response.pagination.total }));
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể tải danh sách dự án');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const detail = await projectService.getProjectById(id);
      setSelectedProject(detail);
      setDetailVisible(true);
    } catch (error: any) {
      message.error('Không thể tải chi tiết dự án');
    }
  };

  const handleApprove = async () => {
    if (!selectedProject || !approveNote.trim()) {
      message.warning('Vui lòng nhập ghi chú');
      return;
    }
    
    try {
      await projectService.approveProject(selectedProject.id, {
        note: approveNote,
        adjustments: adjustStudents || adjustDuration ? {
          numberOfStudents: adjustStudents,
          duration: adjustDuration
        } : undefined
      });
      message.success('Đã phê duyệt dự án thành công');
      setApproveModalVisible(false);
      setDetailVisible(false);
      resetApproveForms();
      loadProjects();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể phê duyệt dự án');
    }
  };

  const handleReject = async () => {
    if (!selectedProject || !rejectReason || !rejectDetails.trim()) {
      message.warning('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    try {
      await projectService.rejectProject(selectedProject.id, {
        reason: rejectReason,
        details: rejectDetails
      });
      message.success('Đã từ chối dự án');
      setRejectModalVisible(false);
      setDetailVisible(false);
      resetRejectForms();
      loadProjects();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể từ chối dự án');
    }
  };

  const handleShowMentorModal = async () => {
    if (!selectedProject) return;
    
    try {
      const mentorsList = await projectService.getAvailableMentors(selectedProject.technologies);
      setMentors(mentorsList);
      setMentorModalVisible(true);
    } catch (error: any) {
      message.error('Không thể tải danh sách mentor');
    }
  };

  const handleAssignMentor = async () => {
    if (!selectedProject || !selectedMentor || !mentorMessage.trim()) {
      message.warning('Vui lòng chọn mentor và nhập lời nhắn');
      return;
    }
    
    try {
      await projectService.assignMentor(selectedProject.id, {
        mentorId: selectedMentor,
        message: mentorMessage
      });
      message.success('Đã gửi lời mời đến mentor');
      setMentorModalVisible(false);
      resetMentorForms();
      loadProjects();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể gán mentor');
    }
  };

  const resetApproveForms = () => {
    setApproveNote('');
    setAdjustStudents(undefined);
    setAdjustDuration('');
  };

  const resetRejectForms = () => {
    setRejectReason('');
    setRejectDetails('');
  };

  const resetMentorForms = () => {
    setSelectedMentor(null);
    setMentorMessage('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      PENDING: { color: 'processing', text: 'Chờ xác thực' },
      APPROVED: { color: 'success', text: 'Đã phê duyệt' },
      REJECTED: { color: 'error', text: 'Đã từ chối' },
      RECRUITING: { color: 'cyan', text: 'Đang tuyển' },
      IN_PROGRESS: { color: 'blue', text: 'Đang thực hiện' },
      COMPLETED: { color: 'green', text: 'Hoàn thành' },
      CANCELLED: { color: 'default', text: 'Đã hủy' }
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: ColumnsType<Project> = [
    {
      title: 'Dự án',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.enterprise.name}
          </Text>
        </div>
      ),
    },
    {
      title: 'Công nghệ',
      dataIndex: 'technologies',
      key: 'technologies',
      width: 200,
      render: (techs: string[]) => (
        <>
          {techs.slice(0, 2).map(tech => (
            <Tag key={tech} color="blue">{tech}</Tag>
          ))}
          {techs.length > 2 && <Tag>+{techs.length - 2}</Tag>}
        </>
      ),
    },
    {
      title: 'Ngân sách',
      dataIndex: 'budget',
      key: 'budget',
      width: 150,
      render: (budget) => formatCurrency(budget),
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
    },
    {
      title: 'SV cần',
      dataIndex: 'numberOfStudents',
      key: 'numberOfStudents',
      width: 80,
      align: 'center',
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      width: 160,
      render: (date) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record.id)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <ProjectOutlined /> Xác thực Dự án
      </Title>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Input.Search
            placeholder="Tìm kiếm dự án..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={setSearchText}
            style={{ maxWidth: 500 }}
          />

          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            items={[
              { key: 'PENDING', label: <Badge count={8} offset={[10, 0]}><span>Chờ xác thực</span></Badge> },
              { key: 'APPROVED', label: 'Đã phê duyệt' },
              { key: 'REJECTED', label: 'Đã từ chối' },
              { key: 'RECRUITING', label: 'Đang tuyển' },
              { key: 'IN_PROGRESS', label: 'Đang thực hiện' }
            ]}
          />

          <Table
            columns={columns}
            dataSource={projects}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              onChange: (page, pageSize) => {
                setPagination(prev => ({ ...prev, current: page, pageSize }));
              },
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} dự án`,
            }}
            scroll={{ x: 1400 }}
          />
        </Space>
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title="Chi tiết Dự án"
        placement="right"
        width={800}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        extra={
          selectedProject?.status === 'PENDING' && (
            <Space>
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => setApproveModalVisible(true)}>
                Phê duyệt
              </Button>
              <Button danger icon={<CloseCircleOutlined />} onClick={() => setRejectModalVisible(true)}>
                Từ chối
              </Button>
            </Space>
          )
        }
      >
        {selectedProject && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* Overview Stats */}
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Ngân sách"
                    value={selectedProject.budget}
                    prefix={<DollarOutlined />}
                    formatter={(val) => formatCurrency(val as number)}
                    valueStyle={{ fontSize: 18 }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Thời gian"
                    value={selectedProject.duration}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ fontSize: 18 }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Sinh viên"
                    value={selectedProject.numberOfStudents}
                    prefix={<TeamOutlined />}
                    suffix="người"
                    valueStyle={{ fontSize: 18 }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Fund Distribution */}
            {selectedProject.fundDistribution && (
              <Card title="Phân bổ Quỹ (70/20/10)" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text>Team (70%): </Text>
                    <Text strong>{formatCurrency(selectedProject.fundDistribution.team)}</Text>
                  </div>
                  <div>
                    <Text>Mentor (20%): </Text>
                    <Text strong>{formatCurrency(selectedProject.fundDistribution.mentor)}</Text>
                  </div>
                  <div>
                    <Text>Lab (10%): </Text>
                    <Text strong>{formatCurrency(selectedProject.fundDistribution.lab)}</Text>
                  </div>
                </Space>
              </Card>
            )}

            <Descriptions title="Thông tin dự án" column={1} bordered>
              <Descriptions.Item label="Tên dự án"><Text strong>{selectedProject.title}</Text></Descriptions.Item>
              <Descriptions.Item label="Doanh nghiệp">{selectedProject.enterprise.name}</Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                <Paragraph>{selectedProject.description}</Paragraph>
              </Descriptions.Item>
              <Descriptions.Item label="Mục tiêu">
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {selectedProject.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                </ul>
              </Descriptions.Item>
              <Descriptions.Item label="Công nghệ">
                {selectedProject.technologies.map(tech => <Tag key={tech} color="blue">{tech}</Tag>)}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {new Date(selectedProject.startDate).toLocaleDateString('vi-VN')} - {new Date(selectedProject.endDate).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{getStatusTag(selectedProject.status)}</Descriptions.Item>
            </Descriptions>

            {/* Skill Requirements */}
            <Card title="Yêu cầu kỹ năng" size="small">
              <List
                dataSource={selectedProject.skillRequirements}
                renderItem={(skill) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>{skill.skill}</Text>
                          <Tag color={skill.level === 'Advanced' ? 'red' : skill.level === 'Intermediate' ? 'orange' : 'green'}>
                            {skill.level}
                          </Tag>
                          {skill.required && <Tag color="red">Bắt buộc</Tag>}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* Attachments */}
            {selectedProject.attachments && selectedProject.attachments.length > 0 && (
              <Card title="Tài liệu đính kèm" size="small">
                {selectedProject.attachments.map((file, idx) => (
                  <Button key={idx} icon={<FileTextOutlined />} href={file.url} target="_blank" block style={{ marginBottom: 8 }}>
                    {file.fileName}
                  </Button>
                ))}
              </Card>
            )}

            {/* Mentor Assignment */}
            {selectedProject.status === 'APPROVED' && !selectedProject.mentor && (
              <Alert
                message="Dự án đã phê duyệt"
                description={
                  <Space direction="vertical">
                    <Text>Dự án đã được phê duyệt. Vui lòng gán Mentor để bắt đầu tuyển sinh viên.</Text>
                    <Button type="primary" icon={<UserAddOutlined />} onClick={handleShowMentorModal}>
                      Gán Mentor
                    </Button>
                  </Space>
                }
                type="info"
                showIcon
              />
            )}

            {selectedProject.mentor && (
              <Descriptions title="Mentor được gán" column={1} bordered>
                <Descriptions.Item label="Tên">{selectedProject.mentor.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{selectedProject.mentor.email}</Descriptions.Item>
                <Descriptions.Item label="Chuyên môn">
                  {selectedProject.mentor.expertise.map(exp => <Tag key={exp}>{exp}</Tag>)}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Space>
        )}
      </Drawer>

      {/* Approve Modal */}
      <Modal
        title="Phê duyệt Dự án"
        open={approveModalVisible}
        onCancel={() => { setApproveModalVisible(false); resetApproveForms(); }}
        onOk={handleApprove}
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Alert
            message="Xác nhận phê duyệt"
            description={`Phê duyệt dự án "${selectedProject?.title}"?`}
            type="info"
            showIcon
          />
          
          <div>
            <div style={{ marginBottom: 8 }}>Ghi chú *</div>
            <TextArea rows={3} value={approveNote} onChange={(e) => setApproveNote(e.target.value)} placeholder="Dự án phù hợp với khả năng sinh viên..." />
          </div>

          <Card title="Điều chỉnh (tùy chọn)" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text>Số sinh viên:</Text>
                <InputNumber
                  min={3}
                  max={10}
                  value={adjustStudents}
                  onChange={setAdjustStudents}
                  style={{ width: '100%', marginTop: 8 }}
                  placeholder={`Mặc định: ${selectedProject?.numberOfStudents}`}
                />
              </div>
              <div>
                <Text>Thời gian:</Text>
                <Input
                  value={adjustDuration}
                  onChange={(e) => setAdjustDuration(e.target.value)}
                  placeholder={`Mặc định: ${selectedProject?.duration}`}
                  style={{ marginTop: 8 }}
                />
              </div>
            </Space>
          </Card>
        </Space>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Từ chối Dự án"
        open={rejectModalVisible}
        onCancel={() => { setRejectModalVisible(false); resetRejectForms(); }}
        onOk={handleReject}
        okText="Từ chối"
        okButtonProps={{ danger: true }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Alert message="Xác nhận từ chối" description={`Từ chối dự án "${selectedProject?.title}"?`} type="warning" showIcon />
          
          <div>
            <div style={{ marginBottom: 8 }}>Lý do *</div>
            <Select value={rejectReason} onChange={setRejectReason} style={{ width: '100%' }} placeholder="Chọn lý do">
              <Select.Option value="unrealistic_scope">Phạm vi không khả thi</Select.Option>
              <Select.Option value="insufficient_budget">Ngân sách không đủ</Select.Option>
              <Select.Option value="too_complex">Quá phức tạp cho sinh viên</Select.Option>
              <Select.Option value="unclear_requirements">Yêu cầu không rõ ràng</Select.Option>
              <Select.Option value="other">Lý do khác</Select.Option>
            </Select>
          </div>

          <div>
            <div style={{ marginBottom: 8 }}>Chi tiết *</div>
            <TextArea rows={4} value={rejectDetails} onChange={(e) => setRejectDetails(e.target.value)} placeholder="Mô tả chi tiết..." />
          </div>
        </Space>
      </Modal>

      {/* Assign Mentor Modal */}
      <Modal
        title="Gán Mentor cho Dự án"
        open={mentorModalVisible}
        onCancel={() => { setMentorModalVisible(false); resetMentorForms(); }}
        onOk={handleAssignMentor}
        width={700}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <div style={{ marginBottom: 8 }}>Chọn Mentor *</div>
            <List
              dataSource={mentors}
              renderItem={(mentor) => (
                <List.Item
                  onClick={() => setSelectedMentor(mentor.id)}
                  style={{
                    cursor: 'pointer',
                    border: selectedMentor === mentor.id ? '2px solid #1890ff' : '1px solid #f0f0f0',
                    padding: 12,
                    marginBottom: 8,
                    borderRadius: 4
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<TrophyOutlined />} />}
                    title={
                      <Space>
                        <Text strong>{mentor.fullName}</Text>
                        <Tag color="blue">{mentor.yearsOfExperience} năm kinh nghiệm</Tag>
                        {!mentor.available && <Tag color="red">Đầy dự án</Tag>}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text type="secondary">Chuyên môn: </Text>
                          {mentor.expertise.map(exp => <Tag key={exp}>{exp}</Tag>)}
                        </div>
                        <div>
                          <Text type="secondary">Dự án: {mentor.currentProjects}/{mentor.maxProjects} | Đánh giá: {mentor.averageRating}/5.0</Text>
                        </div>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>

          <div>
            <div style={{ marginBottom: 8 }}>Lời nhắn cho Mentor *</div>
            <TextArea
              rows={4}
              value={mentorMessage}
              onChange={(e) => setMentorMessage(e.target.value)}
              placeholder="Dự án ReactJS + NodeJS phù hợp với expertise của mentor..."
            />
          </div>
        </Space>
      </Modal>
    </div>
  );
}