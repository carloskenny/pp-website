import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTripBySlug } from '@/lib/api';
import {
  tripAttractionTypeLabels,
  tripDifficultyLabels,
  tripExperienceTypeLabels,
} from '@/constants/trip-classification';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TripPage({ params }: Props) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip) notFound();

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1033px] bg-background px-5 pb-24 pt-6 desktop:px-10 desktop:pb-12">
      <div className="h-56 rounded-xl2 bg-gradient-to-br from-zinc-600 to-zinc-900 desktop:h-80" />

      <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-primary">
        {tripExperienceTypeLabels[trip.experienceType]}
      </p>
      <h1 className="mt-1 text-4xl font-extrabold text-white desktop:text-5xl">
        {trip.title}
      </h1>
      <p className="mt-2 text-zinc-300">{trip.destination}</p>

      <section className="mt-6 grid grid-cols-1 gap-2 rounded-xl2 bg-zinc-900 p-4 desktop:grid-cols-2 desktop:gap-x-8">
        <p>
          <strong>Data:</strong> {trip.dateLabel}
        </p>
        <p>
          <strong>Experiência:</strong> {tripExperienceTypeLabels[trip.experienceType]}
        </p>
        <p>
          <strong>Dificuldade:</strong> {tripDifficultyLabels[trip.difficulty]}
        </p>
        <p>
          <strong>Duração:</strong> {trip.duration ?? 'A definir'}
        </p>
        <p>
          <strong>Vagas:</strong> {trip.capacity ?? 'A definir'}
        </p>
        <p>
          <strong>Valor:</strong>{' '}
          {trip.price ? `R$ ${trip.price.toFixed(2)}` : 'A definir'}
        </p>
      </section>

      <section className="mt-6 rounded-xl2 bg-zinc-900 p-4">
        <h2 className="text-2xl font-bold desktop:text-3xl">Atrativos</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {trip.interests.map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-zinc-100"
            >
              {tripAttractionTypeLabels[interest] ?? interest}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-xl2 bg-zinc-900 p-4">
        <h2 className="text-2xl font-bold desktop:text-3xl">Sobre a experiência</h2>
        <p className="mt-2 text-zinc-200">
          {trip.summary ?? 'Detalhes serão publicados em breve.'}
        </p>
      </section>

      <Link
        href={`/reserva/${trip.slug}`}
        className="fixed bottom-4 left-1/2 flex h-14 w-[350px] -translate-x-1/2 items-center justify-center rounded-xl bg-primary px-6 text-base font-semibold text-white shadow-card desktop:relative desktop:bottom-auto desktop:left-auto desktop:mt-8 desktop:w-fit desktop:translate-x-0"
      >
        Reservar minha vaga
      </Link>
    </main>
  );
}
