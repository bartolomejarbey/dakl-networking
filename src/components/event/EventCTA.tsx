'use client'

import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { formatCZK } from '@/lib/utils'
import type { Event } from '@/types/database'

interface EventCTAProps {
  event: Event
  soldCount?: number
}

export function EventCTA({ event, soldCount = 0 }: EventCTAProps) {
  const available = event.capacity - soldCount
  const progressPercent = event.capacity > 0 ? (soldCount / event.capacity) * 100 : 0

  return (
    <section className="relative bg-forest overflow-hidden py-20 lg:py-28">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #F5EFE2 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.04,
        }}
      />

      <Container className="relative z-10 text-center">
        {/* Large text */}
        <p
          className="font-serif text-cream leading-[1.1] mb-6 text-[clamp(32px,4vw,52px)]"
        >
          Přihlásit za {formatCZK(event.price_czk)} &rarr;
        </p>

        {/* Sub text */}
        <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-cream/70 max-w-[520px] mx-auto mb-10 leading-relaxed">
          Platba okamžitě přes QR nebo převodem. Faktura na firmu automaticky.
        </p>

        {/* Availability counter */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-cream/70">
            Zbývá {available} míst z {event.capacity}
          </p>
          <div className="relative w-[60px] h-[3px] bg-cream/20 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-orange rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/akce/${event.slug}/prihlaska`}
          className="block w-full max-w-[480px] mx-auto bg-orange hover:bg-orange-dark text-cream font-mono text-[13px] uppercase tracking-[0.12em] text-center py-4 px-6 rounded-[3px] transition-colors duration-300"
        >
          Přihlásit a zaplatit &rarr;
        </Link>
      </Container>
    </section>
  )
}
