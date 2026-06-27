'use client';

import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Empty, Spin } from 'antd';
import { ApiError, getTrips } from '@/lib/api';
import { TripCard } from '@/components/trips/trip-card';
import type { Trip } from '@/types/trip';

function getFriendlyError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status >= 500) {
      return 'Não foi possível carregar a agenda agora. Tente novamente em instantes.';
    }

    return error.message || 'Não foi possível carregar a agenda.';
  }

  return 'Não foi possível carregar a agenda.';
}

export function TripsAgendaSection() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrips = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setTrips(await getTrips());
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTrips();
  }, [loadTrips]);

  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
          Agenda pública
        </p>
        <h2 className="text-[32px] font-bold leading-tight text-white desktop:text-[42px]">
          Escolha sua próxima experiência
        </h2>
        <p className="max-w-xl text-sm leading-6 text-zinc-300 desktop:text-base">
          A agenda abaixo mostra apenas eventos publicados no painel administrativo.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center rounded-[28px] border border-white/10 bg-white/5">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert
          type="error"
          showIcon
          className="rounded-[24px]"
          message="Falha ao carregar a agenda"
          description={
            <div className="space-y-4">
              <p>{error}</p>
              <Button onClick={() => void loadTrips()}>Tentar novamente</Button>
            </div>
          }
        />
      ) : trips.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-white/15 bg-white/5 px-4 py-10">
          <Empty
            description={
              <span className="text-zinc-300">
                Nenhum evento publicado no momento. Volte em breve ou fale com a equipe no
                WhatsApp.
              </span>
            }
          >
            <Button
              type="primary"
              href="https://wa.me/5541987751341?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20as%20trips%20do%20P%C3%A9s%20do%20Paran%C3%A1."
            >
              Falar no WhatsApp
            </Button>
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 desktop:grid-cols-3 desktop:gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
