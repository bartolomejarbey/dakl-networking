'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { BrushAccent } from '@/components/ui/BrushAccent'

const EASE = [0.22, 1, 0.36, 1] as const

export function BonumSection() {
  return (
    <section
      data-folio="06"
      data-folio-label="Spolupráce · Bonum Negotium"
      className="relative bg-cream text-ink py-24 lg:py-32 overflow-hidden"
    >
      {/* Vertical orange stripe with rotated BONUM text — left edge */}
      <div
        aria-hidden
        className="hidden md:flex absolute top-0 bottom-0 left-0 w-[60px] bg-orange items-center justify-center"
      >
        <span
          className="font-mono text-[10px] tracking-[0.45em] uppercase text-cream font-medium"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          §&nbsp;06&nbsp;·&nbsp;BONUM&nbsp;NEGOTIUM
        </span>
      </div>

      <Container className="relative z-10 md:pl-[60px]">
        {/* Folio (mobile) */}
        <p className="md:hidden font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-10">
          §&nbsp;06 — Spolupráce
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Label column */}
          <div className="lg:col-span-3">
            <p className="hidden md:block font-mono text-[10px] tracking-[0.24em] uppercase text-ink-soft/60 mb-3">
              §&nbsp;06 — Vedlejší rubrika
            </p>
            <p className="font-mono text-[14px] tracking-[0.16em] uppercase text-orange font-medium">
              Bonum Negotium
            </p>
            <p className="mt-2 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55">
              Sesterský projekt
            </p>
          </div>

          {/* Content */}
          <div className="lg:col-span-9">
            <motion.h2
              initial={{ opacity: 0, y: 16, clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="font-serif text-ink leading-[1.02] tracking-[-0.018em] text-[clamp(32px,4.4vw,68px)] mb-10"
              style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
            >
              Benefity pro firmy,
              <span className="block italic text-ink-soft pl-[0.4em]">
                které <BrushAccent variant="teal">rostou</BrushAccent> nejrychleji v ČR.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
              className="text-ink-soft text-[18px] lg:text-[20px] leading-[1.55] max-w-[680px]"
            >
              Benefity, poukazy, stravenky, wellness. Když na networkingu
              řekneš, že máš 50+ zaměstnanců, možná ti pošlu nabídku.
            </motion.p>

            <motion.a
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              href="https://bonumnegotium.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-12 inline-flex items-baseline gap-3 font-serif text-[clamp(24px,3vw,36px)] text-orange border-b-2 border-orange/30 hover:border-orange transition-colors pb-2"
            >
              bonumnegotium.cz
              <span className="font-mono text-[12px] tracking-[0.18em] uppercase transition-transform duration-300 ease-editorial group-hover:translate-x-1.5" aria-hidden>
                &rarr;
              </span>
            </motion.a>
          </div>
        </div>
      </Container>
    </section>
  )
}
