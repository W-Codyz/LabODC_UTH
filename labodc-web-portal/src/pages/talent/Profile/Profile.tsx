import React, { useEffect, useState } from 'react';
import { Card, Avatar, Descriptions, Spin, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/store/hooks';
import { userService } from '@/services/user.service';
import type { IUserProfile } from '@/types/user.types';
import { ROLE_LABELS } from '@/utils/constants';
import '@/pages/enterprise/enterprise-modern.css';

const Profile: React.FC = () => {
  const { user: authUser } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        setProfile(data);
      } catch (e: any) {
        message.error(e?.message ?? 'Không tải được hồ sơ');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const displayName = (profile?.fullName || profile?.email || authUser?.email) ?? '—';
  const roleLabel = profile?.role
    ? (ROLE_LABELS as Record<string, string>)[profile.role] ?? profile.role
    : authUser?.role
      ? (ROLE_LABELS as Record<string, string>)[authUser.role]
      : '—';

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Hồ sơ cá nhân</h1>
      </div>

      <Card className="modern-card" loading={loading}>
        <div style={{ marginBottom: 24 }}>
          <Avatar
            size={80}
            icon={<UserOutlined />}
            style={{ marginBottom: 16 }}
          />
        </div>
        <Descriptions column={1} bordered size="middle" labelStyle={{ width: 160 }}>
          <Descriptions.Item label="Họ tên">{displayName}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">{roleLabel}</Descriptions.Item>
          <Descriptions.Item label="Email">{profile?.email ?? authUser?.email ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{profile?.status ?? 'ACTIVE'}</Descriptions.Item>
          {(profile as any)?.skills?.length > 0 && (
            <Descriptions.Item label="Kỹ năng">
              {(profile as any).skills.join(', ')}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
};

export default Profile;
