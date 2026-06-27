'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Popconfirm,
  Result,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '@/components/auth/auth-provider';
import { ApiError, deleteTrip, getAdminTrips, updateTrip } from '@/lib/api';
import { canAccess } from '@/lib/permissions';
import type { Trip, TripStatus } from '@/types/trip';

const statusLabels: Record<TripStatus, string> = {
  draft: 'Rascunho',
  active: 'Publicado',
  sold_out: 'Esgotado',
  finished: 'Encerrado',
  inactive: 'Inativo',
  canceled: 'Cancelado',
};

const statusColors: Record<TripStatus, string> = {
  draft: 'default',
  active: 'green',
  sold_out: 'orange',
  finished: 'blue',
  inactive: 'default',
  canceled: 'red',
};

export default function AdminEventosPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [items, setItems] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const canManageEvents = canAccess(user, 'events:manage');

  const loadTrips = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await getAdminTrips());
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.replace('/login');
        return;
      }
      if (error instanceof ApiError && error.status === 403) {
        message.error('Você não tem permissão para gerenciar eventos');
        return;
      }
      message.error('Falha ao carregar eventos');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (canManageEvents) {
      void loadTrips();
    }
  }, [canManageEvents, loadTrips]);

  async function togglePublication(item: Trip) {
    const nextStatus: TripStatus = item.status === 'active' ? 'draft' : 'active';

    try {
      await updateTrip(item.id, { status: nextStatus });
      message.success(
        nextStatus === 'active' ? 'Evento publicado' : 'Evento despublicado',
      );
      await loadTrips();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.replace('/login');
        return;
      }
      if (error instanceof ApiError && error.status === 403) {
        message.error('Você não tem permissão para alterar eventos');
        return;
      }
      message.error('Não foi possível alterar o status');
    }
  }

  async function remove(id: string) {
    try {
      await deleteTrip(id);
      message.success('Evento removido');
      await loadTrips();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.replace('/login');
        return;
      }
      if (error instanceof ApiError && error.status === 403) {
        message.error('Você não tem permissão para remover eventos');
        return;
      }
      message.error('Não foi possível remover o evento');
    }
  }

  const columns = useMemo<ColumnsType<Trip>>(
    () => [
      { title: 'Título', dataIndex: 'title', key: 'title' },
      { title: 'Data', dataIndex: 'dateLabel', key: 'dateLabel' },
      { title: 'Saída', dataIndex: 'departureTime', key: 'departureTime' },
      { title: 'Destino', dataIndex: 'destination', key: 'destination' },
      {
        title: 'Preço',
        key: 'price',
        render: (_, record) =>
          typeof record.price === 'number' ? `R$ ${record.price.toFixed(2)}` : '—',
      },
      { title: 'Vagas', dataIndex: 'capacity', key: 'capacity' },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: TripStatus) => (
          <Tag color={statusColors[status]}>{statusLabels[status] ?? status}</Tag>
        ),
      },
      {
        title: 'Ações',
        key: 'actions',
        render: (_, record) => (
          <Space wrap>
            <Button size="small" href={`/admin/eventos/${record.id}/editar`}>
              Editar
            </Button>
            <Button size="small" onClick={() => void togglePublication(record)}>
              {record.status === 'active' ? 'Despublicar' : 'Publicar'}
            </Button>
            <Popconfirm
              title="Remover evento?"
              onConfirm={() => remove(record.id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button size="small" danger>
                Remover
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [],
  );

  if (isAuthLoading) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center">
        <Spin size="large" />
      </main>
    );
  }

  if (!canManageEvents) {
    return (
      <Result
        status="403"
        title="Acesso negado"
        subTitle="Seu perfil não tem permissão para gerenciar eventos."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:justify-between">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Admin • Eventos
        </Typography.Title>
        <Link href="/admin/eventos/novo">
          <Button type="primary">Novo evento</Button>
        </Link>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={items}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 1100 }}
      />
    </div>
  );
}
