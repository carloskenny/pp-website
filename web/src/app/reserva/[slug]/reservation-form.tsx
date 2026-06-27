'use client';

import {
  Alert,
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { createReservation } from '@/lib/api';
import type { BoardingPoint } from '@/types/trip';

type Props = {
  tripId: string;
  boardingPoints: BoardingPoint[];
};

type FormValues = {
  fullName: string;
  email: string;
  whatsapp: string;
  cpf?: string;
  birthDate?: dayjs.Dayjs;
  boardingPointId?: string;
  notes?: string;
  termsAccepted: boolean;
};

export function ReservationForm({ tripId, boardingPoints }: Props) {
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
        boardingPointId: values.boardingPointId || undefined,
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

      <Form.Item label="E-mail" name="email" rules={[{ required: true, type: 'email' }]}>
        <Input size="large" />
      </Form.Item>

      <Form.Item label="CPF (opcional)" name="cpf">
        <Input size="large" />
      </Form.Item>

      <Form.Item label="Data de nascimento (opcional)" name="birthDate">
        <DatePicker size="large" className="w-full" format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item
        label="Ponto de embarque"
        name="boardingPointId"
        rules={
          boardingPoints.length
            ? [{ required: true, message: 'Selecione o embarque' }]
            : []
        }
      >
        <Select
          size="large"
          disabled={!boardingPoints.length}
          placeholder={
            boardingPoints.length
              ? 'Selecione seu ponto de embarque'
              : 'Embarque será definido pela equipe'
          }
          options={boardingPoints.map((boardingPoint) => ({
            value: boardingPoint.id,
            label: boardingPoint.label,
          }))}
        />
      </Form.Item>

      <Form.Item label="Observações" name="notes">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="termsAccepted"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value: boolean) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error('Aceite os termos para continuar')),
          },
        ]}
      >
        <Checkbox>
          <Typography.Text className="text-zinc-300">
            Concordo com os termos e autorizo contato da equipe para confirmação manual.
          </Typography.Text>
        </Checkbox>
      </Form.Item>

      <Button block size="large" type="primary" htmlType="submit" loading={loading}>
        Enviar reserva
      </Button>
    </Form>
  );
}
