// Header Component
import React from 'react';
import { Layout, Avatar, Dropdown, Badge, MenuProps } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { formatRoleLabel } from '@/utils/formatters';
import styles from './Header.module.css';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: logout,
      danger: true,
    },
  ];

  return (
    <AntHeader className={styles.header}>
      <div className={styles.logo}>
        <img src="/src/images/logo_uth.png" alt="LabOdc" className={styles.logoImg} />
        {/* <span className={styles.logoText}>LabOdc</span> */}
      </div>

      <div className={styles.nav}>
        <Badge count={5} className={styles.notificationBadge}>
          <BellOutlined className={styles.notificationIcon} />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <div className={styles.userMenu}>
            <Avatar
              size="large"
              src={user?.avatar}
              icon={<UserOutlined />}
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user?.fullName}</div>
              <div className={styles.userRole}>{user && formatRoleLabel(user.role)}</div>
            </div>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
