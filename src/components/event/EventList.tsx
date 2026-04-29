'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn, formatCZK, formatDateDot, EVENT_TYPE_LABELS } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Event, EventType } from '@/types/database'

const EASE = [0.22, 1, 0.36, 1] as const

type FilterType = 'all' | EventType
type FilterStatus = 'all' | 'upcoming' | 'past'

interface EventListProps {
  events: Event[]
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

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'font-mono text-[10px] tracking-[0.22em] uppercase px-3.5 py-2 rounded-[1px] border transition-colors duration-300',
        active
          ? 'bg-ink text-cream border-ink'
          : 'bg-transparent text-ink-soft border-ink/25 hover:border-ink hover:text-ink'
      )}
    >
      [&nbsp;{children}&nbsp;]
    </button>
  )
}

export function EventList({ events }: EventListProps) {
  const [activeType, setActiveType] = useState<FilterType>('all')
  const [activeStatus, setActiveStatus] = useState<FilterStatus>('all')

  const filtered = events.filter((event) => {
    if (activeType !== 'all' && event.type !== activeType) return false
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
      {/* Filter rails */}
      <div className="flex flex-col gap-5 mb-14">
        <div>
          <p className="font-mono text-[9px] tracking-[0.26em] uppercase text-ink-soft/55 mb-3">
            Formát
          </p>
          <div className="flex flex-wrap gap-2">
            {typeFilters.map((filter) => (
              <FilterPill
                key={filter.value}
                active={activeType === filter.value}
                onClick={() => setActiveType(filter.value)}
              >
                {filter.label}
              </FilterPill>
            ))}
          </div>
        </div>
        <div>
          <p className="font-mono text-[9px] tracking-[0.26em] uppercase text-ink-soft/55 mb-3">
            Status
          </p>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <FilterPill
                key={filter.value}
                active={activeStatus === filter.value}
                onClick={() => setActiveStatus(filter.value)}
              >
                {filter.label}
              </FilterPill>
            ))}
          </div>
        </div>
      </div>

      {/* Editorial archive */}
      <ol className="border-t border-ink/20">
        {filtered.length === 0 && (
          <li className="py-20 text-center">
            <p className="font-serif italic text-[24px] text-ink">
              Tomuto filtru nic neodpovídá.
            </p>
            <p className="mt-3 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/65">
              Zkus jiný formát nebo status.
            </p>
          </li>
        )}

        {filtered.map((event, i) => {
          const isArchived = event.status === 'archived'
          const isDraft = event.status === 'draft'
          const isPublished = event.status === 'published'

          const status = isArchived
            ? 'Archiv'
            : isDraft
              ? 'Brzy'
              : 'Otevřeno'
          const statusTone = isArchived
            ? 'text-ink-soft/55'
            : isDraft
              ? 'text-teal'
              : 'text-orange'

          const venue = [event.location_name, event.location_address?.split(',')[0]?.trim()]
            .filter(Boolean)
            .join(' · ')

          return (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
              className="group border-b border-ink/15"
            >
              <Link
                href={`/akce/${event.slug}`}
                className="grid grid-cols-[80px_1fr_auto] lg:grid-cols-[170px_120px_1fr_120px_140px] items-baseline gap-4 lg:gap-6 py-7 lg:py-10 transition-colors duration-300 hover:bg-orange/[0.04]"
              >
                <span className="font-mono tabular-nums text-ink leading-none text-[20px] lg:text-[42px] tracking-[-0.01em]">
                  {formatDateDot(event.starts_at)}
                </span>

                <span className="hidden lg:inline-flex">
                  <Badge
                    type={event.type}
                    className="text-ink-soft border-ink-soft/35 group-hover:text-orange group-hover:border-orange/60 transition-colors"
                  />
                </span>

                <div className="col-span-2 lg:col-span-1 flex flex-col gap-1.5">
                  <span className="font-serif italic text-ink text-[20px] lg:text-[26px] leading-[1.15]">
                    {event.name}
                  </span>
                  {venue && (
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft/65">
                      {venue}
                    </span>
                  )}
                </div>

                <span className="hidden lg:inline-block font-mono text-[14px] tabular-nums text-ink-soft/75">
                  {event.price_czk ? formatCZK(event.price_czk) : '—'}
                </span>

                <span className="justify-self-end col-start-3 lg:col-auto flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase">
                  <span className={statusTone}>{status}</span>
                  <span className="text-ink-soft/40 group-hover:text-orange transition-colors" aria-hidden>
                    &rarr;
                  </span>
                </span>
              </Link>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
