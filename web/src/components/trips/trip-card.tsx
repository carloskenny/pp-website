import Link from 'next/link';
import type { Trip } from '@/types/trip';

type Props = {
  trip: Trip;
};

export function TripCard({ trip }: Props) {
  return (
    <article className="mx-auto w-full max-w-80 overflow-hidden rounded-xl2 bg-zinc-900 shadow-card desktop:max-w-none">
      <div className="h-52 bg-gradient-to-br from-zinc-600 to-zinc-800" />
      <div className="space-y-3 p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {trip.type ?? 'Aventura'}
        </p>
        <h3 className="text-2xl font-bold">{trip.title}</h3>
        <p className="text-sm text-muted">{trip.destination}</p>
        <p className="text-sm text-zinc-200">{trip.summary}</p>
        <div className="space-y-1 text-sm text-zinc-100">
          <p>
            <strong>Data:</strong> {trip.dateLabel}
          </p>
          <p>
            <strong>Valor:</strong> R$ {trip.price}
          </p>
        </div>
        <Link
          href={`/trips/${trip.slug}`}
          className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}
