import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import styles from '../Login/Login.module.css';

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values: { email: string }) => {
    try {
      setLoading(true);
      await authService.forgotPassword({ email: values.email });
      setSubmitted(true);
      message.success('Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.');
    } catch (error: any) {
      message.error(error?.message ?? 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <div className={styles.logoSection}>
            <img src="/src/images/logo_uth.png" alt="LabOdc" className={styles.logo} />
            <h1 className={styles.title}>LabOdc Web Portal</h1>
          </div>
          <Card className={styles.card}>
            <h2 className={styles.cardTitle}>Kiểm tra email</h2>
            <p style={{ color: '#666', marginBottom: 24 }}>
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn (nếu tài khoản tồn tại).
            </p>
            <Link to="/login">
              <Button type="primary" size="large" block>Quay lại đăng nhập</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logoSection}>
          <img src="/src/images/logo_uth.png" alt="LabOdc" className={styles.logo} />
          <h1 className={styles.title}>LabOdc Web Portal</h1>
          <p className={styles.subtitle}>Quên mật khẩu</p>
        </div>

        <Card className={styles.card}>
          <h2 className={styles.cardTitle}>Quên mật khẩu</h2>
          <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
            Nhập email đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu.
          </p>
          <Form name="forgot" onFinish={onFinish} layout="vertical" requiredMark={false}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" size="large" type="email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading} block>
                Gửi yêu cầu
              </Button>
            </Form.Item>
            <div className={styles.registerLink}>
              <Link to="/login">Quay lại đăng nhập</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
