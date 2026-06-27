'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Result, Spin, Typography, message } from 'antd';
import { ApiError, getAdminTrip } from '@/lib/api';
import { TripAdminForm } from '@/components/forms/trip-admin-form';
import type { Trip } from '@/types/trip';

export default function EditarEventoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadTrip() {
      try {
        setTrip(await getAdminTrip(params.id));
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          router.replace('/login');
          return;
        }

        if (error instanceof ApiError && error.status === 404) {
          setNotFound(true);
          return;
        }

        message.error('Falha ao carregar evento');
      } finally {
        setLoading(false);
      }
    }

    void loadTrip();
  }, [params.id, router]);

  if (loading) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center">
        <Spin size="large" />
      </main>
    );
  }

  if (notFound || !trip) {
    return <Result status="404" title="Evento não encontrado" />;
  }

  return (
    <div className="space-y-4">
      <Typography.Title level={3} style={{ margin: 0 }}>
        Editar evento
      </Typography.Title>
      <TripAdminForm mode="edit" initialTrip={trip} />
    </div>
  );
}
