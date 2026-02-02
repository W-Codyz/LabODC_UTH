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
} from 'antd';
import {
  FileAddOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import {
  getProposalSummary,
  getProposals,
  Proposal,
} from '@/services/enterprise/proposal.service';
import { formatCurrencyVND } from '@/utils/formatters';
import '../enterprise-modern.css';

const ProjectProposal: React.FC = () => {
  const [status, setStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    totalBudget: 0,
  });

  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const summaryRes = await getProposalSummary();
        const proposalsRes = await getProposals(status);

        setSummary(summaryRes);
        setProposals(proposalsRes);
      } catch (err) {
        console.error('Load proposal data failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status]);

  const columns = [
    {
      title: 'Tên đề xuất',
      dataIndex: 'name',
    },
    {
      title: 'Ngân sách',
      dataIndex: 'budget',
      render: (v: number) => formatCurrencyVND(v),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (s: string) => {
        const color =
          s === 'PENDING'
            ? 'orange'
            : s === 'APPROVED'
            ? 'green'
            : 'red';
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
    },
    {
      title: 'Hành động',
      render: (_: any, record: Proposal) => (
        <Button type="link">
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <div className="page-header">
        <h1>Đề xuất dự án</h1>
        <Button type="primary" icon={<FileAddOutlined />}>
          Tạo đề xuất
        </Button>
      </div>

      {/* SUMMARY */}
      <Row gutter={16} className="stat-row">
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Tổng đề xuất"
              value={summary.total}
              prefix={<FileAddOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Chờ duyệt"
              value={summary.pending}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Đã duyệt"
              value={summary.approved}
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
          <Select.Option value="PENDING">Chờ duyệt</Select.Option>
          <Select.Option value="APPROVED">Đã duyệt</Select.Option>
          <Select.Option value="REJECTED">Từ chối</Select.Option>
        </Select>
      </div>

      {/* TABLE */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={proposals}
          loading={loading}
          rowKey="key"
        />
      </Card>
    </div>
  );
};

export default ProjectProposal;
