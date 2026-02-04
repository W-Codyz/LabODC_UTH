import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import styles from '../Login/Login.module.css';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onFinish = async (values: { newPassword: string; confirmPassword: string }) => {
    if (!token) {
      message.error('Link không hợp lệ.');
      return;
    }
    try {
      setLoading(true);
      await authService.resetPassword({
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      setSuccess(true);
      message.success('Đặt lại mật khẩu thành công!');
    } catch (error: any) {
      message.error(error?.message ?? 'Đặt lại mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <div className={styles.logoSection}>
            <img src="/src/images/logo_uth.png" alt="LabOdc" className={styles.logo} />
            <h1 className={styles.title}>LabOdc Web Portal</h1>
          </div>
          <Card className={styles.card}>
            <h2 className={styles.cardTitle}>Đặt lại mật khẩu thành công</h2>
            <p style={{ color: '#666', marginBottom: 24 }}>
              Bạn có thể đăng nhập bằng mật khẩu mới.
            </p>
            <Button type="primary" size="large" block onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <Card className={styles.card}>
            <h2 className={styles.cardTitle}>Link không hợp lệ</h2>
            <p style={{ color: '#666', marginBottom: 24 }}>
              Link đặt lại mật khẩu không đúng hoặc đã hết hạn.
            </p>
            <Link to="/forgot-password">
              <Button type="primary" size="large" block>Gửi lại yêu cầu</Button>
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
          <p className={styles.subtitle}>Đặt lại mật khẩu</p>
        </div>

        <Card className={styles.card}>
          <h2 className={styles.cardTitle}>Đặt lại mật khẩu</h2>
          <Form
            name="reset"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu mới"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Xác nhận mật khẩu mới"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading} block>
                Đặt lại mật khẩu
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

export default ResetPassword;
