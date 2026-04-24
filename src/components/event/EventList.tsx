'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn, formatCZK, formatDateDot, EVENT_TYPE_LABELS } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Event, EventType } from '@/types/database'

type FilterType = 'all' | EventType
type FilterStatus = 'all' | 'upcoming' | 'past'

interface EventListProps {
  events: Event[]
}

function getVenueLine(event: Event): string {
  return [event.location_name, event.location_address].filter(Boolean).join(', ')
}

const typeFilters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Vše' },
  { value: 'lod', label: 'Loď' },
  { value: 'vino', label: 'Víno' },
  { value: 'more', label: 'Moře' },
  { value: 'garden', label: 'Letní' },
  { value: 'jine', label: 'Jiné' },
]

const statusFilters: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Vše' },
  { value: 'upcoming', label: 'Nadcházející' },
  { value: 'past', label: 'Proběhlé' },
]

export function EventList({ events }: EventListProps) {
  const [activeType, setActiveType] = useState<FilterType>('all')
  const [activeStatus, setActiveStatus] = useState<FilterStatus>('all')

  const filtered = events.filter((event) => {
    // Type filter
    if (activeType !== 'all' && event.type !== activeType) return false

    // Status filter
    if (activeStatus === 'upcoming') {
      return event.status === 'published' || event.status === 'draft'
    }
    if (activeStatus === 'past') {
      return event.status === 'archived'
    }

    return true
  })

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-12">
        {/* Type filters */}
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveType(filter.value)}
              className={cn(
                'font-mono text-[11px] uppercase tracking-[0.12em] px-4 py-2 rounded-full border transition-colors duration-300',
                activeType === filter.value
                  ? 'bg-forest text-cream border-forest'
                  : 'bg-transparent text-forest border-forest hover:bg-forest/10'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveStatus(filter.value)}
              className={cn(
                'font-mono text-[11px] uppercase tracking-[0.12em] px-4 py-2 rounded-full border transition-colors duration-300',
                activeStatus === filter.value
                  ? 'bg-orange text-cream border-orange'
                  : 'bg-transparent text-forest border-forest hover:bg-orange/10'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event rows */}
      <div className="border-t border-forest/20">
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-mono text-[13px] uppercase tracking-[0.12em] text-ink-soft">
              Žádné akce neodpovídají filtru.
            </p>
          </div>
        )}

        {filtered.map((event) => {
          const isArchived = event.status === 'archived'
          const isDraft = event.status === 'draft'
          const isPublished = event.status === 'published'

          return (
            <Link
              key={event.id}
              href={`/akce/${event.slug}`}
              className={cn(
                'block border-b border-forest/20 transition-colors duration-300',
                'hover:bg-orange/[0.05]',
                isArchived && 'opacity-[0.42] hover:opacity-[0.6]'
              )}
            >
              {/* Desktop layout */}
              <div className="hidden lg:grid lg:grid-cols-[120px_100px_1fr_120px_180px] items-center gap-6 py-9">
                {/* Date */}
                <span className="font-mono text-[26px] tabular-nums text-ink leading-none">
                  {formatDateDot(event.starts_at)}
                </span>

                {/* Type badge */}
                <Badge type={event.type} className="text-forest border-forest justify-self-start" />

                {/* Name + venue */}
                <div>
                  <p className="text-ink text-[16px] font-medium leading-snug">
                    {event.name}
                  </p>
                  {getVenueLine(event) && (
                    <p className="font-mono text-[14px] uppercase tracking-[0.08em] text-ink-soft mt-1">
                      {getVenueLine(event)}
                    </p>
                  )}
                </div>

                {/* Price */}
                <span className="font-mono text-[16px] tabular-nums text-ink">
                  {formatCZK(event.price_czk)}
                </span>

                {/* Status CTA */}
                <div className="justify-self-end">
                  {isPublished && (
                    <span className="inline-block bg-orange text-cream font-mono text-[11px] uppercase tracking-[0.12em] px-4 py-2.5 rounded-[3px]">
                      Zarezervovat &rarr;
                    </span>
                  )}
                  {isDraft && (
                    <span className="inline-block font-mono text-[11px] uppercase tracking-[0.12em] text-forest border border-forest px-3 py-2 rounded-[2px]">
                      Brzy
                    </span>
                  )}
                  {isArchived && (
                    <span className="font-mono text-[13px] tabular-nums text-ink-soft">
                      {event.capacity}/{event.capacity}
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile layout */}
              <div className="lg:hidden grid grid-cols-2 gap-x-4 gap-y-3 py-9">
                {/* Row 1: date + badge */}
                <span className="font-mono text-[20px] tabular-nums text-ink leading-none">
                  {formatDateDot(event.starts_at)}
                </span>
                <div className="justify-self-end">
                  <Badge type={event.type} className="text-forest border-forest" />
                </div>

                {/* Row 2: name spans full */}
                <div className="col-span-2">
                  <p className="text-ink text-[16px] font-medium leading-snug">
                    {event.name}
                  </p>
                  {getVenueLine(event) && (
                    <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-soft mt-1">
                      {getVenueLine(event)}
                    </p>
                  )}
                </div>

                {/* Row 3: price + CTA */}
                <span className="font-mono text-[14px] tabular-nums text-ink self-center">
                  {formatCZK(event.price_czk)}
                </span>
                <div className="justify-self-end self-center">
                  {isPublished && (
                    <span className="inline-block bg-orange text-cream font-mono text-[11px] uppercase tracking-[0.12em] px-3 py-2 rounded-[3px]">
                      Zarezervovat &rarr;
                    </span>
                  )}
                  {isDraft && (
                    <span className="inline-block font-mono text-[11px] uppercase tracking-[0.12em] text-forest border border-forest px-3 py-2 rounded-[2px]">
                      Brzy
                    </span>
                  )}
                  {isArchived && (
                    <span className="font-mono text-[13px] tabular-nums text-ink-soft">
                      {event.capacity}/{event.capacity}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
