'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Duotone } from '@/components/ui/Duotone'
import { CaptionBlock } from '@/components/ui/CaptionBlock'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { BrushAccent } from '@/components/ui/BrushAccent'

const EASE = [0.22, 1, 0.36, 1] as const

export function OrganizerSection() {
  return (
    <section
      data-folio="05"
      data-folio-label="Pořadatel · David"
      className="relative bg-forest text-cream py-24 lg:py-36 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 80% 78%, rgba(30, 139, 133, 0.18), transparent 65%)',
        }}
      />
      <GrainOverlay opacity={0.04} />

      <Container className="relative z-10">
        {/* Folio */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-16 lg:mb-20">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
            §&nbsp;05 — Pořadatel
          </p>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55">
            Rozhovor · šéfredaktor vydání
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Portrait */}
          <motion.figure
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 1, ease: EASE }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1px] bg-forest-deep">
              <Duotone
                src="/images/david.jpg"
                alt="David Kladišovský — pořadatel DaKl Networking"
                fill
                variant="forest-cream"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <span
                aria-hidden
                className="absolute top-5 left-5 font-mono text-[10px] tracking-[0.24em] uppercase text-cream border border-cream/60 px-3 py-1.5 rounded-[1px] backdrop-blur-sm bg-forest-deep/40"
              >
                Portrét · 4:5
              </span>
            </div>
            <CaptionBlock
              code="DK · POŘADATEL"
              location="Praha · v lednu 2026"
              meta="Foto z archivu · obnovená kompozice"
              className="mt-4"
            />
          </motion.figure>

          {/* Bio */}
          <div className="lg:col-span-7 lg:pl-8">
            <motion.h2
              initial={{ opacity: 0, y: 16, clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="font-serif leading-[0.98] tracking-[-0.022em] text-[clamp(40px,5.4vw,84px)] mb-10"
              style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
            >
              David.
              <span className="block italic text-cream/65 pl-[0.5em]">
                Šéfredaktor.
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="space-y-7 text-cream/85 text-[18px] lg:text-[19px] leading-[1.55] max-w-[600px]"
            >
              <p className="dropcap-cream">
                DaKl Networking pořádám pro lidi, co něco{' '}
                <BrushAccent variant="teal">dělají</BrushAccent>{' '}
                — vlastníky firem, freelancery, manažery. Bez kafe v zasedačce, bez
                prezentací. Loď, dobrá kuchyně, dobré pití, lidi, kteří se
                baví o byznysu, protože je to baví.
              </p>
              <p>
                Kromě DaKl vedu Bonum Negotium — benefity pro firmy, co rostou.
              </p>
            </motion.div>

            {/* Pull-quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
              className="mt-12 pl-6 border-l-2 border-orange"
            >
              <p className="font-serif italic text-[clamp(24px,3.2vw,40px)] leading-[1.25] text-cream">
                „Networking je to, co zbyde druhý den ráno v telefonu."
              </p>
              <footer className="mt-5 font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55">
                — D. K., Praha 2025
              </footer>
            </motion.blockquote>

            {/* Link */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
              className="mt-12"
            >
              <Link
                href="/david-kladisovsky"
                className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase text-cream border-b border-orange pb-1 hover:text-orange transition-colors"
              >
                Celý rozhovor
                <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1.5" aria-hidden>
                  &rarr;
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
}
