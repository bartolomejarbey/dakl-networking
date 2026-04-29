'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/Badge'
import { formatCZK, formatDateDot, EVENT_TYPE_LABELS } from '@/lib/utils'
import type { Event } from '@/types/database'

const EASE = [0.22, 1, 0.36, 1] as const

interface ArchiveIndexSectionProps {
  events: Event[]
}

interface RowProps {
  event: Event
  index: number
}

function ArchiveRow({ event, index }: RowProps) {
  const isPublished = event.status === 'published'
  const isArchived = event.status === 'archived'
  const isDraft = event.status === 'draft'

  const venue = [event.location_name, event.location_address?.split(',')[0]?.trim()]
    .filter(Boolean)
    .join(' · ')

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

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: EASE }}
      className="group border-b border-ink/15"
    >
      <Link
        href={isPublished || isDraft ? `/akce/${event.slug}` : `/akce/${event.slug}`}
        className="grid grid-cols-[80px_1fr_auto] lg:grid-cols-[180px_120px_1fr_120px_140px] items-baseline gap-4 lg:gap-6 py-7 lg:py-10 transition-colors duration-300 hover:bg-orange/[0.04]"
      >
        {/* Date — large mono on desktop, smaller on mobile */}
        <span className="font-mono tabular-nums text-ink leading-none text-[20px] lg:text-[44px] tracking-[-0.01em]">
          {formatDateDot(event.starts_at)}
        </span>

        {/* Type badge — desktop only */}
        <span className="hidden lg:inline-flex">
          <Badge
            type={event.type}
            className="text-ink-soft border-ink-soft/40 group-hover:text-orange group-hover:border-orange/60 transition-colors"
          />
        </span>

        {/* Name + venue */}
        <div className="col-span-2 lg:col-span-1 flex flex-col gap-1.5">
          <span className="font-serif italic text-ink text-[22px] lg:text-[28px] leading-[1.15]">
            {event.name}
          </span>
          {venue && (
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft/65">
              {venue}
            </span>
          )}
        </div>

        {/* Price — desktop only */}
        <span className="hidden lg:inline-block font-mono text-[14px] tabular-nums text-ink-soft/75">
          {event.price_czk ? formatCZK(event.price_czk) : '—'}
        </span>

        {/* Status */}
        <span className="justify-self-end col-start-3 lg:col-auto flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase">
          <span className={statusTone}>{status}</span>
          <span className="text-ink-soft/40 group-hover:text-orange transition-colors" aria-hidden>&rarr;</span>
        </span>
      </Link>
    </motion.li>
  )
}

export function ArchiveIndexSection({ events }: ArchiveIndexSectionProps) {
  // Sort: published first, then drafts (TBA), then archived (newest first)
  const sorted = [...events].sort((a, b) => {
    const order = { published: 0, draft: 1, archived: 2, cancelled: 3 } as const
    const oa = order[a.status as keyof typeof order] ?? 9
    const ob = order[b.status as keyof typeof order] ?? 9
    if (oa !== ob) return oa - ob
    return new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime()
  })

  return (
    <section
      data-folio="04"
      data-folio-label="Kalendář"
      className="relative bg-cream text-ink py-24 lg:py-32"
    >
      <Container className="relative z-10">
        {/* Section folio */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-16 lg:mb-20">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
            §&nbsp;04 — Kalendář
          </p>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/60">
            Index všech vydání · ročník IV
          </p>
        </div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16, clipPath: 'inset(0 0 100% 0)' }}
          whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-serif text-ink leading-[1] tracking-[-0.022em] text-[clamp(40px,5.6vw,84px)] mb-16 lg:mb-20 max-w-[960px]"
          style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
        >
          Co bylo. Co bude.
          <span className="block italic text-ink-soft pl-[0.5em] mt-2">
            Co stojí v archivu.
          </span>
        </motion.h2>

        {/* Editorial archive */}
        <ol className="border-t border-ink/20">
          {sorted.map((event, i) => (
            <ArchiveRow key={event.id} event={event} index={i} />
          ))}
        </ol>

        {/* Bottom link */}
        <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft/65 max-w-[460px]">
            Příští vydání oznámíme přihlášeným odběratelům jako prvním.
          </p>
          <Link
            href="/akce"
            className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase text-ink border-b border-orange pb-1 hover:text-orange transition-colors"
          >
            Otevřít celý archiv
            <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1.5" aria-hidden>
              &rarr;
            </span>
          </Link>
        </div>
      </Container>
    </section>
  )
}
