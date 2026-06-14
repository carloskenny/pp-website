import { notFound } from 'next/navigation';
import { getTripBySlug } from '@/lib/api';
import { ReservationForm } from './reservation-form';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ReservaPage({ params }: Props) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip) notFound();

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1033px] bg-background px-5 pb-10 pt-6 desktop:px-10 desktop:pb-14">
      <h1 className="text-3xl font-extrabold text-white desktop:text-5xl">Reserva</h1>
      <p className="mt-1 text-zinc-300">
        {trip.title} • {trip.dateLabel}
      </p>

      <section className="mt-6 rounded-xl2 bg-zinc-900 p-4 desktop:max-w-[720px] desktop:p-6">
        <ReservationForm tripId={trip.id} />
      </section>
    </main>
  );
}
