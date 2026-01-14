// Sidebar Component
import React from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  FileTextOutlined,
  DollarOutlined,
  TeamOutlined,
  SettingOutlined,
  CheckSquareOutlined,
  FundOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import styles from './Sidebar.module.css';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Menu items based on user role
  const getMenuItems = (): MenuProps['items'] => {
    if (!user) return [];

    const baseItems: MenuProps['items'] = [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        onClick: () => navigate(`/${user.role.toLowerCase()}/dashboard`),
      },
    ];

    // Enterprise menu
    if (user.role === 'ENTERPRISE') {
      return [
        ...baseItems,
        {
          key: 'projects',
          icon: <ProjectOutlined />,
          label: 'Dự án',
          children: [
            {
              key: 'projects-new',
              label: 'Đề xuất mới',
              onClick: () => navigate('/enterprise/projects/new'),
            },
            {
              key: 'projects-list',
              label: 'Quản lý dự án',
              onClick: () => navigate('/enterprise/projects'),
            },
          ],
        },
        {
          key: 'payment',
          icon: <DollarOutlined />,
          label: 'Thanh toán',
          onClick: () => navigate('/enterprise/payment'),
        },
        {
          key: 'reports',
          icon: <FileTextOutlined />,
          label: 'Báo cáo',
          onClick: () => navigate('/enterprise/reports'),
        },
      ];
    }

    // Talent menu
    if (user.role === 'TALENT' || user.role === 'TALENT_LEADER') {
      return [
        ...baseItems,
        {
          key: 'browse-projects',
          icon: <ProjectOutlined />,
          label: 'Duyệt dự án',
          onClick: () => navigate('/talent/projects/browse'),
        },
        {
          key: 'my-projects',
          icon: <TeamOutlined />,
          label: 'Dự án của tôi',
          onClick: () => navigate('/talent/my-projects'),
        },
        {
          key: 'tasks',
          icon: <CheckSquareOutlined />,
          label: 'Nhiệm vụ',
          onClick: () => navigate('/talent/tasks'),
        },
      ];
    }

    // Mentor menu
    if (user.role === 'MENTOR') {
      return [
        ...baseItems,
        {
          key: 'invitations',
          icon: <ProjectOutlined />,
          label: 'Lời mời dự án',
          onClick: () => navigate('/mentor/invitations'),
        },
        {
          key: 'reports',
          icon: <FileTextOutlined />,
          label: 'Báo cáo',
          onClick: () => navigate('/mentor/reports'),
        },
      ];
    }

    // Lab Admin menu
    if (user.role === 'LAB_ADMIN') {
      return [
        ...baseItems,
        {
          key: 'enterprises',
          icon: <TeamOutlined />,
          label: 'Doanh nghiệp',
          onClick: () => navigate('/admin/enterprises'),
        },
        {
          key: 'projects-validate',
          icon: <ProjectOutlined />,
          label: 'Xác thực dự án',
          onClick: () => navigate('/admin/projects/validate'),
        },
        {
          key: 'funds',
          icon: <FundOutlined />,
          label: 'Phân bổ quỹ',
          onClick: () => navigate('/admin/funds'),
        },
        {
          key: 'reports',
          icon: <FileTextOutlined />,
          label: 'Báo cáo minh bạch',
          onClick: () => navigate('/admin/reports'),
        },
      ];
    }

    // System Admin menu
    if (user.role === 'SYSTEM_ADMIN') {
      return [
        ...baseItems,
        {
          key: 'config',
          icon: <SettingOutlined />,
          label: 'Cấu hình',
          onClick: () => navigate('/system/config'),
        },
        {
          key: 'roles',
          icon: <TeamOutlined />,
          label: 'Vai trò',
          onClick: () => navigate('/system/roles'),
        },
        {
          key: 'users',
          icon: <TeamOutlined />,
          label: 'Người dùng',
          onClick: () => navigate('/system/users'),
        },
      ];
    }

    return baseItems;
  };

  // Get selected key from current location
  const getSelectedKey = (): string => {
    const path = location.pathname;
    if (path.includes('/projects/new')) return 'projects-new';
    if (path.includes('/projects')) return 'projects-list';
    if (path.includes('/payment')) return 'payment';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/tasks')) return 'tasks';
    if (path.includes('/dashboard')) return 'dashboard';
    return 'dashboard';
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      className={styles.sider}
      breakpoint="lg"
      width={250}
    >
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={getMenuItems()}
        className={styles.menu}
      />
    </Sider>
  );
};

export default Sidebar;
