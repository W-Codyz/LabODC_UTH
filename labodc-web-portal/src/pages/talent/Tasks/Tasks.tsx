import React from 'react';
import { Card, Table, Tag, Typography } from 'antd';
import '@/pages/enterprise/enterprise-modern.css';

interface TaskRow {
  key: number;
  name: string;
  project: string;
  status: string;
}

const tasks: TaskRow[] = [
  { key: 1, name: 'Thiết kế giao diện trang đăng nhập', project: 'AI Resume Screening', status: 'Hoàn thành' },
  { key: 2, name: 'Kết nối API đăng ký', project: 'AI Resume Screening', status: 'Đang làm' },
];

const Tasks: React.FC = () => {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Nhiệm vụ</h1>
      </div>

      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Danh sách nhiệm vụ được giao trong các dự án. (Dữ liệu mẫu – sẽ kết nối API khi backend hỗ trợ.)
      </Typography.Text>

      <Card title="Danh sách nhiệm vụ" className="modern-card table-card">
        <Table
          dataSource={tasks}
          pagination={false}
          columns={[
            { title: 'Tên nhiệm vụ', dataIndex: 'name' },
            { title: 'Dự án', dataIndex: 'project' },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              render: (status: string) => (
                <Tag color={status === 'Hoàn thành' ? 'green' : 'blue'}>{status}</Tag>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Tasks;
