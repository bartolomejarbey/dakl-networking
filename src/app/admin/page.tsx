import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Order, FollowUp, Event } from '@/types/database'

export const dynamic = 'force-dynamic'

function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ').format(value).replace(/ /g, ' ') + ' Kč'
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString('cs-CZ', { month: 'short' }).replace('.', '')
}

function StatCard({
  number,
  label,
  hint,
  tone = 'cream',
  href,
}: {
  number: string
  label: string
  hint?: string
  tone?: 'cream' | 'orange' | 'forest'
  href?: string
}) {
  const toneClasses = {
    cream: 'border-cream/15',
    orange: 'border-orange/40 bg-orange/5',
    forest: 'border-forest-glow/40 bg-forest-glow/5',
  }
  const inner = (
    <div className={`p-6 border rounded-[1px] ${toneClasses[tone]} h-full transition-colors hover:border-cream/40`}>
      <p className="font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55">{label}</p>
      <p className="mt-3 font-mono text-[clamp(28px,4vw,44px)] tabular-nums leading-none text-cream">
        {number}
      </p>
      {hint && (
        <p className="mt-3 font-mono text-[10px] tracking-[0.18em] uppercase text-cream/55">
          {hint}
        </p>
      )}
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

interface MonthBucket {
  label: string
  iso: string
  total: number
}

async function getDashboardData() {
  const supabase = createAdminClient()
  const now = new Date()
  const startMonth = startOfMonth(now)
  const startYear12 = new Date(now.getFullYear(), now.getMonth() - 11, 1)
  const start30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [revenueMonthRes, last30Res, followupsRes, nextEventRes, last12Res] = await Promise.all([
    supabase
      .from('orders')
      .select('total_czk, payment_status, paid_at')
      .eq('payment_status', 'paid')
      .gte('paid_at', startMonth.toISOString()),
    supabase
      .from('orders')
      .select('id, payment_status, created_at')
      .gte('created_at', start30d.toISOString()),
    supabase
      .from('follow_ups')
      .select('id, status, due_at')
      .eq('status', 'pending')
      .lte('due_at', new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('events')
      .select('id, name, slug, capacity, starts_at, status')
      .in('status', ['published', 'draft'])
      .gte('starts_at', now.toISOString())
      .order('starts_at', { ascending: true })
      .limit(1)
      .maybeSingle<Pick<Event, 'id' | 'name' | 'slug' | 'capacity' | 'starts_at' | 'status'>>(),
    supabase
      .from('orders')
      .select('total_czk, paid_at')
      .eq('payment_status', 'paid')
      .gte('paid_at', startYear12.toISOString()),
  ])

  const revenueThisMonth = ((revenueMonthRes.data ?? []) as Array<Pick<Order, 'total_czk'>>).reduce(
    (sum, r) => sum + (r.total_czk ?? 0),
    0
  )

  const last30 = (last30Res.data ?? []) as Array<Pick<Order, 'payment_status'>>
  const totalCreated = last30.length
  const totalPaid = last30.filter((o) => o.payment_status === 'paid').length
  const conversionRate = totalCreated === 0 ? 0 : Math.round((totalPaid / totalCreated) * 100)

  const pendingFollowUps = ((followupsRes.data ?? []) as Array<Pick<FollowUp, 'id'>>).length

  const nextEvent = nextEventRes.data ?? null
  let nextEventOccupancy: { sold: number; capacity: number } | null = null
  if (nextEvent?.id) {
    const occRes = await supabase.rpc(
      'get_availability' as never,
      { p_event_id: nextEvent.id } as never
    )
    const occRows = (occRes.data ?? []) as Array<{ capacity: number; sold: number; available: number }>
    if (occRows.length > 0) {
      nextEventOccupancy = { sold: occRows[0].sold, capacity: occRows[0].capacity }
    } else {
      nextEventOccupancy = { sold: 0, capacity: nextEvent.capacity }
    }
  }

  // Bucket last-12-month revenue
  const buckets: MonthBucket[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({ label: monthLabel(d), iso: d.toISOString(), total: 0 })
  }
  for (const row of (last12Res.data ?? []) as Array<Pick<Order, 'total_czk' | 'paid_at'>>) {
    if (!row.paid_at) continue
    const paidMonth = startOfMonth(new Date(row.paid_at)).toISOString()
    const bucket = buckets.find((b) => b.iso === paidMonth)
    if (bucket) bucket.total += row.total_czk ?? 0
  }
  const maxBucket = Math.max(...buckets.map((b) => b.total), 1)

  return {
    revenueThisMonth,
    conversionRate,
    pendingFollowUps,
    nextEvent,
    nextEventOccupancy,
    buckets,
    maxBucket,
    totalCreatedLast30: totalCreated,
    totalPaidLast30: totalPaid,
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()
  const monthLabelStr = new Date().toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })
  const occupancyPercent =
    data.nextEventOccupancy && data.nextEventOccupancy.capacity > 0
      ? Math.round((data.nextEventOccupancy.sold / data.nextEventOccupancy.capacity) * 100)
      : 0

  return (
    <div className="space-y-12">
      {/* Folio header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
          §&nbsp;Přehled — Redakce
        </p>
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55">
          {monthLabelStr}
        </p>
      </div>

      <h1
        className="font-serif text-cream leading-[0.96] tracking-[-0.022em] text-[clamp(36px,5vw,72px)]"
        style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
      >
        Krátký souhrn.
        <span className="block italic text-cream/65 pl-[0.4em]">Dnešní stav redakce.</span>
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tržby tento měsíc"
          number={formatCzk(data.revenueThisMonth)}
          tone="orange"
          href="/admin/orders?paid=1"
        />
        <StatCard
          label="Konverze · 30 dní"
          number={`${data.conversionRate} %`}
          hint={`${data.totalPaidLast30}/${data.totalCreatedLast30} objednávek`}
          href="/admin/orders"
        />
        <StatCard
          label={data.nextEvent ? 'Obsazenost příští akce' : 'Další akce'}
          number={
            data.nextEventOccupancy
              ? `${data.nextEventOccupancy.sold}/${data.nextEventOccupancy.capacity}`
              : '—'
          }
          hint={data.nextEvent?.name ?? 'Žádná naplánovaná'}
          href={data.nextEvent ? `/admin/events/${data.nextEvent.id}` : '/admin/events'}
        />
        <StatCard
          label="Follow-ups dnes"
          number={String(data.pendingFollowUps)}
          tone={data.pendingFollowUps > 0 ? 'orange' : 'cream'}
          hint="Splatné dnes nebo zpožděné"
          href="/admin/followups"
        />
      </div>

      {/* Occupancy detail (if event) */}
      {data.nextEvent && data.nextEventOccupancy && (
        <div className="border border-cream/15 rounded-[1px] p-6">
          <div className="flex items-baseline justify-between mb-4">
            <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-cream/55">
              §&nbsp;Příští vydání
            </p>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 tabular-nums">
              {new Date(data.nextEvent.starts_at).toLocaleDateString('cs-CZ', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              })}
            </p>
          </div>
          <p className="font-serif italic text-[clamp(22px,3vw,32px)] leading-[1.2] text-cream mb-5">
            {data.nextEvent.name}
          </p>
          <div className="relative h-2 bg-cream/10 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-orange transition-all"
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
          <p className="mt-3 font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 tabular-nums">
            {data.nextEventOccupancy.sold} / {data.nextEventOccupancy.capacity} ({occupancyPercent} %)
          </p>
        </div>
      )}

      {/* 12-month revenue chart */}
      <div className="border border-cream/15 rounded-[1px] p-6">
        <div className="flex items-baseline justify-between mb-6">
          <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-cream/55">
            §&nbsp;Tržby — posledních 12 měsíců
          </p>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55">
            Max {formatCzk(data.maxBucket)}
          </p>
        </div>
        <div className="flex items-end gap-2 h-[180px]">
          {data.buckets.map((bucket) => {
            const heightPct = data.maxBucket > 0 ? (bucket.total / data.maxBucket) * 100 : 0
            return (
              <div key={bucket.iso} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full bg-cream/15 group-hover:bg-orange transition-colors rounded-[1px]"
                    style={{ height: `${Math.max(heightPct, bucket.total > 0 ? 4 : 1)}%` }}
                    title={formatCzk(bucket.total)}
                  />
                </div>
                <span className="font-mono text-[8px] tracking-[0.18em] uppercase text-cream/45">
                  {bucket.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
