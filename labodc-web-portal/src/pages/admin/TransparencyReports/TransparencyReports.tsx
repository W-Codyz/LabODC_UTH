import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  message,
  Modal,
  Select,
  DatePicker,
  Descriptions,
  Row,
  Col,
  Statistic,
  Progress,
  Drawer,
  Alert,
  Divider
} from 'antd';
import {
  FileTextOutlined,
  PlusOutlined,
  EyeOutlined,
  SendOutlined,
  DownloadOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ProjectOutlined,
  ShopOutlined,
  TeamOutlined,
  DollarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { reportService } from '../../services/admin/reportService';
import type { TransparencyReport, ReportStatistics, CreateReportRequest } from '../../services/admin/reportService';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { MonthPicker } = DatePicker;
import { Input } from 'antd';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function TransparencyReports() {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<TransparencyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<TransparencyReport | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [publishModalVisible, setPublishModalVisible] = useState(false);

  // Form states
  const [reportType, setReportType] = useState<'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('MONTHLY');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [publishNote, setPublishNote] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getReports();
      setReports(data);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể tải danh sách báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async () => {
    if (!selectedPeriod) {
      message.warning('Vui lòng chọn kỳ báo cáo');
      return;
    }

    try {
      const newReport = await reportService.createReport({
        reportType,
        period: selectedPeriod,
        autoGenerate: true
      });
      message.success('Đã tạo báo cáo thành công');
      setCreateModalVisible(false);
      setSelectedPeriod('');
      loadReports();
      
      // Auto open detail
      setSelectedReport(newReport);
      setDetailVisible(true);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể tạo báo cáo');
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const detail = await reportService.getReportById(id);
      setSelectedReport(detail);
      setDetailVisible(true);
    } catch (error: any) {
      message.error('Không thể tải chi tiết báo cáo');
    }
  };

  const handlePublish = async () => {
    if (!selectedReport || !publishNote.trim()) {
      message.warning('Vui lòng nhập ghi chú công bố');
      return;
    }

    try {
      await reportService.publishReport(selectedReport.reportId, { publishNote });
      message.success('Đã công bố báo cáo thành công');
      setPublishModalVisible(false);
      setPublishNote('');
      setDetailVisible(false);
      loadReports();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể công bố báo cáo');
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa báo cáo này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await reportService.deleteReport(id);
          message.success('Đã xóa báo cáo');
          loadReports();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Không thể xóa báo cáo');
        }
      }
    });
  };

  const handleExportPDF = async (id: number) => {
    try {
      const blob = await reportService.exportPDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transparency-report-${selectedPeriod}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      message.success('Đã tải xuống báo cáo PDF');
    } catch (error: any) {
      message.error('Không thể tải xuống PDF');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getStatusTag = (status: string) => {
    return status === 'PUBLISHED' ? (
      <Tag color="success">Đã công bố</Tag>
    ) : (
      <Tag color="default">Bản nháp</Tag>
    );
  };

  const columns: ColumnsType<TransparencyReport> = [
    {
      title: 'Kỳ báo cáo',
      dataIndex: 'period',
      key: 'period',
      render: (period, record) => (
        <div>
          <Text strong>{period}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.reportType === 'MONTHLY' ? 'Tháng' : record.reportType === 'QUARTERLY' ? 'Quý' : 'Năm'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Dự án',
      key: 'projects',
      render: (_, record) => (
        <div>
          <Text>{record.statistics.projects.total} dự án</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.statistics.projects.completed} hoàn thành
          </Text>
        </div>
      ),
    },
    {
      title: 'Doanh thu',
      dataIndex: ['statistics', 'financials', 'totalRevenue'],
      key: 'revenue',
      render: (revenue) => <Text strong>{formatCurrency(revenue)}</Text>,
    },
    {
      title: 'Tỷ lệ thành công',
      dataIndex: ['statistics', 'projects', 'successRate'],
      key: 'successRate',
      render: (rate) => (
        <div style={{ width: 100 }}>
          <Progress percent={rate} size="small" />
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record.reportId)}>
            Xem
          </Button>
          {record.status === 'DRAFT' && (
            <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.reportId)}>
              Xóa
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const renderStatistics = (stats: ReportStatistics) => {
    // Data for charts
    const projectStatusData = [
      { name: 'Hoàn thành', value: stats.projects.completed },
      { name: 'Đang thực hiện', value: stats.projects.ongoing },
      { name: 'Hủy', value: stats.projects.cancelled },
    ];

    const fundDistributionData = [
      { name: 'Team (70%)', amount: stats.financials.teamDisbursed },
      { name: 'Mentor (20%)', amount: stats.financials.mentorDisbursed },
      { name: 'Lab (10%)', amount: stats.financials.labRevenue },
    ];

    return (
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Key Metrics */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng Dự án"
                value={stats.projects.total}
                prefix={<ProjectOutlined />}
                valueStyle={{ color: '#3f8600' }}
                suffix={
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    +{stats.projects.new}
                  </Text>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Doanh nghiệp"
                value={stats.enterprises.total}
                prefix={<ShopOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Sinh viên"
                value={stats.talents.total}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Doanh thu"
                value={stats.financials.totalRevenue}
                prefix={<DollarOutlined />}
                formatter={(val) => formatCurrency(val as number)}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Trạng thái Dự án" size="small">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Phân bổ Quỹ (70/20/10)" size="small">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={fundDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(val) => `${(val / 1000000000).toFixed(1)}B`} />
                  <Tooltip formatter={(val: number) => formatCurrency(val)} />
                  <Bar dataKey="amount" fill="#8884d8">
                    {fundDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Detailed Statistics */}
        <Card title="Chi tiết Thống kê" size="small">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Descriptions title="Dự án" column={1} size="small">
                <Descriptions.Item label="Tổng số">{stats.projects.total}</Descriptions.Item>
                <Descriptions.Item label="Mới">{stats.projects.new}</Descriptions.Item>
                <Descriptions.Item label="Đang thực hiện">{stats.projects.ongoing}</Descriptions.Item>
                <Descriptions.Item label="Hoàn thành">{stats.projects.completed}</Descriptions.Item>
                <Descriptions.Item label="Hủy">{stats.projects.cancelled}</Descriptions.Item>
                <Descriptions.Item label="Tỷ lệ thành công">
                  <Progress percent={stats.projects.successRate} size="small" />
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col xs={24} md={8}>
              <Descriptions title="Tài chính" column={1} size="small">
                <Descriptions.Item label="Tổng doanh thu">
                  {formatCurrency(stats.financials.totalRevenue)}
                </Descriptions.Item>
                <Descriptions.Item label="Giải ngân Team">
                  {formatCurrency(stats.financials.teamDisbursed)}
                </Descriptions.Item>
                <Descriptions.Item label="Giải ngân Mentor">
                  {formatCurrency(stats.financials.mentorDisbursed)}
                </Descriptions.Item>
                <Descriptions.Item label="Quỹ Lab">
                  {formatCurrency(stats.financials.labRevenue)}
                </Descriptions.Item>
                <Descriptions.Item label="Hybrid Fund tạm ứng">
                  {formatCurrency(stats.financials.hybridFundAdvanced)}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col xs={24} md={8}>
              <Descriptions title="Hiệu suất" column={1} size="small">
                <Descriptions.Item label="Hoàn thành TB">
                  <Progress percent={stats.performance.avgProjectCompletion} size="small" />
                </Descriptions.Item>
                <Descriptions.Item label="Đúng hạn">
                  <Progress percent={stats.performance.onTimeDelivery} size="small" status="active" />
                </Descriptions.Item>
                <Descriptions.Item label="Hài lòng KH">
                  <div>
                    <Progress percent={(stats.performance.customerSatisfaction / 5) * 100} size="small" strokeColor="#52c41a" />
                    <Text type="secondary">{stats.performance.customerSatisfaction}/5.0</Text>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>

        {/* Users Statistics */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Doanh nghiệp" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Tổng số">{stats.enterprises.total}</Descriptions.Item>
                <Descriptions.Item label="Mới">{stats.enterprises.new}</Descriptions.Item>
                <Descriptions.Item label="Đang hoạt động">{stats.enterprises.active}</Descriptions.Item>
                <Descriptions.Item label="Đã xác thực">{stats.enterprises.verified}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Sinh viên & Mentor" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Tổng sinh viên">{stats.talents.total}</Descriptions.Item>
                <Descriptions.Item label="Sinh viên mới">{stats.talents.new}</Descriptions.Item>
                <Descriptions.Item label="SV đang hoạt động">{stats.talents.active}</Descriptions.Item>
                <Descriptions.Item label="Đánh giá TB SV">
                  <Space>
                    <TrophyOutlined style={{ color: '#faad14' }} />
                    <Text strong>{stats.talents.averageRating}/10</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng Mentor">{stats.mentors.total}</Descriptions.Item>
                <Descriptions.Item label="Mentor hoạt động">{stats.mentors.active}</Descriptions.Item>
                <Descriptions.Item label="Đánh giá TB Mentor">
                  <Space>
                    <TrophyOutlined style={{ color: '#faad14' }} />
                    <Text strong>{stats.mentors.averageRating}/5.0</Text>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Space>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>
          <FileTextOutlined /> Báo cáo Minh bạch
        </Title>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setCreateModalVisible(true)}>
          Tạo Báo cáo Mới
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="reportId"
          loading={loading}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title={`Báo cáo ${selectedReport?.period}`}
        placement="right"
        width="80%"
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        extra={
          selectedReport?.status === 'DRAFT' && (
            <Space>
              <Button icon={<DownloadOutlined />} onClick={() => handleExportPDF(selectedReport.reportId)}>
                Export PDF
              </Button>
              <Button type="primary" icon={<SendOutlined />} onClick={() => setPublishModalVisible(true)}>
                Công bố
              </Button>
            </Space>
          )
        }
      >
        {selectedReport && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {selectedReport.status === 'PUBLISHED' && (
              <Alert
                message="Báo cáo đã được công bố"
                description={
                  <Space direction="vertical">
                    <Text>Công bố lúc: {selectedReport.publishedAt && new Date(selectedReport.publishedAt).toLocaleString('vi-VN')}</Text>
                    {selectedReport.publicUrl && (
                      <a href={selectedReport.publicUrl} target="_blank" rel="noopener noreferrer">
                        Xem bản công khai
                      </a>
                    )}
                    {selectedReport.pdfUrl && (
                      <a href={selectedReport.pdfUrl} target="_blank" rel="noopener noreferrer">
                        Tải PDF
                      </a>
                    )}
                  </Space>
                }
                type="success"
                showIcon
              />
            )}

            <Divider />

            {renderStatistics(selectedReport.statistics)}
          </Space>
        )}
      </Drawer>

      {/* Create Report Modal */}
      <Modal
        title="Tạo Báo cáo Minh bạch"
        open={createModalVisible}
        onCancel={() => { setCreateModalVisible(false); setSelectedPeriod(''); }}
        onOk={handleCreateReport}
        width={500}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <div style={{ marginBottom: 8 }}>Loại báo cáo *</div>
            <Select value={reportType} onChange={setReportType} style={{ width: '100%' }}>
              <Option value="MONTHLY">Báo cáo Tháng</Option>
              <Option value="QUARTERLY">Báo cáo Quý</Option>
              <Option value="YEARLY">Báo cáo Năm</Option>
            </Select>
          </div>

          <div>
            <div style={{ marginBottom: 8 }}>Kỳ báo cáo *</div>
            <MonthPicker
              style={{ width: '100%' }}
              placeholder="Chọn tháng"
              format="YYYY-MM"
              onChange={(date) => {
                if (date) {
                  setSelectedPeriod(date.format('YYYY-MM'));
                }
              }}
            />
          </div>

          <Alert
            message="Tự động tạo báo cáo"
            description="Hệ thống sẽ tự động thu thập và tổng hợp dữ liệu cho kỳ báo cáo đã chọn."
            type="info"
            showIcon
          />
        </Space>
      </Modal>

      {/* Publish Report Modal */}
      <Modal
        title="Công bố Báo cáo"
        open={publishModalVisible}
        onCancel={() => { setPublishModalVisible(false); setPublishNote(''); }}
        onOk={handlePublish}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Alert
            message="Xác nhận công bố"
            description={`Công bố báo cáo kỳ ${selectedReport?.period}? Sau khi công bố, báo cáo sẽ hiển thị công khai.`}
            type="warning"
            showIcon
          />

          <div>
            <div style={{ marginBottom: 8 }}>Ghi chú công bố *</div>
            <TextArea
              rows={3}
              value={publishNote}
              onChange={(e) => setPublishNote(e.target.value)}
              placeholder="Báo cáo tháng 01/2026 - Hệ thống hoạt động ổn định, tăng trưởng 15% so với tháng trước"
            />
          </div>
        </Space>
      </Modal>
    </div>
  );
}