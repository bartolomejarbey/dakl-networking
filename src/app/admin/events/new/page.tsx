import Link from 'next/link'
import { EventForm } from '../EventForm'

export default function NewEventPage() {
  return (
    <div className="space-y-7 max-w-[1100px]">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">§ Nová akce</p>
        <Link
          href="/admin/events"
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 hover:text-orange transition-colors"
        >
          ← Zpět na list
        </Link>
      </div>
      <h1
        className="font-serif text-cream leading-[0.96] tracking-[-0.022em] text-[clamp(32px,4.5vw,56px)]"
        style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
      >
        Vytvořit vydání.
      </h1>
      <EventForm />
    </div>
  )
}
