import { Container } from '@/components/layout/Container'
import type { Event } from '@/types/database'

interface EventLocationProps {
  event: Event
}

/**
 * Topographic line illustration of the venue, rendered in pure SVG.
 * No external map embed — keeps the editorial mood and avoids tracking.
 */
function TopoIllustration() {
  return (
    <svg
      viewBox="0 0 800 600"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern id="topo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#12201F" strokeOpacity="0.08" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="800" height="600" fill="#F5EFE2" />
      <rect width="800" height="600" fill="url(#topo-grid)" />

      {/* River — bezier curves stacked, simulating topographic Vltava */}
      {[0, 0.06, 0.12, 0.18, 0.24, 0.3, 0.36].map((opacity, i) => (
        <path
          key={i}
          d={`M -50,${320 + i * 16} C 150,${260 + i * 14} 350,${380 + i * 14} 600,${300 + i * 14} S 850,${340 + i * 14} 900,${320 + i * 14}`}
          fill="none"
          stroke="#1E8B85"
          strokeWidth="1"
          strokeOpacity={0.6 - i * 0.07}
        />
      ))}

      {/* Bridge — simple horizontal */}
      <line
        x1="280" y1="280" x2="380" y2="370"
        stroke="#12201F" strokeOpacity="0.3" strokeWidth="2"
        strokeDasharray="6 4"
      />
      <text x="290" y="270" fill="#12201F" fillOpacity="0.5" fontSize="10" fontFamily="monospace" letterSpacing="2">ŽEL.MOST</text>

      {/* Venue marker */}
      <g transform="translate(440, 340)">
        <circle r="6" fill="#E97940" />
        <circle r="14" fill="none" stroke="#E97940" strokeWidth="1" strokeOpacity="0.4" />
        <circle r="22" fill="none" stroke="#E97940" strokeWidth="1" strokeOpacity="0.2" />
        <text x="20" y="5" fill="#E97940" fontSize="10" fontFamily="monospace" letterSpacing="2" fontWeight="600">×&nbsp;MÍSTO</text>
      </g>

      {/* Cardinal compass */}
      <g transform="translate(720, 70)" fontFamily="monospace" fontSize="9" fill="#12201F" fillOpacity="0.55" letterSpacing="2">
        <line x1="0" y1="-20" x2="0" y2="20" stroke="#12201F" strokeOpacity="0.3" />
        <line x1="-20" y1="0" x2="20" y2="0" stroke="#12201F" strokeOpacity="0.3" />
        <text x="-3" y="-25">N</text>
        <text x="-3" y="35">S</text>
        <text x="25" y="3">V</text>
        <text x="-32" y="3">Z</text>
      </g>

      {/* Coordinates */}
      <text x="40" y="560" fill="#12201F" fillOpacity="0.55" fontSize="10" fontFamily="monospace" letterSpacing="2">50.0693° N · 14.4148° V</text>
      <text x="40" y="578" fill="#12201F" fillOpacity="0.4" fontSize="9" fontFamily="monospace" letterSpacing="2">PRAHA · NÁPLAVKA · ŽELEZNIČNÍ MOST</text>
    </svg>
  )
}

export function EventLocation({ event }: EventLocationProps) {
  return (
    <section className="bg-cream text-ink py-24 lg:py-32">
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-14 lg:mb-16">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
            §&nbsp;Lokace
          </p>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/60">
            Praha · Náplavka · 2026
          </p>
        </div>

        <h2
          className="font-serif text-ink leading-[1] tracking-[-0.02em] text-[clamp(36px,5vw,72px)] mb-12 lg:mb-16"
          style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
        >
          Kam se chystáš.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Info */}
          <div className="lg:col-span-5 space-y-7">
            {event.location_name && (
              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 mb-2">
                  Místo
                </p>
                <p className="font-serif italic text-ink text-[28px] lg:text-[32px] leading-[1.15]">
                  {event.location_name}
                </p>
              </div>
            )}
            {event.location_address && (
              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 mb-2">
                  Adresa
                </p>
                <p className="text-ink text-[18px] leading-[1.5]">
                  {event.location_address}
                </p>
              </div>
            )}
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 mb-2">
                Doprava
              </p>
              <ul className="space-y-1.5 font-mono text-[13px] text-ink-soft tabular-nums">
                <li>Tram&nbsp;2,&nbsp;3,&nbsp;17 — Výtoň · 4 min</li>
                <li>Metro B — Karlovo náměstí · 9 min</li>
                <li>Pěšky z Národní · 18 min</li>
              </ul>
            </div>
            {event.location_gps_lat && event.location_gps_lng && (
              <div className="pt-3 border-t border-ink/15 font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft/65 tabular-nums">
                GPS · {event.location_gps_lat.toFixed(4)}°&nbsp;N · {event.location_gps_lng.toFixed(4)}°&nbsp;V
              </div>
            )}
          </div>

          {/* Topo illustration */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1px] border border-ink/15">
              <TopoIllustration />
            </div>
            <p className="mt-3 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55">
              Mapa č. 04 — schematicky · 2026
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
