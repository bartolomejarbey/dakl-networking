import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'

export function OrganizerSection() {
  return (
    <section className="relative bg-teal py-32 lg:py-40 overflow-hidden">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #F5EFE2 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">
          {/* Left — Portrait (col 1-5) */}
          <div className="lg:col-span-5 relative">
            <div className="relative lg:-mt-[180px] overflow-hidden aspect-[4/5] max-h-[500px] lg:max-h-none">
              {/* Tag */}
              <span className="absolute top-4 left-4 z-10 font-mono text-[10px] tracking-[0.14em] uppercase text-cream/70 bg-ink/40 px-2 py-1 rounded-[2px]">
                PTRT &middot; 4:5 &middot; B&W
              </span>
              <Image
                src="/images/david.jpg"
                alt="David — organizer of Conventus"
                fill
                className="object-cover grayscale contrast-[1.05]"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          </div>

          {/* Spacer col 6 */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Right — Bio (col 7-12) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Label */}
            <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-orange mb-6">
              — 07 / Kdo to organizuje
            </span>

            {/* Heading */}
            <h2
              className="font-serif text-cream leading-[0.98] mb-10 text-[clamp(44px,5.6vw,80px)]"
            >
              <span className="block">David.</span>
              <span className="block text-cream/55 pl-[0.5em]">
                Porada Conventus od 2023.
              </span>
            </h2>

            {/* Bio */}
            <p className="text-[18px] leading-[1.55] text-cream/[0.82] max-w-[560px] mb-8">
              47 akci za 3 roky. 6 850 ucastniku. Provozuju i Bonum Negotium,
              jednu z nejrychleji rostoucich firem na benefity v CR. Ty dve veci
              se potkavaji — na Conventu obcas posilam klienty. Pokud delas
              neco, co me zaujme.
            </p>

            {/* Latin meaning */}
            <span className="block font-mono text-[12px] text-cream/50 mb-8">
              Conventus &middot; z latiny: setkani, shromazdeni.
            </span>

            {/* Link */}
            <Link
              href="/pribeh"
              className="inline-block font-mono text-[13px] uppercase tracking-[0.08em] text-cream border-b border-cream pb-1 hover:text-cream/80 hover:border-cream/80 transition-colors"
            >
              Cely pribeh &rarr;
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
