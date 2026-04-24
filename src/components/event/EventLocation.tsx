import { Container } from '@/components/layout/Container'
import type { Event } from '@/types/database'

interface EventLocationProps {
  event: Event
}

export function EventLocation({ event }: EventLocationProps) {
  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container>
        <h2
          className="font-serif text-ink leading-[1.1] mb-10 text-[clamp(32px,4vw,52px)]"
        >
          Misto
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info */}
          <div>
            {event.location_name && (
              <p className="text-ink font-semibold text-[20px] leading-[1.3] mb-2">
                {event.location_name}
              </p>
            )}
            {event.location_address && (
              <p className="text-ink-soft text-[16px] leading-[1.5] mb-6">
                {event.location_address}
              </p>
            )}
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-soft/70">
              Nejblizsi zastavka: Vyton (tram 2, 3, 17)
            </p>
          </div>

          {/* Map placeholder */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[280px] bg-ink/[0.06] rounded-[4px] flex items-center justify-center">
            <p className="font-mono text-[13px] text-ink-soft/50 tracking-[0.06em]">
              Mapa se nacita...
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
