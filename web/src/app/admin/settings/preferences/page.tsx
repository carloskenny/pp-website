'use client';

import { Button, Card, Form, Select, Switch, Typography, message } from 'antd';
import { useAuth } from '@/components/auth/auth-provider';
import { SettingsTabs } from '@/components/layout/settings-tabs';

export default function AdminSettingsPreferencesPage() {
  const { user, updateProfile } = useAuth();
  const [form] = Form.useForm();

  if (!user) return null;

  async function onFinish(values: {
    theme: 'light' | 'dark' | 'system';
    sidebarCollapsed: boolean;
    defaultDashboardView: 'events' | 'reservations' | 'users';
  }) {
    await updateProfile({
      preferences: values,
    });
    message.success('Preferências salvas');
  }

  return (
    <div className="space-y-4">
      <SettingsTabs />
      <Card>
        <Typography.Title level={3}>Preferências</Typography.Title>
        <Form
          form={form}
          layout="vertical"
          initialValues={user.preferences}
          onFinish={onFinish}
        >
          <Form.Item label="Tema" name="theme">
            <Select
              options={[
                { value: 'system', label: 'System' },
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Menu lateral recolhido"
            name="sidebarCollapsed"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item label="Dashboard padrão" name="defaultDashboardView">
            <Select
              options={[
                { value: 'events', label: 'Eventos' },
                { value: 'reservations', label: 'Reservas' },
                { value: 'users', label: 'Usuários' },
              ]}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Salvar preferências
          </Button>
        </Form>
      </Card>
    </div>
  );
}
