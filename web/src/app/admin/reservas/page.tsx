'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select, Space, Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ApiError,
  getReservations,
  type ReservationItem,
  updateReservationStatus,
} from '@/lib/api';

export default function AdminReservasPage() {
  const router = useRouter();
  const [items, setItems] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadReservations() {
    setLoading(true);
    try {
      setItems(await getReservations());
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        localStorage.removeItem('pp_access_token');
        router.replace('/login');
        return;
      }
      message.error('Falha ao carregar reservas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReservations();
  }, []);

  async function onChangeStatus(id: string, status: ReservationItem['status']) {
    try {
      await updateReservationStatus(id, status);
      message.success('Status atualizado');
      await loadReservations();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        localStorage.removeItem('pp_access_token');
        router.replace('/login');
        return;
      }
      message.error('Não foi possível atualizar o status');
    }
  }

  const columns = useMemo<ColumnsType<ReservationItem>>(
    () => [
      { title: 'Nome', dataIndex: 'fullName', key: 'fullName' },
      { title: 'E-mail', dataIndex: 'email', key: 'email' },
      { title: 'WhatsApp', dataIndex: 'whatsapp', key: 'whatsapp' },
      {
        title: 'Trip',
        key: 'trip',
        render: (_, record) => (
          <Space direction="vertical" size={0}>
            <span>{record.trip?.title ?? '—'}</span>
            <span className="text-xs text-zinc-400">{record.trip?.dateLabel ?? '—'}</span>
          </Space>
        ),
      },
      {
        title: 'Embarque',
        key: 'boardingPoint',
        render: (_, record) => record.boardingPoint?.label ?? '—',
      },
      {
        title: 'Status',
        key: 'status',
        render: (_, record) => (
          <Space>
            <Select
              value={record.status}
              style={{ minWidth: 170 }}
              onChange={(value) => void onChangeStatus(idOrThrow(record.id), value)}
              options={[
                { value: 'pending', label: 'pending' },
                { value: 'payment_pending', label: 'payment_pending' },
                { value: 'confirmed', label: 'confirmed' },
                { value: 'canceled', label: 'canceled' },
              ]}
            />
          </Space>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <Typography.Title level={3}>Admin • Reservas</Typography.Title>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={items}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 900 }}
      />
    </div>
  );
}

function idOrThrow(id: string | undefined): string {
  if (!id) throw new Error('Reservation id missing');
  return id;
}
