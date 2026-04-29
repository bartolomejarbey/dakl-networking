import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'

export default function NotFound() {
  return (
    <>
      <Navbar solid />
      <main>
        <section className="bg-cream text-ink pt-40 pb-32 min-h-[80vh] flex items-center">
          <Container>
            <div className="max-w-[820px] mx-auto text-center">
              <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-10">
                §&nbsp;404 — Strana neexistuje
              </p>

              <h1
                className="font-serif italic text-ink leading-[0.96] tracking-[-0.022em] text-[clamp(48px,8vw,128px)] mb-2"
                style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
              >
                Tahle stránka
                <span className="block">v archivu chybí<span className="inline-block animate-pulse-dot text-orange">.</span></span>
              </h1>

              <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-ink-soft/55 mb-14 tabular-nums">
                Nebo byla stažena z oběhu · Případně překlep v adrese
              </p>

              <div className="hairline mx-auto max-w-[200px] mb-14 bg-ink/15" />

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Link
                  href="/"
                  className="group inline-flex items-center justify-center gap-3 bg-orange hover:bg-orange-dark text-cream font-mono text-[11px] tracking-[0.22em] uppercase font-semibold px-7 py-4 rounded-[1px] border-2 border-orange transition-colors duration-300"
                >
                  Zpět na obálku
                  <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden>
                    &rarr;
                  </span>
                </Link>
                <Link
                  href="/akce"
                  className="group inline-flex items-center justify-center gap-3 border-2 border-ink/30 hover:border-ink text-ink font-mono text-[11px] tracking-[0.22em] uppercase font-semibold px-7 py-4 rounded-[1px] transition-colors duration-300"
                >
                  Otevřít archiv
                  <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden>
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
