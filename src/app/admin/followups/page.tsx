import { createAdminClient } from '@/lib/supabase/admin'
import { FollowUpRow } from './FollowUpRow'
import type { FollowUp } from '@/types/database'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ filter?: 'all' | 'done' | 'cancelled' }>
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

interface Buckets {
  overdue: FollowUp[]
  today: FollowUp[]
  tomorrow: FollowUp[]
  thisWeek: FollowUp[]
  later: FollowUp[]
}

function bucketByDue(items: FollowUp[]): Buckets {
  const now = new Date()
  const today = startOfDay(now)
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  const inAWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const buckets: Buckets = { overdue: [], today: [], tomorrow: [], thisWeek: [], later: [] }
  for (const item of items) {
    const due = new Date(item.due_at)
    if (due < today) buckets.overdue.push(item)
    else if (due < tomorrow) buckets.today.push(item)
    else if (due < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)) buckets.tomorrow.push(item)
    else if (due < inAWeek) buckets.thisWeek.push(item)
    else buckets.later.push(item)
  }
  return buckets
}

export default async function FollowUpsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filter = params.filter ?? 'all'

  const supabase = createAdminClient()
  let query = supabase.from('follow_ups').select('*').order('due_at', { ascending: true })
  if (filter === 'all') {
    query = query.eq('status', 'pending')
  } else {
    query = query.eq('status', filter)
  }
  const { data } = await query
  const items = (data ?? []) as FollowUp[]
  const buckets = bucketByDue(items)
  const total = items.length

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">§ Follow-ups</p>
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 tabular-nums">
          {total} aktivních
        </p>
      </div>

      <h1
        className="font-serif text-cream leading-[0.96] tracking-[-0.022em] text-[clamp(32px,4.5vw,56px)]"
        style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
      >
        Inbox.
        <span className="block italic text-cream/65 pl-[0.4em]">Co potřebuje akci.</span>
      </h1>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-cream/15 pb-4 -mb-2">
        {[
          { v: 'all', l: 'Aktivní' },
          { v: 'done', l: 'Hotové' },
          { v: 'cancelled', l: 'Zrušené' },
        ].map((opt) => (
          <a
            key={opt.v}
            href={opt.v === 'all' ? '/admin/followups' : `/admin/followups?filter=${opt.v}`}
            className={`font-mono text-[10px] tracking-[0.22em] uppercase px-3 py-1.5 rounded-[1px] border transition-colors ${
              filter === opt.v
                ? 'bg-orange border-orange text-cream'
                : 'bg-transparent border-cream/25 text-cream/65 hover:border-cream hover:text-cream'
            }`}
          >
            [&nbsp;{opt.l}&nbsp;]
          </a>
        ))}
      </div>

      {filter === 'all' ? (
        <div className="space-y-10">
          <Bucket title="Po splatnosti" tone="warn" items={buckets.overdue} />
          <Bucket title="Dnes" items={buckets.today} />
          <Bucket title="Zítra" items={buckets.tomorrow} />
          <Bucket title="Tento týden" items={buckets.thisWeek} />
          <Bucket title="Později" items={buckets.later} />
        </div>
      ) : (
        <ul className="space-y-3">
          {items.length === 0 ? (
            <p className="font-serif italic text-cream/65 text-[18px]">Žádné záznamy.</p>
          ) : (
            items.map((f) => <FollowUpRow key={f.id} followUp={f} />)
          )}
        </ul>
      )}
    </div>
  )
}

function Bucket({
  title,
  items,
  tone = 'default',
}: {
  title: string
  items: FollowUp[]
  tone?: 'default' | 'warn'
}) {
  if (items.length === 0) return null
  return (
    <section className="space-y-4">
      <p
        className={`font-mono text-[10px] tracking-[0.24em] uppercase ${
          tone === 'warn' ? 'text-orange-dark' : 'text-orange'
        }`}
      >
        §&nbsp;{title} · {items.length}
      </p>
      <ul className="space-y-3">
        {items.map((f) => (
          <FollowUpRow key={f.id} followUp={f} />
        ))}
      </ul>
    </section>
  )
}
