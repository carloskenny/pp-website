import type { Metadata } from 'next';
import '@ant-design/v5-patch-for-react-19';
import 'antd/dist/reset.css';
import './globals.css';
import { AppProviders } from './providers';

export const metadata: Metadata = {
  title: 'Pés do Paraná Trips',
  description: 'Trips e experiências de aventura',
  icons: {
    icon: '/images/logo/logo-with-bg.svg',
    shortcut: '/images/logo/logo-with-bg.svg',
    apple: '/images/logo/logo-with-bg.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
