'use client';

import { Alert, Button, Form, Input, Typography } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';

type FormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFinish(values: FormValues) {
    setLoading(true);
    setError(null);
    try {
      await login(values);
      const nextPath = searchParams.get('next');
      const redirectTo =
        nextPath && nextPath.startsWith('/admin') ? nextPath : '/admin/dashboard';
      router.replace(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1033px] bg-background px-5 pb-10 pt-8 desktop:px-10">
      <section className="mx-auto w-full max-w-[520px] rounded-xl2 bg-zinc-900 p-5 desktop:p-6">
        <Typography.Title level={3} style={{ color: 'white', marginTop: 0 }}>
          Login
        </Typography.Title>

        {error ? (
          <Alert type="error" showIcon message="Erro" description={error} />
        ) : null}

        <Form layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item
            label={<span className="text-zinc-200">E-mail</span>}
            name="email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="text-zinc-200">Senha</span>}
            name="password"
            rules={[{ required: true, min: 8 }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Button block type="primary" size="large" htmlType="submit" loading={loading}>
            Entrar
          </Button>
        </Form>

        <p className="mt-4 text-sm text-zinc-300">
          Acesso restrito à equipe e parceiros autorizados.
        </p>
      </section>
    </main>
  );
}
