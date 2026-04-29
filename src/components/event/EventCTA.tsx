'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { formatCZK } from '@/lib/utils'
import type { Event } from '@/types/database'

const EASE = [0.22, 1, 0.36, 1] as const

interface EventCTAProps {
  event: Event
  soldCount?: number
}

export function EventCTA({ event, soldCount = 0 }: EventCTAProps) {
  const isArchived = event.status === 'archived'
  const available = Math.max(event.capacity - soldCount, 0)
  const progressPercent =
    event.capacity > 0 ? Math.min((soldCount / event.capacity) * 100, 100) : 0

  if (isArchived) {
    return (
      <section className="relative bg-forest-deep text-cream overflow-hidden py-24 lg:py-32">
        <GrainOverlay opacity={0.05} />
        <Container className="relative z-10 max-w-editorial mx-auto text-center">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-7">
            §&nbsp;Ohlédnutí
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 14, clipPath: 'inset(0 0 100% 0)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="font-serif italic text-cream text-[clamp(36px,5.4vw,80px)] leading-[1.05] tracking-[-0.018em] mb-7"
            style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
          >
            Tohle vydání už proběhlo.
          </motion.h2>
          <p className="font-serif italic text-cream/70 text-[20px] lg:text-[22px] leading-[1.45] max-w-[520px] mx-auto mb-10">
            Děkujeme všem, co dorazili. Příští vydání ohlásíme přihlášeným odběratelům jako prvním.
          </p>
          <Link
            href="/#odber"
            className="group inline-flex items-center gap-3 bg-orange hover:bg-orange-dark text-cream font-mono text-[12px] tracking-[0.18em] uppercase font-semibold px-7 py-4 rounded-[1px] border-2 border-orange transition-colors duration-300"
          >
            Buď u dalšího
            <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden>
              &rarr;
            </span>
          </Link>
        </Container>
      </section>
    )
  }

  return (
    <section className="relative bg-forest-deep text-cream overflow-hidden py-24 lg:py-32">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 22% 70%, rgba(30, 139, 133, 0.16), transparent 60%)',
        }}
      />
      <GrainOverlay opacity={0.05} />

      <Container className="relative z-10 max-w-editorial mx-auto text-center">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-7">
          §&nbsp;Přihláška
        </p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-mono text-[clamp(60px,9vw,140px)] tabular-nums text-cream leading-none tracking-[-0.02em] mb-3"
        >
          {formatCZK(event.price_czk)}
        </motion.p>
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 mb-10">
          Za celý večer · vše v ceně · bez DPH
        </p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="flex flex-col items-center gap-6 mb-12"
        >
          <Link
            href={`/akce/${event.slug}/prihlaska`}
            className="group inline-flex items-center justify-center gap-3 w-full max-w-[480px] bg-orange hover:bg-orange-dark text-cream font-mono text-[13px] tracking-[0.18em] uppercase font-semibold px-7 py-5 rounded-[1px] border-2 border-orange transition-colors duration-300"
          >
            Přihlásit a zaplatit
            <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden>
              &rarr;
            </span>
          </Link>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 max-w-[460px] mx-auto">
            Platba okamžitě přes QR nebo převodem · Faktura na firmu automaticky
          </p>
        </motion.div>

        <div className="inline-flex items-center gap-4 font-mono text-[11px] tracking-[0.18em] uppercase text-cream/65">
          <span className="tabular-nums">Zbývá {available}</span>
          <span className="text-cream/35">/</span>
          <span className="tabular-nums">{event.capacity} míst</span>
          <div className="relative w-[80px] h-[2px] bg-cream/15 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-orange"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
