import Image from 'next/image';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { TripCard } from '@/components/trips/trip-card';
import { trips } from '@/lib/data/trips';

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1033px] bg-background">
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-4 py-3 desktop:h-[72px] desktop:px-10 desktop:py-0">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo/logo-white.svg"
              alt="Logo Pés do Paraná"
              width={34}
              height={48}
              className="h-10 w-auto"
              priority
            />
            <Image
              src="/images/logo/tipografia-2.svg"
              alt="Pés do Paraná"
              width={128}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </div>
          <MobileMenu />
        </header>

        <section
          className="relative flex flex-1 flex-col justify-end overflow-hidden bg-cover bg-center px-5 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-0 desktop:px-10 desktop:pb-12"
          style={{ backgroundImage: "url('/images/bkg/bg-01.jpeg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
          <div className="relative z-10 flex flex-col gap-3">
            <h1 className="max-w-[720px] text-4xl font-extrabold leading-tight text-white desktop:text-5xl">
              Viva sua próxima aventura...
            </h1>
            <p className="max-w-[620px] text-base text-zinc-200 desktop:text-lg">
              Trips com organização completa, guias experientes e experiências
              inesquecíveis.
            </p>
            <a
              href="#eventos"
              className="mt-2 flex h-14 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-white desktop:max-w-[320px]"
            >
              Ver próximas aventuras
            </a>
          </div>
        </section>
      </div>

      <section id="eventos" className="px-5 pb-10 pt-2 desktop:px-10 desktop:pb-14">
        <h2 className="py-2 text-[32px] font-bold leading-tight text-white desktop:text-[42px]">
          Escolha sua próxima experiência
        </h2>
        <div className="grid grid-cols-1 gap-4 py-2 desktop:grid-cols-3 desktop:gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>

      <section className="px-4 pb-4 pt-6 text-center desktop:px-10 desktop:pb-10">
        <h2 className="text-[32px] font-bold leading-tight text-white desktop:text-[42px]">
          Pronto pra viver essa experiência?
        </h2>
        <p className="mt-4 text-xl text-zinc-200 desktop:text-2xl">
          Garanta sua vaga antes que acabe
        </p>
        <a
          href="https://wa.me/5541987751341?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20as%20trips%20do%20P%C3%A9s%20do%20Paran%C3%A1."
          className="mx-auto mt-4 flex h-16 w-[277px] items-center justify-center rounded-xl bg-primary text-lg font-semibold text-white desktop:w-[340px]"
        >
          Falar no WhatsApp
        </a>
      </section>
    </main>
  );
}
