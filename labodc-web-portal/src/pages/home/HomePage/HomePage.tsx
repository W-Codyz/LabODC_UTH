// Home Page
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getDefaultRoute } from '@/utils/permissions';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      const defaultRoute = getDefaultRoute(user.role);
      navigate(defaultRoute);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>LabOdc Web Portal</h1>
          <h2 className={styles.subtitle}>
            Hệ thống quản lý kết nối doanh nghiệp với sinh viên UTH
          </h2>
          <p className={styles.description}>
            Nền tảng Lab-based ODC phi lợi nhuận, cho phép doanh nghiệp và sinh viên 
            hợp tác trong các dự án thực tế với tính minh bạch và trách nhiệm giải trình.
          </p>
          <div className={styles.actions}>
            <Button
              type="primary"
              size="large"
              onClick={handleGetStarted}
              className={styles.primaryBtn}
            >
              {isAuthenticated ? 'Vào Dashboard' : 'Bắt đầu'}
            </Button>
            {!isAuthenticated && (
              <Button
                size="large"
                onClick={() => navigate('/register')}
                className={styles.secondaryBtn}
              >
                Đăng ký ngay
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Tính năng nổi bật</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏢</div>
              <h3>Doanh nghiệp</h3>
              <p>Đề xuất dự án, quản lý nhóm thực hiện, thanh toán và đánh giá</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👨‍🎓</div>
              <h3>Sinh viên</h3>
              <p>Tham gia dự án thực tế, phát triển kỹ năng và nhận feedback</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👨‍🏫</div>
              <h3>Mentor</h3>
              <p>Hướng dẫn nhóm, quản lý task và đánh giá tiến độ</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h3>Quản lý quỹ</h3>
              <p>Phân bổ minh bạch theo tỷ lệ 70/20/10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
