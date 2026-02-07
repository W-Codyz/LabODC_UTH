import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, Upload, Tag, Rate, message } from 'antd';
import { UserOutlined, UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  talentService,
  TalentProfile as TalentProfileType,
} from '../../services/talent/talentService';
import type { UploadProps } from 'antd';

const { TabPane } = Tabs;
const { TextArea } = Input;

const TalentProfile: React.FC = () => {
  const [profile, setProfile] = useState<TalentProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await talentService.getProfile();
      setProfile(data);
      form.setFieldsValue(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      message.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    try {
      setSaving(true);
      const updated = await talentService.updateProfile(values);
      setProfile(updated);
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload: UploadProps['customRequest'] = async (options) => {
    try {
      const { file } = options;
      const avatarUrl = await talentService.uploadAvatar(file as File);
      setProfile((prev) => (prev ? { ...prev, avatarUrl } : null));
      message.success('Avatar uploaded successfully');
    } catch (error) {
      message.error('Failed to upload avatar');
    }
  };

  if (loading || !profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card title="My Profile">
        <Tabs defaultActiveKey="1">
          {/* Personal Info Tab */}
          <TabPane tab="Personal Info" key="1">
            <Form form={form} layout="vertical" onFinish={handleSave} initialValues={profile}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
                <div>
                  <Upload
                    customRequest={handleAvatarUpload}
                    showUploadList={false}
                    accept="image/*"
                  >
                    <div
                      style={{
                        width: '120px',
                        height: '120px',
                        border: '2px dashed #d9d9d9',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backgroundImage: profile.avatarUrl
                          ? `url(${profile.avatarUrl})`
                          : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {!profile.avatarUrl && (
                        <div style={{ textAlign: 'center' }}>
                          <UserOutlined style={{ fontSize: '24px', color: '#999' }} />
                          <div style={{ fontSize: '12px', color: '#999' }}>Upload Avatar</div>
                        </div>
                      )}
                    </div>
                  </Upload>
                </div>

                <div style={{ flex: 1 }}>
                  <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Student ID" name="studentId">
                    <Input disabled />
                  </Form.Item>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Form.Item label="Faculty" name="faculty" style={{ flex: 1 }}>
                      <Input />
                    </Form.Item>
                    <Form.Item label="Major" name="major" style={{ flex: 1 }}>
                      <Input />
                    </Form.Item>
                    <Form.Item label="Year" name="yearOfStudy" style={{ width: '100px' }}>
                      <Input type="number" min={1} max={6} />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <Form.Item label="Bio" name="bio">
                <TextArea rows={4} placeholder="Tell us about yourself..." />
              </Form.Item>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item label="GitHub URL" name="githubUrl" style={{ flex: 1 }}>
                  <Input placeholder="https://github.com/username" />
                </Form.Item>
                <Form.Item label="LinkedIn URL" name="linkedinUrl" style={{ flex: 1 }}>
                  <Input placeholder="https://linkedin.com/in/username" />
                </Form.Item>
              </div>

              <Form.Item label="Portfolio URL" name="portfolioUrl">
                <Input placeholder="https://yourportfolio.com" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={saving}>
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Skills Tab */}
          <TabPane tab="Skills" key="2">
            <SkillsManagement profile={profile} onUpdate={setProfile} />
          </TabPane>

          {/* Certifications Tab */}
          <TabPane tab="Certifications" key="3">
            <CertificationsManagement profile={profile} onUpdate={setProfile} />
          </TabPane>

          {/* Stats Tab */}
          <TabPane tab="Statistics" key="4">
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <Card size="small">
                <div>Projects Completed</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  {profile.projectsCompleted}
                </div>
              </Card>
              <Card size="small">
                <div>Average Rating</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fadb14' }}>
                  <Rate disabled value={profile.averageRating} /> ({profile.averageRating})
                </div>
              </Card>
              <Card size="small">
                <div>Total Skills</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                  {profile.skills.length}
                </div>
              </Card>
              <Card size="small">
                <div>Certifications</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#13c2c2' }}>
                  {profile.certifications.length}
                </div>
              </Card>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

// Skills Management Component
const SkillsManagement: React.FC<{
  profile: TalentProfileType;
  onUpdate: (profile: TalentProfileType) => void;
}> = ({ profile, onUpdate }) => {
  const [addingSkill, setAddingSkill] = useState(false);
  const [form] = Form.useForm();

  const handleAddSkill = async (values: any) => {
    try {
      setAddingSkill(true);
      await talentService.addSkill(values);
      // Refresh profile
      const updated = await talentService.getProfile();
      onUpdate(updated);
      form.resetFields();
      message.success('Skill added successfully');
    } catch (error) {
      message.error('Failed to add skill');
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillId: number) => {
    try {
      await talentService.removeSkill(skillId);
      // Refresh profile
      const updated = await talentService.getProfile();
      onUpdate(updated);
      message.success('Skill removed successfully');
    } catch (error) {
      message.error('Failed to remove skill');
    }
  };

  return (
    <div>
      {/* Existing Skills */}
      <div style={{ marginBottom: '24px' }}>
        {profile.skills.map((skill) => (
          <Tag
            key={skill.id}
            closable
            onClose={() => handleRemoveSkill(skill.id)}
            style={{ marginBottom: '8px', padding: '4px 8px' }}
          >
            {skill.skillName} ({skill.proficiencyLevel})
            {skill.yearsOfExperience && ` - ${skill.yearsOfExperience}y`}
          </Tag>
        ))}
      </div>

      {/* Add New Skill Form */}
      <Card title="Add New Skill" size="small">
        <Form form={form} layout="vertical" onFinish={handleAddSkill}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
            <Form.Item
              label="Skill Name"
              name="skillName"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="e.g., ReactJS, Python, etc." />
            </Form.Item>
            <Form.Item label="Level" name="proficiencyLevel" rules={[{ required: true }]}>
              <Input placeholder="BEGINNER/INTERMEDIATE/ADVANCED/EXPERT" />
            </Form.Item>
            <Form.Item label="Years" name="yearsOfExperience">
              <Input type="number" step="0.5" min="0" style={{ width: '80px' }} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={addingSkill}
                icon={<PlusOutlined />}
              >
                Add
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
    </div>
  );
};

// Certifications Management Component
const CertificationsManagement: React.FC<{
  profile: TalentProfileType;
  onUpdate: (profile: TalentProfileType) => void;
}> = ({ profile }) => {
  return (
    <div>
      <div>Certifications management coming soon...</div>
    </div>
  );
};

export default TalentProfile;
