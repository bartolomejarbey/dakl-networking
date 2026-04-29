'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Duotone } from '@/components/ui/Duotone'
import { Marquee } from '@/components/ui/Marquee'
import { StatScrub } from '@/components/ui/StatScrub'
import { CaptionBlock } from '@/components/ui/CaptionBlock'
import { GrainOverlay } from '@/components/ui/GrainOverlay'

const EASE = [0.22, 1, 0.36, 1] as const

// TODO David: confirm exact numbers from the boat night
const ledger = [
  { value: 412, label: 'vyměněných vizitek', note: null },
  { value: 1047, label: 'vypitých drinků', note: 'z toho 312 nealko — pro pořádek' },
  { value: 0, label: 'PowerPointových prezentací', note: null },
  { value: 3, label: 'mobily zachráněné z Vltavy', note: null },
  { value: 47, label: 'nových LinkedIn spojení', note: 'do následujícího týdne' },
  { value: 2, label: 'dohodnuté spolupráce', note: 'už v pondělí ráno' },
]

const tickerItems = [
  '412 vizitek',
  '1 047 drinků',
  '0 prezentací',
  '3 mobily zachráněné z Vltavy',
  '47 nových spojení',
  '24.04.2026 · Náplavka',
]

export function AftermathSection() {
  return (
    <section
      data-folio="02"
      data-folio-label="Ohlédnutí · Kayak Beach Bar"
      className="relative bg-forest text-cream overflow-hidden"
    >
      {/* Top marquee ticker — sits flush against navbar transition */}
      <div className="border-y border-cream/12 py-4 bg-forest-deep">
        <Marquee speed="slow" copies={3} separator={<span aria-hidden>·</span>}>
          {tickerItems.map((item, i) => (
            <span
              key={i}
              className="px-7 font-mono text-[11px] tracking-[0.22em] uppercase text-cream/65 whitespace-nowrap"
            >
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      <div className="relative py-24 lg:py-32">
        {/* Subtle teal radial — top-right */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 45% at 75% 18%, rgba(30, 139, 133, 0.16), transparent 60%)',
          }}
        />
        <GrainOverlay opacity={0.04} />

        <Container className="relative z-10">
          {/* Section folio */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-12 lg:mb-16">
            <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
              §&nbsp;02 — Ohlédnutí
            </p>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55">
              Kayak Beach Bar · Náplavka · 24.04.2026
            </p>
          </div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 18, clipPath: 'inset(0 0 100% 0)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-serif text-[clamp(44px,7vw,116px)] leading-[0.98] tracking-[-0.022em] mb-16 lg:mb-24 max-w-[1100px]"
            style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
          >
            Co se dělo na lodi.{' '}
            <span className="italic text-cream/80 block lg:inline lg:pl-3">
              Účetní stránka jednoho večera.
            </span>
          </motion.h2>

          {/* Two-column ledger + photo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Stat ledger */}
            <div className="lg:col-span-7">
              <ul className="border-t border-cream/15">
                {ledger.map((row, i) => (
                  <motion.li
                    key={row.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{
                      duration: 0.6,
                      delay: 0.05 * i,
                      ease: EASE,
                    }}
                    className="grid grid-cols-[minmax(120px,180px)_1fr] items-baseline gap-6 py-5 lg:py-6 border-b border-cream/15"
                  >
                    <span className="font-mono tabular-nums text-cream text-[clamp(40px,5.5vw,72px)] leading-none tracking-[-0.02em]">
                      <StatScrub
                        value={row.value}
                        delay={0.1 + 0.06 * i}
                        duration={1.4 + 0.1 * i}
                      />
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-serif text-[20px] lg:text-[24px] text-cream leading-[1.3]">
                        {row.label}
                      </span>
                      {row.note && (
                        <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-cream/55">
                          {row.note}
                        </span>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>

              {/* Punchline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                className="mt-12 font-serif italic text-[clamp(28px,3.6vw,48px)] leading-[1.25] text-cream"
              >
                Bylo. A bylo to dobré.
              </motion.p>

              {/* Mono link to newsletter */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
                className="mt-10 max-w-[460px]"
              >
                <p className="font-mono text-[12px] tracking-[0.14em] uppercase text-cream/65 leading-[1.7]">
                  Příští akce se připravuje. Datum oznámíme přihlášeným odběratelům jako prvním.
                </p>
                <Link
                  href="#odber"
                  className="group mt-5 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase text-orange border-b border-orange/40 hover:border-orange transition-colors pb-1"
                >
                  Přihlásit se k odběru
                  <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1.5" aria-hidden>
                    &rarr;
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Photo */}
            <div className="lg:col-span-5">
              <motion.figure
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 1, delay: 0.2, ease: EASE }}
                className="space-y-4"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1px] bg-forest-deep">
                  <Duotone
                    src="/images/kaybeach.jpg"
                    alt="Atmosféra DaKl Networking · Kayak Beach Bar"
                    fill
                    variant="forest-orange"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  {/* Diagonal stamp */}
                  <span
                    aria-hidden
                    className="absolute top-5 right-5 font-mono text-[10px] tracking-[0.24em] uppercase text-cream border border-cream/70 px-3 py-1.5 rounded-[1px] backdrop-blur-sm bg-forest-deep/40"
                    style={{ transform: 'rotate(-2deg)' }}
                  >
                    Archiv · 24.04.26
                  </span>
                </div>
                <CaptionBlock
                  code="KAY/BCH-007"
                  location="Náplavka · Železniční most"
                  meta="24.04.2026 · 19:42 · DJ set v plném proudu"
                />
              </motion.figure>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}
