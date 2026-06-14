'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, Dropdown, Layout, Menu, Spin, type MenuProps, Typography } from 'antd';
import { useAuth } from '@/components/auth/auth-provider';
import { canAccess } from '@/lib/permissions';

const { Header, Sider, Content } = Layout;

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function getRoleLabel(role: string) {
  switch (role) {
    case 'super_admin':
      return 'Super admin';
    case 'admin_operacao':
      return 'Admin';
    case 'partner':
      return 'Parceiro';
    default:
      return role;
  }
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const items = useMemo<MenuProps['items']>(() => {
    const baseItems: MenuProps['items'] = [
      { key: '/admin/dashboard', label: <Link href="/admin/dashboard">Dashboard</Link> },
      { key: '/admin/eventos', label: <Link href="/admin/eventos">Eventos</Link> },
      { key: '/admin/reservas', label: <Link href="/admin/reservas">Reservas</Link> },
    ];

    if (user && canAccess(user, 'users:manage')) {
      baseItems.push({
        key: '/admin/settings/users',
        label: <Link href="/admin/settings/users">Parceiros</Link>,
      });
    }

    baseItems.push({
      key: '/admin/settings/preferences',
      label: <Link href="/admin/settings/preferences">Configurações</Link>,
    });

    return baseItems;
  }, [user]);

  const userMenuItems: MenuProps['items'] = [
    { key: '/admin/profile', label: <Link href="/admin/profile">Meu perfil</Link> },
    {
      key: '/admin/settings/preferences',
      label: <Link href="/admin/settings/preferences">Preferências</Link>,
    },
    ...(user && canAccess(user, 'users:manage')
      ? [
          {
            key: '/admin/settings/users',
            label: <Link href="/admin/settings/users">Configurações</Link>,
          },
        ]
      : []),
    { type: 'divider' },
    { key: 'logout', label: 'Sair' },
  ];

  const onUserMenuClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
      await logout();
      router.replace('/login');
    }
  };

  const hasAdminAccess = Boolean(user && canAccess(user, 'admin:access'));

  useEffect(() => {
    if (user && !hasAdminAccess) {
      router.replace('/login');
    }
  }, [hasAdminAccess, router, user]);

  if (!user || !hasAdminAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </main>
    );
  }

  const selectedKey =
    items?.find((item) => pathname.startsWith(String(item?.key)))?.key?.toString() ??
    '/admin/eventos';

  return (
    <Layout className="admin-shell min-h-screen bg-admin-bg text-admin-text">
      <Sider breakpoint="lg" collapsedWidth={0} width={240} className="!bg-admin-sidebar">
        <div className="flex h-16 items-center px-4">
          <Typography.Title level={4} className="!m-0 !text-white">
            Pés do Paraná
          </Typography.Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items}
          className="!bg-admin-sidebar"
        />
      </Sider>

      <Layout>
        <Header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-end border-b border-black/5 bg-admin-surface/95 px-4 py-3 backdrop-blur">
          <Dropdown
            menu={{ items: userMenuItems, onClick: onUserMenuClick }}
            trigger={['click']}
          >
            <button
              type="button"
              title={`${user.name} • ${user.email}`}
              className="flex max-w-[280px] items-center gap-3 rounded-2xl border border-black/5 bg-admin-bg px-3 py-2 text-left transition hover:bg-white"
            >
              <Avatar size={36} src={user.avatarUrl ?? undefined}>
                {getInitials(user.name)}
              </Avatar>
              <span className="hidden min-w-0 flex-1 flex-col leading-tight sm:flex">
                <span className="truncate text-sm font-medium text-admin-text">
                  {user.name}
                </span>
                <span className="truncate text-xs text-admin-muted">
                  {getRoleLabel(user.role)}
                </span>
              </span>
            </button>
          </Dropdown>
        </Header>

        <Content className="p-4 desktop:p-6">{children}</Content>
      </Layout>
    </Layout>
  );
}
