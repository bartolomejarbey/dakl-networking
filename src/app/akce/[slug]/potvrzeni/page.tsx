import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'

interface PageProps {
  params: { slug: string }
  searchParams: { order?: string }
}

function nowStamp(): string {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yy = String(now.getFullYear()).slice(2)
  const hh = String(now.getHours()).padStart(2, '0')
  const mi = String(now.getMinutes()).padStart(2, '0')
  return `${dd}.${mm}.${yy} · ${hh}:${mi}`
}

export default function PotvrzeniPage({ params, searchParams }: PageProps) {
  if (params.slug !== 'kayak-beach-bar') {
    notFound()
  }

  const orderNumber = searchParams.order || 'CN-2026-XXXX'

  const checklist = [
    'Do 15 minut dorazí e-mail s fakturou',
    'Den před akcí ti pošleme připomínku',
    'Když se nemůžeš dostavit, dej vědět 48 h předem',
  ]

  return (
    <>
      <Navbar solid />
      <main>
        <section className="relative bg-cream text-ink pt-32 lg:pt-40 pb-32 grain grain-light">
          <Container>
            {/* Folio header */}
            <div className="max-w-[720px] mx-auto mb-12">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
                  §&nbsp;Potvrzení přihlášky
                </p>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 tabular-nums">
                  {nowStamp()}
                </p>
              </div>
            </div>

            {/* Receipt card */}
            <div className="max-w-[720px] mx-auto">
              <div aria-hidden className="perforation-top h-1 w-full" />
              <article className="bg-cream border-x border-b border-ink/15 shadow-print">
                {/* Receipt head */}
                <header className="px-8 lg:px-12 pt-12 pb-10 border-b border-ink/15 text-center">
                  <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-ink-soft/55 mb-7">
                    DaKl Networking · Vydání 04
                  </p>
                  <h1
                    className="font-serif italic text-ink leading-[0.96] tracking-[-0.022em] text-[clamp(40px,6vw,80px)] mb-5"
                    style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
                  >
                    Hotovo.
                    <span className="block text-ink-soft/85">Vidíme se na akci.</span>
                  </h1>
                  <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-orange tabular-nums">
                    Objednávka · {orderNumber}
                  </p>
                </header>

                {/* Receipt body */}
                <div className="px-8 lg:px-12 py-10 grid grid-cols-1 sm:grid-cols-2 gap-y-7 gap-x-10 border-b border-ink/15">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 mb-2">
                      Akce
                    </p>
                    <p className="font-serif italic text-[20px] lg:text-[22px] leading-[1.2] text-ink">
                      Neřízený networking na lodi
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 mb-2">
                      Datum
                    </p>
                    <p className="font-serif italic text-[20px] lg:text-[22px] leading-[1.2] text-ink">
                      pátek 24. dubna 2026
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 mb-2">
                      Čas
                    </p>
                    <p className="font-mono text-[18px] tabular-nums text-ink">
                      15:00–23:30
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 mb-2">
                      Místo
                    </p>
                    <p className="font-serif italic text-[20px] lg:text-[22px] leading-[1.2] text-ink">
                      Kayak Beach Bar · Náplavka
                    </p>
                  </div>
                </div>

                {/* Checklist */}
                <div className="px-8 lg:px-12 py-10">
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-orange mb-7">
                    §&nbsp;Co bude dál
                  </p>
                  <ol className="space-y-5">
                    {checklist.map((item, i) => (
                      <li key={i} className="flex items-baseline gap-5">
                        <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft/45 shrink-0 tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="font-serif text-[18px] lg:text-[20px] leading-[1.45] text-ink">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Footer signature */}
                <footer className="px-8 lg:px-12 py-7 border-t border-ink/15 bg-ink/[0.02] flex flex-col sm:flex-row items-baseline justify-between gap-3">
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55">
                    Tištěno digitálně v Praze · MMXXVI
                  </p>
                  <p className="font-serif italic text-[16px] text-ink">
                    — David Kladišovský
                  </p>
                </footer>
              </article>
              <div aria-hidden className="perforation-bottom h-1 w-full" />
            </div>

            {/* Side links */}
            <div className="max-w-[720px] mx-auto mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { label: 'Kalendář', href: '#', note: 'Stáhnout .ics — pošleme e-mailem' },
                { label: 'Instagram', href: 'https://instagram.com/daklnetworking', note: '@daklnetworking' },
                { label: 'LinkedIn', href: 'https://linkedin.com/company/daklnetworking', note: 'DaKl Networking' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block group"
                >
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 mb-2">
                    {item.label}
                  </p>
                  <p className="font-serif italic text-[18px] leading-[1.3] text-ink group-hover:text-orange transition-colors">
                    {item.note}
                  </p>
                  <span className="inline-block mt-2 font-mono text-[10px] tracking-[0.22em] uppercase text-orange group-hover:translate-x-1 transition-transform duration-300 ease-editorial">
                    &rarr;
                  </span>
                </a>
              ))}
            </div>

            {/* Back link */}
            <div className="text-center mt-16">
              <Link
                href="/"
                className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-ink transition-colors"
              >
                <span aria-hidden className="transition-transform duration-300 ease-editorial group-hover:-translate-x-1">&larr;</span>
                Zpět na obálku
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
