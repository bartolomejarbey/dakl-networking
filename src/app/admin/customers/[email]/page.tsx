import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { CustomerActions } from './CustomerActions'
import type { CustomerOverview, Order, CustomerNote, CustomerTag, FollowUp } from '@/types/database'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ email: string }>
}

function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ').format(value).replace(/ /g, ' ') + ' Kč'
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return `${day}.${month}.${String(d.getFullYear()).slice(2)} ${time}`
}

const STATUS_TONE: Record<string, string> = {
  paid: 'text-orange border-orange',
  pending: 'text-cream/55 border-cream/30',
  failed: 'text-orange-dark border-orange-dark',
  refunded: 'text-cream/65 border-cream/40',
  cancelled: 'text-cream/45 border-cream/25',
}

async function fetchData(email: string) {
  const supabase = createAdminClient()
  const [overviewRes, ordersRes, notesRes, tagsRes, followupsRes] = await Promise.all([
    supabase.from('customer_overview').select('*').eq('email', email).maybeSingle<CustomerOverview>(),
    supabase
      .from('orders')
      .select('id, order_number, total_czk, payment_status, created_at, paid_at, event_id, invoice_pdf_url, proforma_pdf_url')
      .eq('customer_email', email)
      .order('created_at', { ascending: false }),
    supabase
      .from('customer_notes')
      .select('*')
      .eq('email', email)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase.from('customer_tags').select('*').eq('email', email).order('created_at', { ascending: true }),
    supabase
      .from('follow_ups')
      .select('*')
      .eq('email', email)
      .order('due_at', { ascending: true })
      .limit(50),
  ])

  return {
    overview: overviewRes.data ?? null,
    orders: (ordersRes.data ?? []) as Array<
      Pick<Order, 'id' | 'order_number' | 'total_czk' | 'payment_status' | 'created_at' | 'paid_at' | 'event_id' | 'invoice_pdf_url' | 'proforma_pdf_url'>
    >,
    notes: (notesRes.data ?? []) as CustomerNote[],
    tags: (tagsRes.data ?? []) as CustomerTag[],
    followups: (followupsRes.data ?? []) as FollowUp[],
  }
}

export default async function CustomerProfilePage({ params }: PageProps) {
  const { email: encoded } = await params
  const email = decodeURIComponent(encoded)
  const data = await fetchData(email)

  if (!data.overview) {
    notFound()
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-baseline lg:justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">§ Zákazník</p>
          <h1
            className="mt-3 font-serif italic text-cream leading-[0.96] tracking-[-0.022em] text-[clamp(28px,4vw,52px)]"
            style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
          >
            {data.overview.full_name ?? email}
          </h1>
          <p className="mt-2 font-mono text-[11px] tracking-[0.18em] uppercase text-cream/65">
            <a href={`mailto:${email}`} className="hover:text-orange transition-colors">{email}</a>
            {data.overview.phone && (
              <>
                {' · '}
                <a href={`tel:${data.overview.phone}`} className="hover:text-orange transition-colors">
                  {data.overview.phone}
                </a>
              </>
            )}
          </p>
        </div>
        <Link
          href="/admin/customers"
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 hover:text-orange transition-colors"
        >
          ← Všichni zákazníci
        </Link>
      </div>

      {/* Lifetime stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Objednávek" value={`${data.overview.paid_order_count}/${data.overview.order_count}`} />
        <Stat label="Lifetime value" value={formatCzk(data.overview.lifetime_value_czk)} />
        <Stat
          label="Poslední aktivita"
          value={data.overview.last_order_at ? formatDateTime(data.overview.last_order_at).split(' ')[0] : '—'}
        />
      </div>

      <CustomerActions
        email={email}
        existingTags={data.tags.map((t) => t.tag)}
        notes={data.notes}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders */}
        <Section title="Objednávky">
          {data.orders.length === 0 ? (
            <p className="font-serif italic text-cream/65">Žádné objednávky.</p>
          ) : (
            <ul className="space-y-3">
              {data.orders.map((o) => (
                <li key={o.id} className="border-b border-cream/10 last:border-b-0 pb-3 last:pb-0">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="flex items-baseline justify-between gap-3 hover:text-orange transition-colors"
                  >
                    <span className="font-mono text-[12px] text-cream tabular-nums">{o.order_number}</span>
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-cream/55">
                      {formatDateTime(o.created_at)}
                    </span>
                  </Link>
                  <div className="flex items-baseline justify-between mt-1">
                    <span
                      className={`inline-block font-mono text-[9px] tracking-[0.22em] uppercase px-1.5 py-0.5 border rounded-[1px] ${
                        STATUS_TONE[o.payment_status] ?? STATUS_TONE.pending
                      }`}
                    >
                      {o.payment_status}
                    </span>
                    <span className="font-mono tabular-nums text-cream/85 text-[14px]">
                      {formatCzk(o.total_czk)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Follow-ups */}
        <Section title="Follow-ups">
          {data.followups.length === 0 ? (
            <p className="font-serif italic text-cream/65">Žádné naplánované follow-ups.</p>
          ) : (
            <ul className="space-y-3">
              {data.followups.map((f) => (
                <li key={f.id} className="border-b border-cream/10 last:border-b-0 pb-3 last:pb-0">
                  <p className="font-serif italic text-cream/85 text-[15px] leading-[1.3]">{f.subject}</p>
                  <div className="flex items-baseline justify-between gap-3 mt-1">
                    <span
                      className={`font-mono text-[9px] tracking-[0.22em] uppercase ${
                        f.status === 'pending' ? 'text-orange' : 'text-cream/45'
                      }`}
                    >
                      {f.status}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-cream/55 tabular-nums">
                      {formatDateTime(f.due_at).split(' ')[0]}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-cream/15 rounded-[1px] p-6">
      <h2 className="font-mono text-[10px] tracking-[0.24em] uppercase text-cream/55 mb-5">
        §&nbsp;{title}
      </h2>
      {children}
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-cream/15 rounded-[1px] p-5">
      <p className="font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55">{label}</p>
      <p className="mt-2 font-mono text-[clamp(22px,3vw,32px)] tabular-nums text-cream">{value}</p>
    </div>
  )
}
