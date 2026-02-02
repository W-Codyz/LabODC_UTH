import React, { useState } from 'react';
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
} from '@/services/enterprise/proposal.service.ts';
import { formatCurrencyVND } from '@/utils/formatters';
import '../enterprise-modern.css';

const ProjectProposal: React.FC = () => {
  const [status, setStatus] = useState<string>('ALL');

  const summary = getProposalSummary();
  const proposals = getProposals(status);

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
      render: (s: string) => (
        <Tag color={s === 'PENDING' ? 'orange' : s === 'APPROVED' ? 'green' : 'red'}>
          {s}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
    },
    {
      title: 'Hành động',
      render: () => <Button type="link">Xem</Button>,
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
            <Statistic title="Tổng đề xuất" value={summary.total} prefix={<FileAddOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic title="Chờ duyệt" value={summary.pending} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic title="Đã duyệt" value={summary.approved} prefix={<CheckCircleOutlined />} />
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
        <Select value={status} onChange={setStatus} style={{ width: 220 }}>
          <Select.Option value="ALL">Tất cả</Select.Option>
          <Select.Option value="PENDING">Chờ duyệt</Select.Option>
          <Select.Option value="APPROVED">Đã duyệt</Select.Option>
          <Select.Option value="REJECTED">Từ chối</Select.Option>
        </Select>
      </div>

      {/* TABLE */}
      <Card className="table-card">
        <Table columns={columns} dataSource={proposals} />
      </Card>
    </div>
  );
};

export default ProjectProposal;