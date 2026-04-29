'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { CaptionBlock } from '@/components/ui/CaptionBlock'
import { Duotone } from '@/components/ui/Duotone'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { formatCZK, formatDateLong, formatTime, EVENT_TYPE_LABELS } from '@/lib/utils'
import type { Event } from '@/types/database'

const EASE = [0.22, 1, 0.36, 1] as const

interface EventHeroProps {
  event: Event
  soldCount?: number
}

function fileCode(slug: string): string {
  return slug
    .split('-')
    .slice(0, 2)
    .map((s) => s.slice(0, 3).toUpperCase())
    .join('/')
}

export function EventHero({ event, soldCount = 0 }: EventHeroProps) {
  const isArchived = event.status === 'archived'
  const isDraft = event.status === 'draft'
  const isPublished = event.status === 'published'

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
    <section className="relative bg-forest-deep text-cream overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 78% 30%, rgba(30, 139, 133, 0.18), transparent 60%)',
        }}
      />
      <GrainOverlay opacity={0.04} />

      <Container className="relative z-10">
        {/* Top: folio + back link */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 mb-12 lg:mb-16">
          <Link
            href="/akce"
            className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase text-cream/65 hover:text-cream transition-colors"
          >
            <span className="transition-transform duration-300 ease-editorial group-hover:-translate-x-1.5" aria-hidden>
              &larr;
            </span>
            Zpět do archivu
          </Link>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-orange">
            §&nbsp;{EVENT_TYPE_LABELS[event.type]?.toUpperCase() || 'AKCE'} · {fileCode(event.slug)}
          </p>
        </div>

        {/* Cover headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18, clipPath: 'inset(0 0 100% 0)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.95, ease: EASE }}
          className="font-serif italic text-cream leading-[0.96] tracking-[-0.022em] text-[clamp(44px,7.5vw,128px)] mb-12 lg:mb-16 max-w-[1100px]"
          style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
        >
          {event.name}
        </motion.h1>

        {/* Metadata ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-y-7 gap-x-8 mb-14 lg:mb-20 border-y border-cream/15 py-7"
        >
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 mb-2">
              Datum
            </p>
            <p className="font-serif text-[18px] lg:text-[20px] leading-[1.3]">
              {formatDateLong(event.starts_at)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 mb-2">
              Čas
            </p>
            <p className="font-mono text-[18px] tabular-nums">
              {formatTime(event.starts_at)}–{formatTime(event.ends_at)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 mb-2">
              Místo
            </p>
            <p className="font-serif text-[18px] lg:text-[20px] leading-[1.3]">
              {event.location_name || 'TBA'}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 mb-2">
              Cena
            </p>
            <p className="font-mono text-[20px] lg:text-[22px] tabular-nums">
              {event.price_czk ? formatCZK(event.price_czk) : '—'}
            </p>
          </div>
        </motion.div>

        {/* Hero image */}
        {event.hero_image_url && (
          <motion.figure
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: EASE }}
            className="relative"
          >
            <div className="relative aspect-[16/9] lg:aspect-[16/8] w-full overflow-hidden rounded-[1px] bg-forest">
              <Duotone
                src={event.hero_image_url}
                alt={event.name}
                fill
                variant={isArchived ? 'forest-cream' : 'forest-orange'}
                priority
                sizes="100vw"
                className="object-cover"
              />
              {isArchived && (
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <span
                    className="font-mono text-[clamp(44px,8vw,108px)] tracking-[0.16em] uppercase text-cream/85 border-[3px] border-cream/85 px-8 py-4 rounded-[1px] backdrop-blur-sm bg-forest-deep/30"
                    style={{ transform: 'rotate(-8deg)' }}
                  >
                    Proběhlo
                  </span>
                </div>
              )}
            </div>
            <CaptionBlock
              code={fileCode(event.slug) + '-001'}
              location={event.location_address ?? event.location_name ?? ''}
              meta={`${formatDateLong(event.starts_at)} · ${formatTime(event.starts_at)}`}
              className="mt-4"
            />
          </motion.figure>
        )}

        {/* Action row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          className="mt-14 flex flex-col sm:flex-row sm:items-center gap-6"
        >
          {isPublished && (
            <Link
              href={`/akce/${event.slug}/prihlaska`}
              className="group inline-flex items-center gap-3 bg-orange hover:bg-orange-dark text-cream font-mono text-[12px] tracking-[0.18em] uppercase font-semibold px-7 py-4 rounded-[1px] transition-colors duration-300 border-2 border-orange hover:border-orange-dark"
            >
              Přihlásit a zaplatit
              <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden>
                &rarr;
              </span>
            </Link>
          )}
          {isDraft && (
            <span className="inline-flex items-center gap-3 border-2 border-cream/30 text-cream font-mono text-[12px] tracking-[0.18em] uppercase px-7 py-4 rounded-[1px]">
              Datum oznámíme přihlášeným
            </span>
          )}
          {isArchived && (
            <Link
              href="/#odber"
              className="group inline-flex items-center gap-3 border-2 border-cream/40 text-cream hover:border-cream font-mono text-[12px] tracking-[0.18em] uppercase font-semibold px-7 py-4 rounded-[1px] transition-colors duration-300"
            >
              Buď u dalšího vydání
              <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden>
                &rarr;
              </span>
            </Link>
          )}
          {!isArchived && (
            <button
              onClick={handleDownloadICS}
              className="group font-mono text-[11px] tracking-[0.22em] uppercase text-cream/75 hover:text-cream transition-colors inline-flex items-center gap-2"
            >
              Stáhnout do kalendáře
              <span aria-hidden className="opacity-50">.ics</span>
            </button>
          )}
        </motion.div>
      </Container>
    </section>
  )
}
