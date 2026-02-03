import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Button,
  Select,
  Progress,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  message,
  Space,
  Popconfirm,
  Descriptions,
} from 'antd';
import {
  ProjectOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import {
  getProjectSummary,
  getProjects,
  Project,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} from '@/services/enterprise/project.service';
import { formatCurrencyVND } from '@/utils/formatters';
import '../enterprise-modern.css';
import dayjs from 'dayjs';

const ProjectManagement: React.FC = () => {
  const [form] = Form.useForm();

  const [status, setStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);

  const [summary, setSummary] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    totalBudget: 0,
  });

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const summaryRes = await getProjectSummary();
        const projectsRes = await getProjects(status);

        setSummary(summaryRes ?? {
          total: 0,
          inProgress: 0,
          completed: 0,
          totalBudget: 0,
        });
        setProjects(Array.isArray(projectsRes) ? projectsRes : []);
      } catch (err) {
        console.error('Load project data failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status]);

  const refreshProjects = async () => {
    try {
      setLoading(true);
      const summaryRes = await getProjectSummary();
      const projectsRes = await getProjects(status);
      setSummary(summaryRes ?? {
        total: 0,
        inProgress: 0,
        completed: 0,
        totalBudget: 0,
      });
      setProjects(Array.isArray(projectsRes) ? projectsRes : []);
    } catch (err) {
      console.error('Refresh project data failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tên dự án',
      dataIndex: 'name',
    },
    {
      title: 'Ngân sách',
      dataIndex: 'budget',
      render: (v: number) => formatCurrencyVND(v),
    },
    {
      title: 'Đã chi',
      dataIndex: 'spent',
      render: (v: number) => formatCurrencyVND(v),
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      render: (v: number) => <Progress percent={v} />,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (s: string) => {
        const color =
          s === 'COMPLETED'
            ? 'green'
            : s === 'IN_PROGRESS'
            ? 'blue'
            : 'orange';
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: 'Hành động',
      render: (_: any, record: Project) => (
        <Space>
          <Button
            type="link"
            onClick={async () => {
              try {
                setDetailLoading(true);
                const detail = await getProjectById(record.key);
                setDetailData(detail ?? null);
                setDetailOpen(true);
              } catch (err: any) {
                message.error(err?.message || 'Không thể tải chi tiết dự án');
              } finally {
                setDetailLoading(false);
              }
            }}
          >
            Chi tiết
          </Button>
          {record.status === 'PENDING_VALIDATION' && (
            <>
              <Button
                type="link"
                onClick={async () => {
                  try {
                    const detail = await getProjectById(record.key);
                    setEditId(String(record.key));
                    form.setFieldsValue({
                      name: detail?.name ?? record.name,
                      description: detail?.description ?? '',
                      objectives: Array.isArray(detail?.objectives)
                        ? detail.objectives.join('\n')
                        : detail?.objective ?? '',
                      requirements: detail?.requirements ?? '',
                      startDate: detail?.startDate ? dayjs(detail.startDate) : undefined,
                      endDate: detail?.endDate ? dayjs(detail.endDate) : undefined,
                      budget: detail?.budget ?? record.budget,
                      requiredTalents: detail?.requiredTalents ?? undefined,
                      technologies: Array.isArray(detail?.technologies)
                        ? detail.technologies.join(', ')
                        : '',
                      requiredSkills: Array.isArray(detail?.requiredSkills)
                        ? detail.requiredSkills.join(', ')
                        : '',
                      allowApplications: detail?.allowApplications ?? true,
                    });
                    setEditOpen(true);
                  } catch (err: any) {
                    message.error(err?.message || 'Không thể tải dự án');
                  }
                }}
              >
                Sửa
              </Button>
              <Popconfirm
                title="Xóa dự án?"
                description="Chỉ dự án chờ duyệt mới được xóa."
                okText="Xóa"
                cancelText="Hủy"
                onConfirm={async () => {
                  try {
                    await deleteProject(record.key);
                    message.success('Đã xóa dự án');
                    await refreshProjects();
                  } catch (err: any) {
                    message.error(err?.message || 'Không thể xóa dự án');
                  }
                }}
              >
                <Button type="link" danger>
                  Xóa
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <div className="page-header">
        <h1>Quản lý dự án</h1>
        <Button
          type="primary"
          icon={<ProjectOutlined />}
          onClick={() => setCreateOpen(true)}
        >
          Tạo dự án mới
        </Button>
      </div>

      {/* SUMMARY */}
      <Row gutter={16} className="stat-row">
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Tổng dự án"
              value={summary.total}
              prefix={<ProjectOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Đang thực hiện"
              value={summary.inProgress}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Hoàn thành"
              value={summary.completed}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Tổng ngân sách"
              value={summary.totalBudget}
              prefix={<DollarOutlined />}
              formatter={(v) => formatCurrencyVND(Number(v))}
            />
          </Card>
        </Col>
      </Row>

      {/* FILTER */}
      <div className="filter-bar">
        <Select
          value={status}
          onChange={setStatus}
          style={{ width: 220 }}
        >
          <Select.Option value="ALL">Tất cả</Select.Option>
          <Select.Option value="PENDING_VALIDATION">Chờ duyệt</Select.Option>
          <Select.Option value="RECRUITING">Đang tuyển</Select.Option>
          <Select.Option value="IN_PROGRESS">Đang thực hiện</Select.Option>
          <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
          <Select.Option value="ON_HOLD">Tạm dừng</Select.Option>
        </Select>
      </div>

      {/* TABLE */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={projects}
          loading={loading}
          rowKey="key"
        />
      </Card>

      

      <Modal
        title="Chi tiết dự án"
        open={detailOpen}
        onCancel={() => {
          setDetailOpen(false);
          setDetailData(null);
        }}
        footer={null}
      >
        <Descriptions
          bordered
          size="small"
          column={1}
          labelStyle={{ width: 160 }}
        >
          <Descriptions.Item label="Tên dự án">
            {detailData?.name ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {detailData?.status ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngân sách">
            {typeof detailData?.budget === 'number'
              ? formatCurrencyVND(detailData.budget)
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {detailData?.description ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Yêu cầu">
            {detailData?.requirements ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Mục tiêu">
            {Array.isArray(detailData?.objectives)
              ? detailData.objectives.join(', ')
              : detailData?.objective ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Công nghệ">
            {Array.isArray(detailData?.technologies)
              ? detailData.technologies.join(', ')
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Kỹ năng yêu cầu">
            {Array.isArray(detailData?.requiredSkills)
              ? detailData.requiredSkills.join(', ')
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Bắt đầu">
            {detailData?.startDate ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Kết thúc">
            {detailData?.endDate ?? '-'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
<Modal
        title="Tạo dự án mới"
        open={createOpen}
        onCancel={() => {
          setCreateOpen(false);
          form.resetFields();
        }}
        onOk={async () => {
          try {
            const values = await form.validateFields();
            setCreating(true);

            const objectives = values.objectives
              ? String(values.objectives)
                  .split('\n')
                  .map((s: string) => s.trim())
                  .filter(Boolean)
              : undefined;

            await createProject({
              name: values.name,
              description: values.description,
              requirements: values.requirements,
              objectives,
              startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
              endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
              budget: Number(values.budget),
              requiredTalents: Number(values.requiredTalents),
              technologies: values.technologies
                ? String(values.technologies)
                    .split(',')
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                : undefined,
              requiredSkills: values.requiredSkills
                ? String(values.requiredSkills)
                    .split(',')
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                : undefined,
              allowApplications: values.allowApplications ?? true,
            });

            message.success('Tạo dự án thành công');
            setCreateOpen(false);
            form.resetFields();
            await refreshProjects();
          } catch (err: any) {
            if (err?.errorFields) return;
            message.error(err?.message || 'Không thể tạo dự án');
          } finally {
            setCreating(false);
          }
        }}
        confirmLoading={creating}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên dự án"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên dự án' }]}
          >
            <Input placeholder="Ví dụ: Hệ thống quản lý kho" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={3} placeholder="Mô tả ngắn về dự án" />
          </Form.Item>

          <Form.Item label="Mục tiêu (mỗi dòng một mục)" name="objectives">
            <Input.TextArea rows={3} placeholder="Ví dụ: Xây API\nTạo giao diện\nTriển khai" />
          </Form.Item>

          <Form.Item label="Yêu cầu" name="requirements">
            <Input.TextArea rows={3} placeholder="Yêu cầu kỹ thuật / quy trình" />
          </Form.Item>

          <Form.Item
            label="Thời gian"
            style={{ marginBottom: 0 }}
          >
            <Form.Item
              name="startDate"
              rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="endDate"
              rules={[{ required: true, message: 'Chọn ngày kết thúc' }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 16 }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Ngân sách (VND)"
            name="budget"
            rules={[{ required: true, message: 'Nhập ngân sách' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            label="Số lượng sinh viên"
            name="requiredTalents"
            rules={[{ required: true, message: 'Nhập số lượng sinh viên' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} max={50} />
          </Form.Item>

          <Form.Item label="Công nghệ (cách nhau bằng dấu phẩy)" name="technologies">
            <Input placeholder="React, Node.js, PostgreSQL" />
          </Form.Item>

          <Form.Item label="Kỹ năng yêu cầu (cách nhau bằng dấu phẩy)" name="requiredSkills">
            <Input placeholder="React.js, SQL, Docker" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa dự án"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditId(null);
          form.resetFields();
        }}
        onOk={async () => {
          if (!editId) return;
          try {
            const values = await form.validateFields();
            setEditing(true);

            const objectives = values.objectives
              ? String(values.objectives)
                  .split('\n')
                  .map((s: string) => s.trim())
                  .filter(Boolean)
              : undefined;

            await updateProject(editId, {
              name: values.name,
              description: values.description,
              requirements: values.requirements,
              objectives,
              startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
              endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
              budget: Number(values.budget),
              requiredTalents: Number(values.requiredTalents),
              technologies: values.technologies
                ? String(values.technologies)
                    .split(',')
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                : undefined,
              requiredSkills: values.requiredSkills
                ? String(values.requiredSkills)
                    .split(',')
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                : undefined,
              allowApplications: values.allowApplications ?? true,
            });

            message.success('Cập nhật dự án thành công');
            setEditOpen(false);
            setEditId(null);
            form.resetFields();
            await refreshProjects();
          } catch (err: any) {
            if (err?.errorFields) return;
            message.error(err?.message || 'Không thể cập nhật dự án');
          } finally {
            setEditing(false);
          }
        }}
        confirmLoading={editing}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên dự án"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên dự án' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Mục tiêu (mỗi dòng một mục)" name="objectives">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Yêu cầu" name="requirements">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Thời gian" style={{ marginBottom: 0 }}>
            <Form.Item
              name="startDate"
              rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="endDate"
              rules={[{ required: true, message: 'Chọn ngày kết thúc' }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 16 }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Ngân sách (VND)"
            name="budget"
            rules={[{ required: true, message: 'Nhập ngân sách' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            label="Số lượng sinh viên"
            name="requiredTalents"
            rules={[{ required: true, message: 'Nhập số lượng sinh viên' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} max={50} />
          </Form.Item>

          <Form.Item label="Công nghệ (cách nhau bằng dấu phẩy)" name="technologies">
            <Input />
          </Form.Item>

          <Form.Item label="Kỹ năng yêu cầu (cách nhau bằng dấu phẩy)" name="requiredSkills">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectManagement;
