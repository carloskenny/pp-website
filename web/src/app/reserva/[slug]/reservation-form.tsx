'use client';

import { Alert, Button, DatePicker, Form, Input, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { createReservation } from '@/lib/api';

type Props = {
  tripId: string;
};

type FormValues = {
  fullName: string;
  email: string;
  whatsapp: string;
  cpf?: string;
  birthDate?: dayjs.Dayjs;
  notes?: string;
};

export function ReservationForm({ tripId }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFinish(values: FormValues) {
    setLoading(true);
    setError(null);

    try {
      await createReservation({
        tripId,
        fullName: values.fullName,
        email: values.email,
        whatsapp: values.whatsapp,
        cpf: values.cpf || undefined,
        birthDate: values.birthDate?.toISOString(),
        notes: values.notes || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao enviar reserva');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Alert
        type="success"
        showIcon
        message="Pré-reserva recebida"
        description="Seu pedido foi enviado. A confirmação será manual após o pagamento."
      />
    );
  }

  return (
    <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
      {error ? (
        <Alert type="error" showIcon message="Erro no envio" description={error} />
      ) : null}

      <Form.Item label="Nome completo" name="fullName" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>

      <Form.Item label="WhatsApp" name="whatsapp" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>

      <Form.Item
        label="E-mail"
        name="email"
        rules={[{ required: true, type: 'email' }]}
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item label="CPF (opcional)" name="cpf">
        <Input size="large" />
      </Form.Item>

      <Form.Item label="Data de nascimento (opcional)" name="birthDate">
        <DatePicker size="large" className="w-full" format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item label="Observações" name="notes">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Typography.Paragraph className="text-zinc-300">
        Ao enviar, você concorda com os termos e com contato da equipe para
        confirmação manual.
      </Typography.Paragraph>

      <Button
        block
        size="large"
        type="primary"
        htmlType="submit"
        loading={loading}
      >
        Enviar reserva
      </Button>
    </Form>
  );
}
