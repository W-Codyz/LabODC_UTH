import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Progress,
  Button,
} from 'antd';
import { BarChartOutlined, DollarOutlined } from '@ant-design/icons';
import {
  getReportSummary,
  getProjectReports,
  ProjectReport,
} from '@/services/enterprise/report.service';
import { formatCurrencyVND } from '@/utils/formatters';
import '../enterprise-modern.css';

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    projects: 0,
    totalCost: 0,
    performance: 0,
    completedRate: 0,
  });

  const [data, setData] = useState<ProjectReport[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const summaryRes = await getReportSummary();
        const reportRes = await getProjectReports();

        setSummary(summaryRes ?? {
          projects: 0,
          totalCost: 0,
          performance: 0,
          completedRate: 0,
        });
        setData(Array.isArray(reportRes) ? reportRes : []);
      } catch (err) {
        console.error('Load report data failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <Button icon={<BarChartOutlined />}>
          Xuất báo cáo
        </Button>
      </div>

      {/* SUMMARY */}
      <Row gutter={16} className="stat-row">
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Tổng dự án"
              value={summary.projects}
            />
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
            <Statistic
              title="Hiệu suất"
              value={summary.performance}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Hoàn thành"
              value={summary.completedRate}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* TABLE */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="key"
        />
      </Card>
    </div>
  );
};

export default Reports;
