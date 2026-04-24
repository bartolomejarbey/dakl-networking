'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import { formatCZK, formatDateDot } from '@/lib/utils'
import type { Event } from '@/types/database'

interface FeaturedEventSectionProps {
  event: Event
  soldCount?: number
}

const DEFAULT_PROGRAM = [
  { number: '01', title: 'Jidlo a piti.', description: 'Alko i nealko. Vsechno v cene.' },
  { number: '02', title: 'DJs po celou dobu.', description: 'Od chill odpolednich beatu po tanecni vecer.' },
  { number: '03', title: 'Beachvolejbal.', description: 'Kurt u lodi, hraci rotuji.' },
  { number: '04', title: 'Paddleboardy a kajaky.', description: 'Pujceni zdarma.' },
  { number: '05', title: 'Motorovy clun.', description: 'Pokud ti to bude malo.' },
]

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80'

function getDayName(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('cs-CZ', { weekday: 'long' })
}

function getTimeRange(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  const fmt = (d: Date) => d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
  return `${fmt(start)}-${fmt(end)}`
}

function getBigDate(dateStr: string): string {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}.`
}

export function FeaturedEventSection({ event, soldCount = 0 }: FeaturedEventSectionProps) {
  const available = event.capacity - soldCount
  const progressPercent = event.capacity > 0 ? (soldCount / event.capacity) * 100 : 0

  const programItems = event.program_json
    ? event.program_json.slice(0, 5).map((item, i) => ({
        number: String(i + 1).padStart(2, '0'),
        title: item.title,
        description: item.description || '',
      }))
    : DEFAULT_PROGRAM

  return (
    <section className="relative bg-teal overflow-hidden py-24 lg:py-32">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #F5EFE2 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.04,
        }}
      />

      <Container className="relative z-10">
        {/* Top area */}
        <div
          className="col-span-12 mb-16 lg:mb-24"
        >
          {/* Section label */}
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-orange mb-8">
            &mdash; 03 / Nejblizsi akce
          </p>

          {/* Big date */}
          <p
            className="font-mono text-cream tabular-nums leading-none mb-4 big-date"
          >
            {getBigDate(event.starts_at)}
          </p>

          {/* Event title */}
          <h2
            className="font-serif text-cream leading-[1.05] mb-6 text-[clamp(40px,5.2vw,72px)]"
          >
            {event.name}
          </h2>

          {/* Meta row */}
          <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-cream/70 flex flex-wrap items-center gap-x-3">
            <span>{getDayName(event.starts_at)}</span>
            <span className="text-cream/40">&middot;</span>
            <span>{getTimeRange(event.starts_at, event.ends_at)}</span>
            {event.location_name && (
              <>
                <span className="text-cream/40">&middot;</span>
                <span>{event.location_name}</span>
              </>
            )}
            {event.location_address && (
              <>
                <span className="text-cream/40">&middot;</span>
                <span>{event.location_address}</span>
              </>
            )}
          </div>
        </div>

        {/* Bottom area: 12-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Event photo (col 1-7) */}
          <div
            className="lg:col-span-7"
          >
            <div className="relative aspect-[4/3] rounded-[4px] overflow-hidden group">
              <Image
                src={event.hero_image_url || FALLBACK_IMAGE}
                alt={event.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
              {/* Tag */}
              <div className="absolute top-5 left-5 font-mono text-[11px] uppercase tracking-[0.12em] text-cream/90 bg-ink/40 backdrop-blur-sm px-3 py-1.5 rounded-[2px]">
                KAY/BCH &middot; 20:12
              </div>
            </div>
          </div>

          {/* Right: Content (col 8-12) */}
          <div
            className="lg:col-span-5"
          >
            {/* Heading */}
            <h3 className="font-serif text-cream text-[28px] lg:text-[32px] leading-[1.15] mb-8">
              Co te ceka na palube.
            </h3>

            {/* Numbered list */}
            <div className="mb-10">
              {programItems.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'grid grid-cols-[48px_1fr] items-start py-4',
                    'border-t border-cream/[0.18]',
                    i === programItems.length - 1 && 'border-b border-cream/[0.18]'
                  )}
                >
                  <span className="font-mono text-[12px] text-cream/60 tabular-nums pt-0.5">
                    {item.number}
                  </span>
                  <p className="text-cream text-[14px] leading-[1.5]">
                    <span className="font-semibold">{item.title}</span>{' '}
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Price block */}
            <div className="mb-8">
              <p className="font-mono text-cream tabular-nums leading-none text-[58px]">
                {formatCZK(event.price_czk)}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-cream/70 mt-3">
                Za cely vecer &middot; vse v cene &middot; bez DPH
              </p>
            </div>

            {/* CTA Button */}
            <Link
              href={`/akce/${event.slug}/prihlaska`}
              className="block w-full bg-orange hover:bg-orange-dark text-cream font-mono text-[13px] uppercase tracking-[0.12em] text-center py-4 px-6 rounded-[3px] transition-colors duration-300 mb-5"
            >
              Zarezervovat misto &rarr;
            </Link>

            {/* Remaining spots */}
            <div className="flex items-center gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-cream/70">
                Zbyva {available} mist z {event.capacity}
              </p>
              <div className="relative w-[60px] h-[3px] bg-cream/20 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-orange rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
