'use client';

import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './auth-provider';

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </main>
    );
  }

  return <>{children}</>;
}
