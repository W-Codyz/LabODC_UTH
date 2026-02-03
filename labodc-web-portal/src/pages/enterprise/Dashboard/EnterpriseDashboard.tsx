import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Button, Table, Tag, Modal, Descriptions, message } from 'antd';
import {
  ProjectOutlined,
  DollarOutlined,
  TeamOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  getEnterpriseDashboardSummary,
  getRecentProjects,
} from '@/services/enterprise/dashboard.service';
import { getProjectById } from '@/services/enterprise/project.service';
import { formatCurrencyVND } from '@/utils/formatters';
import '../enterprise-modern.css';

const EnterpriseDashboard: React.FC = () => {
  const navigate = useNavigate();

  // ✅ STATE
  const [summary, setSummary] = useState<any>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalSpent: 0,
  });

  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const summaryRes = await getEnterpriseDashboardSummary();
        const projectsRes = await getRecentProjects();

        setSummary(summaryRes ?? {
          totalProjects: 0,
          activeProjects: 0,
          completedProjects: 0,
          totalSpent: 0,
        });
        setRecentProjects(Array.isArray(projectsRes) ? projectsRes : []);
      } catch (error) {
        console.error('Load dashboard failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'Tên dự án',
      dataIndex: 'name',
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      render: (v: number) => <Progress percent={v} />,
    },
    {
      title: 'Thành viên',
      dataIndex: 'members',
      render: (v: number) => (
        <>
          <TeamOutlined /> {v}
        </>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (s: string) => (
        <Tag color={s === 'COMPLETED' ? 'green' : 'blue'}>{s}</Tag>
      ),
    },
    {
      title: 'Hành động',
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={async () => {
            try {
              setDetailLoading(true);
              const detail = await getProjectById(record.id);
              setDetailData(detail ?? null);
              setDetailOpen(true);
            } catch (err: any) {
              message.error(err?.message || 'Không thể tải chi tiết dự án');
            } finally {
              setDetailLoading(false);
            }
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <div className="page-header">
        <h1>Dashboard Doanh nghiệp</h1>
        <Button type="primary" onClick={() => navigate('/enterprise/projects')}>
          Tạo dự án mới
        </Button>
      </div>

      {/* SUMMARY */}
      <Row gutter={16} className="stat-row">
        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic title="Tổng dự án" value={summary.totalProjects} prefix={<ProjectOutlined />} />
          </Card>
        </Col>

        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Đang thực hiện"
              value={summary.activeProjects}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Hoàn thành"
              value={summary.completedProjects}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#22c55e' }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card className="modern-card stat-card">
            <Statistic
              title="Tổng chi phí"
              value={summary.totalSpent}
              prefix={<DollarOutlined />}
              formatter={(v) => formatCurrencyVND(Number(v))}
            />
          </Card>
        </Col>
      </Row>

      {/* TABLE */}
      <Card
        title="Dự án gần đây"
        className="table-card"
        loading={loading}
        extra={
          <Button type="link" onClick={() => navigate('/enterprise/projects')}>
            Xem tất cả
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={recentProjects}
          pagination={false}
        />
      </Card>

      <Modal
        title="Chi tiết dự án"
        open={detailOpen}
        onCancel={() => {
          setDetailOpen(false);
          setDetailData(null);
        }}
        footer={null}
      >
        <Descriptions
          bordered
          size="small"
          column={1}
          labelStyle={{ width: 160 }}
          loading={detailLoading}
        >
          <Descriptions.Item label="Tên dự án">
            {detailData?.name ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {detailData?.status ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngân sách">
            {typeof detailData?.budget === 'number'
              ? formatCurrencyVND(detailData.budget)
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {detailData?.description ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Yêu cầu">
            {detailData?.requirements ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Mục tiêu">
            {Array.isArray(detailData?.objectives)
              ? detailData.objectives.join(', ')
              : detailData?.objective ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Công nghệ">
            {Array.isArray(detailData?.technologies)
              ? detailData.technologies.join(', ')
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Kỹ năng yêu cầu">
            {Array.isArray(detailData?.requiredSkills)
              ? detailData.requiredSkills.join(', ')
              : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Bắt đầu">
            {detailData?.startDate ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Kết thúc">
            {detailData?.endDate ?? '-'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};

export default EnterpriseDashboard;
