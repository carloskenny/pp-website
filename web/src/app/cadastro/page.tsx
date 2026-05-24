'use client';

import Link from 'next/link';
import { Alert, Button, Form, Input, Select, Typography, message } from 'antd';
import { useState } from 'react';
import { register } from '@/lib/api';

type FormValues = {
  name: string;
  email: string;
  password: string;
  role?: 'admin_operacao' | 'guia' | 'atendimento';
};

export default function CadastroPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFinish(values: FormValues) {
    setLoading(true);
    setError(null);
    try {
      await register(values);
      message.success('Conta criada com sucesso');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no cadastro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1033px] bg-background px-5 pb-10 pt-8 desktop:px-10">
      <section className="mx-auto w-full max-w-[520px] rounded-xl2 bg-zinc-900 p-5 desktop:p-6">
        <Typography.Title level={3} style={{ color: 'white', marginTop: 0 }}>
          Cadastro
        </Typography.Title>

        {error ? (
          <Alert type="error" showIcon message="Erro" description={error} />
        ) : null}

        <Form layout="vertical" onFinish={onFinish} className="mt-4">
          <Form.Item
            label={<span className="text-zinc-200">Nome</span>}
            name="name"
            rules={[{ required: true, min: 3 }]}
          >
            <Input size="large" />
          </Form.Item>

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

          <Form.Item
            label={<span className="text-zinc-200">Perfil</span>}
            name="role"
            initialValue="admin_operacao"
          >
            <Select
              options={[
                { value: 'admin_operacao', label: 'Admin operação' },
                { value: 'guia', label: 'Guia' },
                { value: 'atendimento', label: 'Atendimento' },
              ]}
            />
          </Form.Item>

          <Button block type="primary" size="large" htmlType="submit" loading={loading}>
            Criar conta
          </Button>
        </Form>

        <p className="mt-4 text-sm text-zinc-300">
          Já tem conta?{' '}
          <Link href="/login" className="text-primary">
            Fazer login
          </Link>
        </p>
      </section>
    </main>
  );
}
