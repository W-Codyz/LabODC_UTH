export { default } from './EnterpriseManagement';

import {
  Card,
  Table,
  Tag,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  Typography,
  Descriptions,
  Image,
  message,
  Tabs,
  Badge,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  ShopOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { enterpriseService, Enterprise, EnterpriseDetail } from '@/services/admin/enterpriseService';
import styles from './EnterpriseManagement.module.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const EnterpriseManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [selectedEnterprise, setSelectedEnterprise] = useState<EnterpriseDetail | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [statsData, setStatsData] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [approveForm] = Form.useForm();
  const [rejectForm] = Form.useForm();

  useEffect(() => {
    fetchEnterprises();
  }, [statusFilter]);

  const fetchEnterprises = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      if (searchText) {
        params.search = searchText;
      }

      const response = await enterpriseService.getEnterprises(params);
      setEnterprises(response.enterprises);

      // Calculate stats
      const all = response.enterprises;
      setStatsData({
        total: response.pagination.total,
        pending: all.filter(e => e.status === 'PENDING').length,
        approved: all.filter(e => e.status === 'APPROVED').length,
        rejected: all.filter(e => e.status === 'REJECTED').length,
      });
    } catch (error) {
      message.error('Không thể tải danh sách doanh nghiệp');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      setLoading(true);
      const detail = await enterpriseService.getEnterpriseById(id);
      setSelectedEnterprise(detail);
      setDetailModalVisible(true);
    } catch (error) {
      message.error('Không thể tải chi tiết doanh nghiệp');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (values: any) => {
    if (!selectedEnterprise) return;

    try {
      await enterpriseService.approveEnterprise(selectedEnterprise.id, {
        note: values.note,
      });
      message.success('Đã phê duyệt doanh nghiệp thành công');
      setApproveModalVisible(false);
      setDetailModalVisible(false);
      approveForm.resetFields();
      fetchEnterprises();
    } catch (error) {
      message.error('Không thể phê duyệt doanh nghiệp');
    }
  };

  const handleReject = async (values: any) => {
    if (!selectedEnterprise) return;

    try {
      await enterpriseService.rejectEnterprise(selectedEnterprise.id, {
        reason: values.reason,
        details: values.details,
      });
      message.success('Đã từ chối doanh nghiệp');
      setRejectModalVisible(false);
      setDetailModalVisible(false);
      rejectForm.resetFields();
      fetchEnterprises();
    } catch (error) {
      message.error('Không thể từ chối doanh nghiệp');
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Tag icon={<ExclamationCircleOutlined />} color="warning">Chờ xác thực</Tag>;
      case 'APPROVED':
        return <Tag icon={<CheckCircleOutlined />} color="success">Đã duyệt</Tag>;
      case 'REJECTED':
        return <Tag icon={<CloseCircleOutlined />} color="error">Từ chối</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns: ColumnsType<Enterprise> = [
    {
      title: 'Tên doanh nghiệp',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text: string, record: Enterprise) => (
        <Space>
          {record.logoUrl && <Image src={record.logoUrl} width={32} preview={false} />}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'taxCode',
      key: 'taxCode',
    },
    {
      title: 'Người đại diện',
      dataIndex: 'representative',
      key: 'representative',
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'registeredAt',
      key: 'registeredAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record: Enterprise) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record.id)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <div>
          <Title level={2} className={styles.pageTitle}>
            <ShopOutlined /> Quản lý Doanh nghiệp
          </Title>
          <Paragraph className={styles.pageDescription}>
            Xác thực và quản lý các doanh nghiệp đăng ký hợp tác
          </Paragraph>
        </div>
      </div>

      {/* Statistics */}
      <Row gutter={16} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số doanh nghiệp"
              value={statsData.total}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ xác thực"
              value={statsData.pending}
              valueStyle={{ color: '#faad14' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã duyệt"
              value={statsData.approved}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Từ chối"
              value={statsData.rejected}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <Space size="large" wrap>
          <Input
            placeholder="Tìm kiếm theo tên, mã số thuế..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={fetchEnterprises}
            style={{ width: 300 }}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 180 }}
          >
            <Select.Option value="ALL">Tất cả trạng thái</Select.Option>
            <Select.Option value="PENDING">Chờ xác thực</Select.Option>
            <Select.Option value="APPROVED">Đã duyệt</Select.Option>
            <Select.Option value="REJECTED">Từ chối</Select.Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />} onClick={fetchEnterprises}>
            Tìm kiếm
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={enterprises}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} doanh nghiệp`,
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết Doanh nghiệp"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={
          selectedEnterprise?.status === 'PENDING' ? [
            <Button key="reject" danger onClick={() => setRejectModalVisible(true)}>
              <CloseCircleOutlined /> Từ chối
            </Button>,
            <Button key="approve" type="primary" onClick={() => setApproveModalVisible(true)}>
              <CheckCircleOutlined /> Phê duyệt
            </Button>,
          ] : null
        }
      >
        {selectedEnterprise && (
          <Tabs defaultActiveKey="info">
            <TabPane tab="Thông tin chung" key="info">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Tên doanh nghiệp" span={2}>
                  {selectedEnterprise.companyName}
                </Descriptions.Item>
                <Descriptions.Item label="Mã số thuế">
                  {selectedEnterprise.taxCode}
                </Descriptions.Item>
                <Descriptions.Item label="Lĩnh vực">
                  {selectedEnterprise.industry}
                </Descriptions.Item>
                <Descriptions.Item label="Người đại diện" span={2}>
                  {selectedEnterprise.representative}
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={2}>
                  <MailOutlined /> {selectedEnterprise.email}
                </Descriptions.Item>
                <Descriptions.Item label="Điện thoại">
                  <PhoneOutlined /> {selectedEnterprise.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Website">
                  {selectedEnterprise.website && (
                    <a href={selectedEnterprise.website} target="_blank" rel="noopener noreferrer">
                      <GlobalOutlined /> {selectedEnterprise.website}
                    </a>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>
                  <EnvironmentOutlined /> {selectedEnterprise.address}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {getStatusTag(selectedEnterprise.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đăng ký">
                  {new Date(selectedEnterprise.registeredAt).toLocaleDateString('vi-VN')}
                </Descriptions.Item>
                {selectedEnterprise.projectsCount !== undefined && (
                  <Descriptions.Item label="Số dự án">
                    {selectedEnterprise.projectsCount}
                  </Descriptions.Item>
                )}
                {selectedEnterprise.totalInvestment !== undefined && (
                  <Descriptions.Item label="Tổng vốn đầu tư">
                    {selectedEnterprise.totalInvestment.toLocaleString('vi-VN')} VNĐ
                  </Descriptions.Item>
                )}
              </Descriptions>
            </TabPane>

            <TabPane tab="Tài liệu" key="documents">
              {selectedEnterprise.documents && selectedEnterprise.documents.length > 0 ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                  {selectedEnterprise.documents.map((doc, index) => (
                    <Card key={index} size="small">
                      <Space>
                        <FileTextOutlined />
                        <Text>{doc.fileName}</Text>
                        <Button type="link" href={doc.url} target="_blank">
                          Xem tài liệu
                        </Button>
                      </Space>
                    </Card>
                  ))}
                </Space>
              ) : (
                <Text type="secondary">Chưa có tài liệu</Text>
              )}
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        title="Phê duyệt Doanh nghiệp"
        open={approveModalVisible}
        onCancel={() => setApproveModalVisible(false)}
        onOk={() => approveForm.submit()}
        okText="Phê duyệt"
        cancelText="Hủy"
      >
        <Form form={approveForm} onFinish={handleApprove} layout="vertical">
          <Form.Item label="Ghi chú" name="note">
            <TextArea rows={4} placeholder="Nhập ghi chú (không bắt buộc)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Từ chối Doanh nghiệp"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={() => rejectForm.submit()}
        okText="Từ chối"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
      >
        <Form form={rejectForm} onFinish={handleReject} layout="vertical">
          <Form.Item
            label="Lý do"
            name="reason"
            rules={[{ required: true, message: 'Vui lòng chọn lý do' }]}
          >
            <Select placeholder="Chọn lý do từ chối">
              <Select.Option value="INVALID_DOCUMENTS">Giấy tờ không hợp lệ</Select.Option>
              <Select.Option value="NOT_ELIGIBLE">Không đủ điều kiện</Select.Option>
              <Select.Option value="DUPLICATE">Trùng lặp</Select.Option>
              <Select.Option value="OTHER">Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Chi tiết"
            name="details"
            rules={[{ required: true, message: 'Vui lòng nhập chi tiết' }]}
          >
            <TextArea rows={4} placeholder="Nhập chi tiết lý do từ chối" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EnterpriseManagement;
