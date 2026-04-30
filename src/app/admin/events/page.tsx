import Link from 'next/link'
import { listAdminEvents } from '@/lib/events/queries'
import { cn, formatCZK, formatDateDot } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const STATUS_TONE: Record<string, string> = {
  draft: 'text-cream/55 border-cream/30',
  published: 'text-orange border-orange',
  archived: 'text-cream/45 border-cream/25',
  cancelled: 'text-orange-dark border-orange-dark',
}

export default async function AdminEventsPage() {
  const events = await listAdminEvents()

  return (
    <div className="space-y-7">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">§ Akce</p>
        <Link
          href="/admin/events/new"
          className="font-mono text-[11px] tracking-[0.22em] uppercase font-semibold px-4 py-2.5 border-2 border-orange bg-orange text-cream hover:bg-orange-dark transition-colors rounded-[1px]"
        >
          Nová akce →
        </Link>
      </div>

      <h1
        className="font-serif text-cream leading-[0.96] tracking-[-0.022em] text-[clamp(32px,4.5vw,56px)]"
        style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
      >
        Vydání.
        <span className="block italic text-cream/65 pl-[0.4em]">Obsah ročníku IV.</span>
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="text-left border-b border-cream/15">
              {['Datum', 'Název', 'Typ', 'Cena', 'Kapacita', 'Status'].map((h) => (
                <th key={h} className="font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 py-3 pr-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center font-serif italic text-cream/65 text-[18px]">
                  Žádné akce. Vytvoř první.
                </td>
              </tr>
            )}
            {events.map((event) => (
              <tr key={event.id} className="border-b border-cream/10 hover:bg-cream/[0.03] transition-colors">
                <td className="py-3 pr-4 font-mono tabular-nums text-cream">{formatDateDot(event.starts_at)}</td>
                <td className="py-3 pr-4">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="font-serif italic text-cream hover:text-orange transition-colors text-[16px]"
                  >
                    {event.name}
                  </Link>
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-cream/45 mt-0.5">
                    /akce/{event.slug}
                  </p>
                </td>
                <td className="py-3 pr-4 font-mono text-[11px] tracking-[0.16em] uppercase text-cream/65">
                  {event.type}
                </td>
                <td className="py-3 pr-4 font-mono tabular-nums text-cream">{formatCZK(event.price_czk)}</td>
                <td className="py-3 pr-4 font-mono tabular-nums text-cream/65">{event.capacity}</td>
                <td className="py-3 pr-4">
                  <span
                    className={cn(
                      'inline-block font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-1 border rounded-[1px]',
                      STATUS_TONE[event.status] ?? STATUS_TONE.draft
                    )}
                  >
                    {event.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
