'use client';

import Link from 'next/link';
import { Tabs } from 'antd';
import { usePathname } from 'next/navigation';

const items = [
  {
    key: '/admin/settings/users',
    label: <Link href="/admin/settings/users">Usuários</Link>,
  },
  {
    key: '/admin/settings/profile',
    label: <Link href="/admin/settings/profile">Perfil</Link>,
  },
  {
    key: '/admin/settings/preferences',
    label: <Link href="/admin/settings/preferences">Preferências</Link>,
  },
];

export function SettingsTabs() {
  const pathname = usePathname();
  const activeKey =
    items.find((item) => pathname.startsWith(item.key))?.key ?? items[0].key;

  return <Tabs activeKey={activeKey} items={items} className="mb-4" />;
}
