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

    // Dashboard item with correct routing based on role
    const getDashboardRoute = () => {
      switch (user.role) {
        case 'LAB_ADMIN':
          return '/admin/dashboard';
        case 'SYSTEM_ADMIN':
          return '/system/dashboard';
        case 'ENTERPRISE':
          return '/enterprise/dashboard';
        case 'TALENT':
        case 'TALENT_LEADER':
          return '/talent/dashboard';
        case 'MENTOR':
          return '/mentor/dashboard';
        default:
          return '/';
      }
    };

    const baseItems: MenuProps['items'] = [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        onClick: () => navigate(getDashboardRoute()),
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
    
    // Dashboard
    if (path.includes('/dashboard')) return 'dashboard';
    
    // Enterprise routes
    if (path.includes('/projects/new')) return 'projects-new';
    if (path.includes('/projects') && !path.includes('/validate')) return 'projects-list';
    if (path.includes('/payment')) return 'payment';
    
    // Talent routes
    if (path.includes('/projects/browse')) return 'browse-projects';
    if (path.includes('/my-projects')) return 'my-projects';
    if (path.includes('/tasks')) return 'tasks';
    
    // Mentor routes
    if (path.includes('/invitations')) return 'invitations';
    
    // Lab Admin routes
    if (path.includes('/enterprises')) return 'enterprises';
    if (path.includes('/projects/validate')) return 'projects-validate';
    if (path.includes('/funds')) return 'funds';
    
    // Reports (multiple roles use this)
    if (path.includes('/reports')) return 'reports';
    
    // System Admin routes
    if (path.includes('/config')) return 'config';
    if (path.includes('/roles')) return 'roles';
    if (path.includes('/users')) return 'users';
    
    return 'dashboard';
  };

  return (
    <Sider
      trigger={null}
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
