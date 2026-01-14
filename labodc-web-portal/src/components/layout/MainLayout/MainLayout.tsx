// Main Layout Component
import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import { useAppSelector } from '@/store/hooks';
import styles from './MainLayout.module.css';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <Layout className={styles.layout}>
      <Header />
      <Layout>
        <Sidebar collapsed={sidebarCollapsed} />
        <Layout className={styles.contentLayout}>
          <Content className={styles.content}>
            <Outlet />
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
