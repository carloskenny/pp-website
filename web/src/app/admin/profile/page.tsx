'use client';

import { Button, Card, Form, Input, Select, Space, Typography, message } from 'antd';
import { useMemo } from 'react';
import { useAuth } from '@/components/auth/auth-provider';

export default function AdminProfilePage() {
  const { user, updateProfile, updatePassword } = useAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const initials = useMemo(
    () =>
      user?.name
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') ?? '',
    [user?.name],
  );

  if (!user) {
    return null;
  }

  async function onSaveProfile(values: {
    name?: string;
    phone?: string | null;
    avatarUrl?: string | null;
    theme?: 'light' | 'dark' | 'system';
  }) {
    await updateProfile({
      name: values.name,
      phone: values.phone ?? null,
      avatarUrl: values.avatarUrl ?? null,
      preferences: values.theme
        ? {
            theme: values.theme,
          }
        : undefined,
    });
    message.success('Perfil atualizado');
  }

  async function onChangePassword(values: { password: string }) {
    await updatePassword({ password: values.password });
    passwordForm.resetFields();
    message.success('Senha atualizada');
  }

  return (
    <div className="space-y-4">
      <Typography.Title level={3}>Meu perfil</Typography.Title>
      <Space align="start" size={16} className="w-full flex-col desktop:flex-row">
        <Card className="w-full desktop:w-[320px]">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
              {initials}
            </div>
            <div>
              <div className="text-lg font-semibold">{user.name}</div>
              <div className="text-sm text-zinc-500">{user.email}</div>
              <div className="text-sm text-zinc-500">
                {user.role} • {user.status}
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex-1">
          <Form
            form={profileForm}
            layout="vertical"
            initialValues={{
              name: user.name,
              phone: user.phone ?? undefined,
              avatarUrl: user.avatarUrl ?? undefined,
              theme: user.preferences.theme,
            }}
            onFinish={onSaveProfile}
          >
            <Form.Item label="Nome" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="E-mail">
              <Input value={user.email} disabled />
            </Form.Item>
            <Form.Item label="Telefone" name="phone">
              <Input />
            </Form.Item>
            <Form.Item label="Avatar URL" name="avatarUrl">
              <Input />
            </Form.Item>
            <Form.Item label="Tema" name="theme">
              <Select
                options={[
                  { value: 'system', label: 'System' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Salvar perfil
            </Button>
          </Form>
        </Card>
      </Space>

      <Card>
        <Typography.Title level={4}>Alterar senha</Typography.Title>
        <Form form={passwordForm} layout="vertical" onFinish={onChangePassword}>
          <Form.Item
            label="Nova senha"
            name="password"
            rules={[{ required: true, min: 8 }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Atualizar senha
          </Button>
        </Form>
      </Card>
    </div>
  );
}
