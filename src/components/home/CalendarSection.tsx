import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import { formatCZK, formatDateDot, EVENT_TYPE_LABELS } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Event } from '@/types/database'

interface CalendarSectionProps {
  events: Event[]
}

function getVenueLine(event: Event): string {
  return [event.location_name, event.location_address].filter(Boolean).join(', ')
}

export function CalendarSection({ events }: CalendarSectionProps) {
  return (
    <section className="bg-cream py-24 lg:py-32">
      <Container>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-16 lg:mb-20 gap-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-forest shrink-0">
            &mdash; 04 / Kalendar
          </p>
          <div className="lg:text-right">
            <h2 className="font-serif text-ink text-[clamp(36px,4.5vw,56px)] leading-[1.1]">
              Co se deje. Co bylo.
            </h2>
            <h2 className="font-serif text-ink text-[clamp(36px,4.5vw,56px)] leading-[1.1] lg:pl-[80px]">
              Kam prijdes.
            </h2>
          </div>
        </div>

        {/* Event rows */}
        <div className="border-t border-forest/20">
          {events.map((event, i) => {
            const isArchived = event.status === 'archived'
            const isDraft = event.status === 'draft'
            const isPublished = event.status === 'published'

            return (
              <div
                key={event.id}
                className={cn(
                  'border-b border-forest/20 transition-colors duration-300',
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
                      <Link
                        href={`/akce/${event.slug}/prihlaska`}
                        className="inline-block bg-orange hover:bg-orange-dark text-cream font-mono text-[11px] uppercase tracking-[0.12em] px-4 py-2.5 rounded-[3px] transition-colors duration-300"
                      >
                        Zarezervovat &rarr;
                      </Link>
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
                      <Link
                        href={`/akce/${event.slug}/prihlaska`}
                        className="inline-block bg-orange hover:bg-orange-dark text-cream font-mono text-[11px] uppercase tracking-[0.12em] px-3 py-2 rounded-[3px] transition-colors duration-300"
                      >
                        Zarezervovat &rarr;
                      </Link>
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
              </div>
            )
          })}
        </div>

        {/* Bottom link */}
        <div className="mt-12 text-center">
          <Link
            href="/akce"
            className="inline-block font-mono text-[13px] uppercase tracking-[0.12em] text-ink border-b-2 border-orange pb-1 hover:text-orange transition-colors duration-300"
          >
            Zobrazit vsechny akce &rarr;
          </Link>
        </div>
      </Container>
    </section>
  )
}
