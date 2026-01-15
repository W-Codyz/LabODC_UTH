import React from 'react';
import { Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const ProjectProposal: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <h1 className="page-title">Đề xuất dự án mới</h1>
      <Card>
        <p>Form đề xuất dự án sẽ được phát triển ở đây...</p>
        <Button onClick={() => navigate('/enterprise/dashboard')}>Quay lại Dashboard</Button>
      </Card>
    </div>
  );
};

export default ProjectProposal;
