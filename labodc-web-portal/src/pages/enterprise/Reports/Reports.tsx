import React from 'react';
import { Row, Col, Card, Statistic, Table, Progress, Button } from 'antd';
import { BarChartOutlined, DollarOutlined } from '@ant-design/icons';
import { getReportSummary, getProjectReports } from '@/services/enterprise/report.service';
import { formatCurrencyVND } from '@/utils/formatters';
import styles from './Reports.module.css';

const Reports: React.FC = () => {
  const summary = getReportSummary();
  const data = getProjectReports();

  const columns = [
    { title: 'Dự án', dataIndex: 'name' },
    { title: 'Chi phí', dataIndex: 'cost', render:(v:number)=>formatCurrencyVND(v) },
    { title: 'Tiến độ', dataIndex: 'progress', render:(v:number)=><Progress percent={v} /> },
    { title: 'Trạng thái', dataIndex: 'status' }
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Báo cáo & Thống kê</h1>
        <Button icon={<BarChartOutlined />}>Xuất báo cáo</Button>
      </div>

      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Tổng dự án" value={summary.projects} /></Card></Col>
        <Col span={6}><Card><Statistic title="Tổng chi phí" value={summary.totalCost} formatter={(v)=>formatCurrencyVND(Number(v))} /></Card></Col>
        <Col span={6}><Card><Statistic title="Hiệu suất" value={summary.performance} suffix="%" /></Card></Col>
        <Col span={6}><Card><Statistic title="Hoàn thành" value={summary.completedRate} suffix="%" /></Card></Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Reports;