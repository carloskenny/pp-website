'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Result,
  Select,
  Space,
  Spin,
  Table,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '@/components/auth/auth-provider';
import {
  AppUser,
  CreateUserPayload,
  createAdminUser,
  getAdminUsers,
  updateAdminUser,
  updateAdminUserPassword,
  updateAdminUserStatus,
  ApiError,
} from '@/lib/api';
import { SettingsTabs } from '@/components/layout/settings-tabs';
import { canAccess } from '@/lib/permissions';

type FormValues = CreateUserPayload & {
  passwordConfirm?: string;
};

export default function AdminSettingsUsersPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [items, setItems] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [form] = Form.useForm<FormValues>();

  const isSuperAdmin = user?.role === 'super_admin';
  const canManageUsers = canAccess(user, 'users:manage');

  async function loadUsers() {
    setLoading(true);
    try {
      setItems(await getAdminUsers());
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        message.error('Sessão expirada');
      } else {
        message.error('Falha ao carregar usuários');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canManageUsers) {
      void loadUsers();
    }
  }, [canManageUsers]);

  function openCreate() {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  }

  function openEdit(item: AppUser) {
    setEditing(item);
    form.setFieldsValue({
      name: item.name,
      email: item.email,
      role: item.role,
      status: item.status,
      phone: item.phone ?? undefined,
      avatarUrl: item.avatarUrl ?? undefined,
    });
    setOpen(true);
  }

  async function submit(values: FormValues) {
    try {
      if (editing) {
        const { passwordConfirm, ...payload } = values;
        void passwordConfirm;
        await updateAdminUser(editing.id, payload);
        message.success('Usuário atualizado');
      } else {
        if (values.password !== values.passwordConfirm) {
          message.error('As senhas não conferem');
          return;
        }
        const { passwordConfirm, ...payload } = values;
        void passwordConfirm;
        await createAdminUser(payload);
        message.success('Usuário criado');
      }
      setOpen(false);
      await loadUsers();
    } catch {
      message.error('Não foi possível salvar usuário');
    }
  }

  const columns = useMemo<ColumnsType<AppUser>>(
    () => [
      { title: 'Nome', dataIndex: 'name', key: 'name' },
      { title: 'E-mail', dataIndex: 'email', key: 'email' },
      { title: 'Role', dataIndex: 'role', key: 'role' },
      { title: 'Status', dataIndex: 'status', key: 'status' },
      { title: 'Telefone', dataIndex: 'phone', key: 'phone' },
      {
        title: 'Ações',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => openEdit(record)}>
              Editar
            </Button>
            {isSuperAdmin ? (
              <Button
                size="small"
                onClick={async () => {
                  await updateAdminUserStatus(
                    record.id,
                    record.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                  );
                  await loadUsers();
                }}
              >
                {record.status === 'ACTIVE' ? 'Desativar' : 'Ativar'}
              </Button>
            ) : null}
            <Button
              size="small"
              onClick={async () => {
                const newPassword = window.prompt('Nova senha');
                if (!newPassword) return;
                await updateAdminUserPassword(record.id, newPassword);
                message.success('Senha atualizada');
              }}
            >
              Senha
            </Button>
          </Space>
        ),
      },
    ],
    [],
  );

  if (isAuthLoading) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center">
        <Spin size="large" />
      </main>
    );
  }

  if (!canManageUsers) {
    return (
      <div className="space-y-4">
        <SettingsTabs />
        <Result
          status="403"
          title="Acesso negado"
          subTitle="Seu perfil não tem permissão para gerenciar usuários."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SettingsTabs />
      <div className="flex items-center justify-between">
        <Typography.Title level={3}>Usuários</Typography.Title>
        {isSuperAdmin ? (
          <Button type="primary" onClick={openCreate}>
            Novo usuário
          </Button>
        ) : null}
      </div>

      <Table rowKey="id" loading={loading} columns={columns} dataSource={items} />

      <Modal
        open={open}
        title={editing ? 'Editar usuário' : 'Novo usuário'}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={submit}>
          <Form.Item label="Nome" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="E-mail"
            name="email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          {!editing ? (
            <>
              <Form.Item
                label="Senha"
                name="password"
                rules={[{ required: true, min: 8 }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirmar senha"
                name="passwordConfirm"
                rules={[{ required: true, min: 8 }]}
              >
                <Input.Password />
              </Form.Item>
            </>
          ) : null}
          <Form.Item label="Role" name="role">
            <Select
              options={
                isSuperAdmin
                  ? [
                      { value: 'super_admin', label: 'SUPER_ADMIN' },
                      { value: 'admin_operacao', label: 'ADMIN_OPERAÇÃO' },
                      { value: 'guia', label: 'GUIA' },
                      { value: 'atendimento', label: 'ATENDIMENTO' },
                      { value: 'partner', label: 'PARTNER' },
                    ]
                  : [{ value: 'partner', label: 'PARTNER' }]
              }
            />
          </Form.Item>
          {isSuperAdmin ? (
            <Form.Item label="Status" name="status">
              <Select
                options={[
                  { value: 'ACTIVE', label: 'ACTIVE' },
                  { value: 'INACTIVE', label: 'INACTIVE' },
                  { value: 'BLOCKED', label: 'BLOCKED' },
                ]}
              />
            </Form.Item>
          ) : null}
          <Form.Item label="Telefone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Avatar URL" name="avatarUrl">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
