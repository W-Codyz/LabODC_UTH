// Login Page
import React, { useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';
import { ILoginRequest } from '@/types/auth.types';
import { ROUTES } from '@/utils/constants';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, isAuthenticated, user } = useAppSelector((state) => state.auth);
  const from = (location.state as { from?: string })?.from;

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(from || ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const loginData: ILoginRequest = {
        email: values.username,
        password: values.password,
      };
      await dispatch(login(loginData)).unwrap();
      message.success('Đăng nhập thành công!');
      navigate(from || ROUTES.HOME, { replace: true });
    } catch (error: any) {
      message.error(error?.message ?? error ?? 'Đăng nhập thất bại!');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logoSection}>
          <img src="/src/images/logo_uth.png" alt="LabOdc" className={styles.logo} />
          <h1 className={styles.title}>LabOdc Web Portal</h1>
          <p className={styles.subtitle}>Hệ thống quản lý kết nối doanh nghiệp - sinh viên</p>
        </div>

        <Card className={styles.card}>
          <h2 className={styles.cardTitle}>Đăng nhập</h2>
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
                type="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <div className={styles.formFooter}>
                <Link to="/forgot-password" className={styles.forgotLink}>
                  Quên mật khẩu?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <div className={styles.registerLink}>
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
