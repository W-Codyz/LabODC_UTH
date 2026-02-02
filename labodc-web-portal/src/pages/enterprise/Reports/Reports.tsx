import React from 'react';
import { Row, Col, Card, Statistic, Table, Progress, Button } from 'antd';
import { BarChartOutlined, DollarOutlined } from '@ant-design/icons';
import {
  getReportSummary,
  getProjectReports,
} from '@/services/enterprise/report.service.ts';
import { formatCurrencyVND } from '@/utils/formatters';
import '../enterprise-modern.css';

const Reports: React.FC = () => {
  const summary = getReportSummary();
  const data = getProjectReports();

  const columns = [
    {
      title: 'Dự án',
      dataIndex: 'name',
    },
    {
      title: 'Chi phí',
      dataIndex: 'cost',
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
    },
  ];

  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <div className="page-header">
        <h1>Báo cáo & Thống kê</h1>
        <Button icon={<BarChartOutlined />}>Xuất báo cáo</Button>
      </div>

      {/* SUMMARY */}
      <Row gutter={16} className="stat-row">
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic title="Tổng dự án" value={summary.projects} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Tổng chi phí"
              value={summary.totalCost}
              prefix={<DollarOutlined />}
              formatter={(v) => formatCurrencyVND(Number(v))}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic title="Hiệu suất" value={summary.performance} suffix="%" />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic title="Hoàn thành" value={summary.completedRate} suffix="%" />
          </Card>
        </Col>
      </Row>

      {/* TABLE */}
      <Card className="table-card">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Reports;