import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEventById } from '@/lib/events/queries'
import { EventForm } from '../EventForm'
import { StatusActions } from './StatusActions'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params
  const event = await getEventById(id)
  if (!event) notFound()

  return (
    <div className="space-y-7 max-w-[1100px]">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">§ Akce — {event.status}</p>
        <Link
          href="/admin/events"
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 hover:text-orange transition-colors"
        >
          ← Zpět na list
        </Link>
      </div>
      <h1
        className="font-serif italic text-cream leading-[0.96] tracking-[-0.022em] text-[clamp(28px,4vw,52px)]"
        style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
      >
        {event.name}
      </h1>
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/45">
        /akce/{event.slug} · ID {event.id}
      </p>

      <StatusActions eventId={event.id} currentStatus={event.status} />

      <div className="border-t border-cream/15 pt-7">
        <EventForm event={event} />
      </div>
    </div>
  )
}
