import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { EventList } from '@/components/event/EventList'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { Marquee } from '@/components/ui/Marquee'
import { listPublicEvents } from '@/lib/events/queries'

export const revalidate = 60

const tickerItems = [
  '47 akcí od 2023',
  '6 850+ hostů',
  '94% průměrná obsazenost',
  'Praha · Vltava · Náplavka',
  'Ročník IV · Vydání 04',
]

export default async function AkcePage() {
  const events = await listPublicEvents()
  const upcoming = events.find((e) => e.status === 'published' || e.status === 'draft')

  return (
    <>
      <Navbar ctaHref="/#odber" ctaLabel="Odebírat" />
      <main>
        <section className="relative bg-forest-deep text-cream pt-32 lg:pt-40 pb-20 lg:pb-28 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 65% 55% at 25% 30%, rgba(30, 139, 133, 0.16), transparent 60%)',
            }}
          />
          <GrainOverlay opacity={0.04} />

          <Container className="relative z-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-12 lg:mb-16">
              <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
                §&nbsp;Index — Vydání
              </p>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55">
                Pražský čtvrtletník · Ročník IV · 2026
              </p>
            </div>

            <h1
              className="font-serif text-cream leading-[0.98] tracking-[-0.022em] text-[clamp(48px,9vw,160px)] mb-12"
              style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
            >
              {upcoming?.status === 'published' ? (
                <>
                  Nadcházející
                  <span className="block italic text-cream/85 pl-[0.4em]">vydání.</span>
                </>
              ) : (
                <>
                  Mezi vydáními.
                  <span className="block italic text-cream/85 pl-[0.4em]">Posádka přebírá.</span>
                </>
              )}
            </h1>

            <p className="font-serif italic text-[clamp(20px,2.4vw,28px)] leading-[1.4] text-cream/75 max-w-[640px]">
              {upcoming?.status === 'published'
                ? 'Detail vydání níž.'
                : 'Příští akce se připravuje. Datum oznámíme přihlášeným odběratelům jako prvním. Mezitím můžeš procházet archiv všech vydání.'}
            </p>

            <Link
              href="/#odber"
              className="group mt-10 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase text-cream border-b border-orange pb-1 hover:text-orange transition-colors"
            >
              Přihlásit se k odběru
              <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1.5" aria-hidden>
                &rarr;
              </span>
            </Link>
          </Container>
        </section>

        <div className="border-y border-ink/15 bg-cream py-4">
          <Marquee speed="slow" copies={3} separator={<span aria-hidden>·</span>}>
            {tickerItems.map((item, i) => (
              <span
                key={i}
                className="px-7 font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </Marquee>
        </div>

        <section className="bg-cream text-ink py-20 lg:py-28">
          <Container>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-12">
              <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
                §&nbsp;Archiv vydání
              </p>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/60 tabular-nums">
                Celkem {events.length} záznamů
              </p>
            </div>

            <h2
              className="font-serif text-ink leading-[1] tracking-[-0.02em] text-[clamp(36px,5vw,72px)] mb-14 lg:mb-16"
              style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
            >
              Co bylo. Co bude.
              <span className="block italic text-ink-soft pl-[0.4em]">Co stojí v archivu.</span>
            </h2>

            <EventList events={events} />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
