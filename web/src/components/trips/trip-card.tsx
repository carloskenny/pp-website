import dayjs from 'dayjs';
import Link from 'next/link';
import type { Trip } from '@/types/trip';
import {
  tripAttractionTypeLabels,
  tripDifficultyLabels,
  tripExperienceTypeLabels,
} from '@/constants/trip-classification';

type Props = {
  trip: Trip;
};

function formatTripDate(trip: Trip) {
  if (trip.eventDate) {
    const eventDate = dayjs(trip.eventDate);
    if (eventDate.isValid()) {
      return eventDate.format('DD/MM/YYYY');
    }
  }

  return trip.dateLabel;
}

function formatPrice(price?: number | null) {
  if (typeof price !== 'number') return 'A definir';
  return `R$ ${price.toFixed(2)}`;
}

function formatSpots(trip: Trip) {
  if (typeof trip.availableSpots === 'number' && typeof trip.capacity === 'number') {
    return `${trip.availableSpots} disponíveis de ${trip.capacity}`;
  }

  if (typeof trip.capacity === 'number') {
    return `${trip.capacity} vagas`;
  }

  return 'Vagas a definir';
}

export function TripCard({ trip }: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[28px] bg-zinc-950 shadow-card ring-1 ring-white/10">
      <div
        className="relative h-52 overflow-hidden bg-cover bg-center"
        role="img"
        aria-label={trip.title}
        style={{
          backgroundImage: trip.mainImageUrl
            ? `url(${trip.mainImageUrl})`
            : 'linear-gradient(135deg, rgb(63 63 70), rgb(9 9 11))',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
          <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur">
            {tripExperienceTypeLabels[trip.experienceType] ?? 'Aventura'}
          </span>
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            {trip.status === 'sold_out' ? 'Esgotado' : 'Agenda aberta'}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Próxima aventura
          </p>
          <h3 className="text-2xl font-bold leading-tight text-white">{trip.title}</h3>
          <p className="text-sm text-zinc-300">{trip.destination}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm text-zinc-100">
          <div className="rounded-2xl bg-white/5 p-3">
            <dt className="text-xs uppercase tracking-[0.2em] text-zinc-400">Data</dt>
            <dd className="mt-1 font-semibold">{formatTripDate(trip)}</dd>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <dt className="text-xs uppercase tracking-[0.2em] text-zinc-400">Saída</dt>
            <dd className="mt-1 font-semibold">{trip.departureTime ?? 'A definir'}</dd>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <dt className="text-xs uppercase tracking-[0.2em] text-zinc-400">Preço</dt>
            <dd className="mt-1 font-semibold">{formatPrice(trip.price)}</dd>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <dt className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Experiência
            </dt>
            <dd className="mt-1 font-semibold">
              {tripExperienceTypeLabels[trip.experienceType] ?? 'A definir'}
            </dd>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <dt className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Dificuldade
            </dt>
            <dd className="mt-1 font-semibold">
              {tripDifficultyLabels[trip.difficulty] ?? 'A definir'}
            </dd>
          </div>
          <div className="rounded-2xl bg-white/5 p-3">
            <dt className="text-xs uppercase tracking-[0.2em] text-zinc-400">Vagas</dt>
            <dd className="mt-1 font-semibold">{formatSpots(trip)}</dd>
          </div>
          <div className="col-span-2 rounded-2xl bg-white/5 p-3">
            <dt className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              Atrativos
            </dt>
            <dd className="mt-1 flex flex-wrap gap-2 font-semibold">
              {trip.interests.slice(0, 4).map((interest) => (
                <span
                  key={interest}
                  className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-zinc-100"
                >
                  {tripAttractionTypeLabels[interest] ?? interest}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        <Link
          href={`/trips/${trip.slug}`}
          className="mt-auto flex h-12 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}
