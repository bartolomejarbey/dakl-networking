'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { cn, formatCZK, formatDateLong, formatTime } from '@/lib/utils'
import type { Event } from '@/types/database'

interface EventHeroProps {
  event: Event
  soldCount?: number
}

export function EventHero({ event, soldCount = 0 }: EventHeroProps) {
  const available = event.capacity - soldCount
  const progressPercent = event.capacity > 0 ? (soldCount / event.capacity) * 100 : 0

  const handleDownloadICS = () => {
    const { generateICS } = require('@/lib/utils')
    const icsContent = generateICS(event)
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${event.slug}.ics`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="relative bg-forest overflow-hidden">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #F5EFE2 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.04,
        }}
      />

      {/* Hero image */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
        {event.hero_image_url && (
          <Image
            src={event.hero_image_url}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/60 to-transparent" />
      </div>

      {/* Content */}
      <Container className="relative z-10 pb-16 -mt-20 md:-mt-28 lg:-mt-32">
        {/* Event name */}
        <h1
          className="font-serif text-cream leading-[1.05] mb-8 text-[clamp(40px,5.2vw,72px)]"
        >
          {event.name}
        </h1>

        {/* Info bar */}
        <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-cream/70 flex flex-wrap items-center gap-x-3 mb-10">
          <span>{formatDateLong(event.starts_at)}</span>
          <span className="text-cream/40">&middot;</span>
          <span>{formatTime(event.starts_at)}&ndash;{formatTime(event.ends_at)}</span>
          {event.location_name && (
            <>
              <span className="text-cream/40">&middot;</span>
              <span>{event.location_name}</span>
            </>
          )}
          <span className="text-cream/40">&middot;</span>
          <span>{formatCZK(event.price_czk)}</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Link
            href={`/akce/${event.slug}/prihlaska`}
            className="inline-flex items-center gap-2.5 bg-orange hover:bg-orange-dark text-cream font-mono text-[13px] uppercase tracking-[0.12em] font-medium px-[28px] py-[15px] rounded-[3px] transition-colors duration-300"
          >
            Přihlásit a zaplatit &rarr;
          </Link>
          <button
            onClick={handleDownloadICS}
            className="font-mono text-[12px] uppercase tracking-[0.12em] text-cream/70 hover:text-cream transition-colors underline underline-offset-4 decoration-cream/30"
          >
            Stáhnout do kalendáře
          </button>
        </div>

        {/* Availability counter */}
        <div className="flex items-center gap-3">
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
      </Container>
    </section>
  )
}
