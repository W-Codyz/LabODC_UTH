import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button } from 'antd';
import { DollarOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getPaymentSummary, getPayments } from '@/services/enterprise/payment.service';
import { formatCurrencyVND } from '@/utils/formatters';
import styles from './Payment.module.css';

const Payment: React.FC = () => {
  const summary = getPaymentSummary();
  const payments = getPayments();

  const columns = [
    { title: 'Mã thanh toán', dataIndex: 'code' },
    { title: 'Dự án', dataIndex: 'project' },
    { title: 'Số tiền', dataIndex: 'amount', render:(v:number)=>formatCurrencyVND(v) },
    { title: 'Hạn', dataIndex: 'dueDate' },
    { title: 'Trạng thái', dataIndex: 'status', render:(s:string)=><Tag color={s==='PAID'?'green':s==='OVERDUE'?'red':'orange'}>{s}</Tag> },
    { title: 'Hành động', render:()=> <Button type="link">Chi tiết</Button> }
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Thanh toán</h1>
        <Button type="primary">Tạo yêu cầu</Button>
      </div>

      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="Đã thanh toán" value={summary.paid} prefix={<CheckCircleOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Chờ thanh toán" value={summary.pending} prefix={<DollarOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Quá hạn" value={summary.overdue} prefix={<WarningOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="Ngân sách còn lại" value={summary.remaining} formatter={(v)=>formatCurrencyVND(Number(v))} /></Card></Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Table columns={columns} dataSource={payments} />
      </Card>
    </div>
  );
};

export default Payment;
