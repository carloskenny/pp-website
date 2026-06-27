'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Result, Select, Space, Spin, Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '@/components/auth/auth-provider';
import {
  ApiError,
  getReservations,
  type ReservationItem,
  updateReservationStatus,
} from '@/lib/api';
import { canAccess } from '@/lib/permissions';

export default function AdminReservasPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [items, setItems] = useState<ReservationItem[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const canManageReservations = canAccess(user, 'reservations:manage');

  async function loadReservations() {
    setLoading(true);
    try {
      setItems(await getReservations(selectedTripId));
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.replace('/login');
        return;
      }
      if (error instanceof ApiError && error.status === 403) {
        message.error('Você não tem permissão para acessar reservas');
        return;
      }
      message.error('Falha ao carregar reservas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canManageReservations) {
      void loadReservations();
    }
  }, [canManageReservations, selectedTripId]);

  async function onChangeStatus(id: string, status: ReservationItem['status']) {
    try {
      await updateReservationStatus(id, status);
      message.success('Status atualizado');
      await loadReservations();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.replace('/login');
        return;
      }
      if (error instanceof ApiError && error.status === 403) {
        message.error('Você não tem permissão para alterar reservas');
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

  const tripOptions = useMemo(() => {
    const tripsById = new Map<string, NonNullable<ReservationItem['trip']>>();

    for (const item of items) {
      if (item.trip) {
        tripsById.set(item.trip.id, item.trip);
      }
    }

    return Array.from(tripsById.values()).map((trip) => ({
      value: trip.id,
      label: `${trip.title} • ${trip.dateLabel}`,
    }));
  }, [items]);

  if (isAuthLoading) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center">
        <Spin size="large" />
      </main>
    );
  }

  if (!canManageReservations) {
    return (
      <Result
        status="403"
        title="Acesso negado"
        subTitle="Seu perfil não tem permissão para acessar reservas."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:justify-between">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Admin • Reservas
        </Typography.Title>
        <Select
          allowClear
          className="w-full desktop:w-[360px]"
          placeholder="Filtrar participantes por evento"
          value={selectedTripId}
          onChange={(value) => setSelectedTripId(value)}
          options={tripOptions}
        />
      </div>
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
