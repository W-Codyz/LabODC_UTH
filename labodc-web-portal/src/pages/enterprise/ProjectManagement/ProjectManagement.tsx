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
  Progress,
} from 'antd';
import {
  ProjectOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getProjectSummary, getProjects, Project } from '@/services/enterprise/project.service';
import { formatCurrencyVND } from '@/utils/formatters';
import styles from './ProjectManagement.module.css';

const ProjectManagement: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('ALL');

  const summary = getProjectSummary();
  const projects = getProjects(status);

  const columns = [
    {
      title: 'Tên dự án',
      dataIndex: 'name',
    },
    {
      title: 'Ngân sách',
      dataIndex: 'budget',
      render: (v: number) => formatCurrencyVND(v),
    },
    {
      title: 'Đã chi',
      dataIndex: 'spent',
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
      render: (s: string) => {
        const color =
          s === 'COMPLETED' ? 'green' : s === 'IN_PROGRESS' ? 'blue' : 'orange';
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: 'Hành động',
      render: (_: any, record: Project) => (
        <Button type="link" onClick={() => navigate(`/enterprise/projects/${record.key}`)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>Quản lý dự án</h1>
        <Button type="primary" icon={<ProjectOutlined />}>
          Tạo dự án mới
        </Button>
      </div>

      {/* SUMMARY CARDS */}
      <Row gutter={16} className={styles.cardRow}>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng dự án" value={summary.total} prefix={<ProjectOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Đang thực hiện" value={summary.inProgress} prefix={<RiseOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Hoàn thành" value={summary.completed} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
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
      <div className={styles.filterBar}>
        <Select value={status} onChange={setStatus} style={{ width: 220 }}>
          <Select.Option value="ALL">Tất cả</Select.Option>
          <Select.Option value="IN_PROGRESS">Đang thực hiện</Select.Option>
          <Select.Option value="COMPLETED">Hoàn thành</Select.Option>
          <Select.Option value="ON_HOLD">Tạm dừng</Select.Option>
        </Select>
      </div>

      {/* TABLE */}
      <Card className={styles.tableCard}>
        <Table columns={columns} dataSource={projects} />
      </Card>
    </div>
  );
};

export default ProjectManagement;
