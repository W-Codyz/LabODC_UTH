import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Button,
} from 'antd';
import {
  DollarOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import {
  getPaymentSummary,
  getPayments,
  PaymentItem,
} from '@/services/enterprise/payment.service';
import { formatCurrencyVND } from '@/utils/formatters';
import '../enterprise-modern.css';

const Payment: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    paid: 0,
    pending: 0,
    overdue: 0,
    remaining: 0,
  });

  const [payments, setPayments] = useState<PaymentItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const summaryRes = await getPaymentSummary();
        const paymentsRes = await getPayments();

        setSummary(summaryRes);
        setPayments(paymentsRes);
      } catch (err) {
        console.error('Load payment data failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'Mã thanh toán',
      dataIndex: 'code',
    },
    {
      title: 'Dự án',
      dataIndex: 'project',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      render: (v: number) => formatCurrencyVND(v),
    },
    {
      title: 'Hạn thanh toán',
      dataIndex: 'dueDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (s: string) => {
        const color =
          s === 'PAID'
            ? 'green'
            : s === 'OVERDUE'
            ? 'red'
            : 'orange';
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: 'Hành động',
      render: (_: any, record: PaymentItem) => (
        <Button type="link">
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <div className="page-header">
        <h1>Thanh toán</h1>
        <Button type="primary">
          Tạo yêu cầu
        </Button>
      </div>

      {/* SUMMARY */}
      <Row gutter={16} className="stat-row">
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Đã thanh toán"
              value={summary.paid}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Chờ thanh toán"
              value={summary.pending}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Quá hạn"
              value={summary.overdue}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Ngân sách còn lại"
              value={summary.remaining}
              formatter={(v) => formatCurrencyVND(Number(v))}
            />
          </Card>
        </Col>
      </Row>

      {/* TABLE */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={payments}
          loading={loading}
          rowKey="key"
        />
      </Card>
    </div>
  );
};

export default Payment;
