import Link from 'next/link'
import { Container } from './Container'
import { Marquee } from '@/components/ui/Marquee'
import { Wordmark } from '@/components/ui/Wordmark'

const issues = [
  { date: '24.04.26', label: 'Kayak Beach Bar', slug: 'kayak-beach-bar', status: 'Archiv' },
  { date: '23.03.26', label: 'Mořské plody', slug: 'ochutnavka-morskych-plodu', status: 'Archiv' },
  { date: '26.02.26', label: 'Degustace vína', slug: 'degustace-vina-wood-and-steak', status: 'Archiv' },
  { date: 'TBA', label: 'Příští vydání', slug: 'akce', status: 'Brzy' },
]

const tickerItems = [
  '47 akcí od 2023',
  '6 850+ hostů',
  '94% průměrná obsazenost',
  'Praha · Vltava · Náplavka',
  'Ročník IV · Vydání 04',
]

const colophon = [
  { label: 'Ročník', value: 'IV' },
  { label: 'Vydáno', value: 'Praha 2026' },
  { label: 'Sazba', value: 'Instrument Serif & JetBrains Mono' },
  { label: 'Tisk', value: 'Digitálně' },
]

export function Footer() {
  return (
    <footer className="relative bg-charcoal text-cream pt-0 pb-10 overflow-hidden">
      {/* Marquee ticker — top of footer */}
      <div className="border-y border-cream/15 py-4">
        <Marquee speed="slow" copies={3} separator={<span aria-hidden>·</span>}>
          {tickerItems.map((item, i) => (
            <span key={i} className="px-6 font-mono text-[11px] tracking-[0.22em] uppercase text-cream/65 whitespace-nowrap">
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      <Container className="pt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 items-start">
          {/* Masthead */}
          <div className="md:col-span-4">
            <Wordmark size="xl" subtitle="Networking" edition="MMXXVI" accent className="mb-8" />
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/65">
              § Pražské vydání · ROČNÍK IV · 2026
            </p>
            <p className="mt-7 font-serif italic text-[20px] leading-[1.4] text-cream/85 max-w-[320px]">
              Pro lidi, co něco dělají.<br />
              Bez kafe v zasedačce.
            </p>
          </div>

          {/* Issues */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 mb-6">
              §&nbsp;01&nbsp;/&nbsp;Vydání
            </h4>
            <ul className="space-y-3.5">
              {issues.map((issue) => (
                <li key={issue.date + issue.label}>
                  <Link
                    href={issue.slug.startsWith('akce') ? '/akce' : `/akce/${issue.slug}`}
                    className="group flex items-baseline gap-3 font-mono text-[12px] text-cream/70 hover:text-cream transition-colors"
                  >
                    <span className="tabular-nums w-[70px] shrink-0">{issue.date}</span>
                    <span className="flex-1">{issue.label}</span>
                    <span className="text-[10px] tracking-[0.18em] uppercase text-cream/40 group-hover:text-orange transition-colors">
                      {issue.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div className="md:col-span-2">
            <h4 className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 mb-6">
              §&nbsp;02&nbsp;/&nbsp;Kontakt
            </h4>
            <ul className="space-y-3.5 font-mono text-[12px] text-cream/70">
              <li>
                <a href="mailto:david@daklnetworking.cz" className="hover:text-orange transition-colors">
                  david@daklnetworking.cz
                </a>
              </li>
              <li>
                <a href="tel:+420601348249" className="hover:text-orange transition-colors">
                  +420 601 348 249
                </a>
              </li>
              <li>
                <a href="https://instagram.com/daklnetworking" rel="noopener noreferrer" target="_blank" className="hover:text-orange transition-colors">
                  @daklnetworking
                </a>
              </li>
              <li className="text-cream/40">Praha · Náplavka</li>
            </ul>
          </div>

          {/* Tirage */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 mb-6">
              §&nbsp;03&nbsp;/&nbsp;Tiráž
            </h4>
            <ul className="space-y-3.5 font-mono text-[11px] text-cream/65">
              {colophon.map((row) => (
                <li key={row.label} className="flex items-baseline gap-3">
                  <span className="text-cream/40 w-[64px] shrink-0 uppercase tracking-[0.16em]">{row.label}</span>
                  <span>{row.value}</span>
                </li>
              ))}
            </ul>
            <ul className="mt-7 space-y-2 font-mono text-[11px] text-cream/45">
              <li>
                <Link href="/podminky" className="hover:text-cream transition-colors">
                  Obchodní podmínky
                </Link>
              </li>
              <li>
                <Link href="/ochrana-osobnich-udaju" className="hover:text-cream transition-colors">
                  Ochrana osobních údajů
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Colophon line */}
        <div className="mt-20 pt-6 border-t border-cream/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-mono text-[10px] tracking-[0.18em] uppercase text-cream/40">
          <span className="inline-flex items-center gap-[0.32em]">
            <span>© MMXXVI</span>
            <Link
              href="/admin/login"
              aria-label="Privátní vstup"
              className="inline-block w-4 h-4 -my-1 text-center leading-[1rem] text-cream/40 hover:text-orange transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-orange focus-visible:outline-offset-2"
            >
              ·
            </Link>
            <span>DaKl Networking · Praha</span>
          </span>
          <span>Žádný marketing. Jen pozvánka.</span>
        </div>
      </Container>
    </footer>
  )
}
