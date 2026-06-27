'use client';

import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/pt-br';
import { AuthProvider } from '@/components/auth/auth-provider';

dayjs.extend(localeData);
dayjs.locale('pt-br');

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider locale={ptBR}>
      <AuthProvider>{children}</AuthProvider>
    </ConfigProvider>
  );
}
