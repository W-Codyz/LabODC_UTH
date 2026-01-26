import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button, Select } from 'antd';
import { FileAddOutlined, ClockCircleOutlined, CheckCircleOutlined, DollarOutlined } from '@ant-design/icons';
import { getProposalSummary, getProposals } from '@/services/enterprise/proposal.service';
import { formatCurrencyVND } from '@/utils/formatters';
import styles from './ProjectProposal.module.css';

const ProjectProposal: React.FC = () => {
  const [status, setStatus] = useState<string>('ALL');
  const summary = getProposalSummary();
  const proposals = getProposals(status);

  const columns = [
    { title: 'Tên đề xuất', dataIndex: 'name' },
    { title: 'Ngân sách', dataIndex: 'budget', render: (v:number)=>formatCurrencyVND(v) },
    { title: 'Trạng thái', dataIndex: 'status', render: (s:string)=><Tag color={s==='PENDING'?'orange':s==='APPROVED'?'green':'red'}>{s}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'createdAt' },
    { title: 'Hành động', render:()=> <Button type="link">Xem</Button> }
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Đề xuất dự án</h1>
        <Button type="primary" icon={<FileAddOutlined />}>Tạo đề xuất</Button>
      </div>

      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Tổng đề xuất" value={summary.total} prefix={<FileAddOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Chờ duyệt" value={summary.pending} prefix={<ClockCircleOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Đã duyệt" value={summary.approved} prefix={<CheckCircleOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Tổng ngân sách" value={summary.totalBudget} prefix={<DollarOutlined />} formatter={(v)=>formatCurrencyVND(Number(v))} /></Card></Col>
      </Row>

      <Card className={styles.tableCard}>
        <Select value={status} onChange={setStatus} style={{ width: 200 }}>
          <Select.Option value="ALL">Tất cả</Select.Option>
          <Select.Option value="PENDING">Chờ duyệt</Select.Option>
          <Select.Option value="APPROVED">Đã duyệt</Select.Option>
          <Select.Option value="REJECTED">Từ chối</Select.Option>
        </Select>
        <Table columns={columns} dataSource={proposals} style={{ marginTop: 16 }} />
      </Card>
    </div>
  );
};

export default ProjectProposal;