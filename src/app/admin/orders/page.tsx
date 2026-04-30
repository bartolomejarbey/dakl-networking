import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { OrdersFilters } from './OrdersFilters'
import { cn } from '@/lib/utils'
import type { Order, Event, PaymentStatus } from '@/types/database'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    event?: string
    status?: string
    q?: string
    page?: string
  }>
}

const PAGE_SIZE = 50

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

const STATUS_LABEL: Record<string, { label: string; tone: string }> = {
  pending: { label: 'Pending', tone: 'text-cream/55 border-cream/30' },
  paid: { label: 'Zaplaceno', tone: 'text-orange border-orange' },
  failed: { label: 'Failed', tone: 'text-orange-dark border-orange-dark' },
  refunded: { label: 'Vráceno', tone: 'text-cream/65 border-cream/40' },
  cancelled: { label: 'Cancelled', tone: 'text-cream/45 border-cream/25' },
}

async function fetchData(params: {
  event?: string
  status?: string
  q?: string
  page?: string
}) {
  const supabase = createAdminClient()
  const offset = (Math.max(parseInt(params.page ?? '1', 10), 1) - 1) * PAGE_SIZE

  let query = supabase
    .from('orders')
    .select(
      `id, order_number, event_id, customer_email, customer_first_name, customer_last_name,
       quantity, total_czk, payment_status, payment_method, paid_at, created_at,
       customer_is_vat_payer, invoice_pdf_url, proforma_pdf_url, is_company`,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (params.event) {
    query = query.eq('event_id', params.event)
  }
  if (params.status) {
    query = query.eq('payment_status', params.status as PaymentStatus)
  }
  if (params.q) {
    const q = `%${params.q.replace(/[%_]/g, '\\$&')}%`
    query = query.or(
      `customer_email.ilike.${q},customer_first_name.ilike.${q},customer_last_name.ilike.${q},order_number.ilike.${q}`
    )
  }

  const [ordersRes, eventsRes] = await Promise.all([
    query,
    supabase.from('events').select('id, name, slug').order('starts_at', { ascending: false }),
  ])

  type OrderRow = Pick<
    Order,
    'id' | 'order_number' | 'event_id' | 'customer_email' | 'customer_first_name' | 'customer_last_name'
    | 'quantity' | 'total_czk' | 'payment_status' | 'payment_method' | 'paid_at' | 'created_at'
    | 'customer_is_vat_payer' | 'invoice_pdf_url' | 'proforma_pdf_url' | 'is_company'
  >

  const orders = (ordersRes.data ?? []) as OrderRow[]
  const totalCount = ordersRes.count ?? 0
  const events = ((eventsRes.data ?? []) as Pick<Event, 'id' | 'name' | 'slug'>[]).map((e) => ({
    value: e.id,
    label: e.name,
  }))
  const eventNameById = new Map(events.map((e) => [e.value, e.label]))

  return { orders, totalCount, events, eventNameById }
}

export default async function OrdersListPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { orders, totalCount, events, eventNameById } = await fetchData(params)
  const page = Math.max(parseInt(params.page ?? '1', 10), 1)
  const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1)

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
          §&nbsp;Objednávky
        </p>
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 tabular-nums">
          {totalCount} celkem
        </p>
      </div>

      <h1
        className="font-serif text-cream leading-[0.98] tracking-[-0.022em] text-[clamp(32px,4.5vw,56px)]"
        style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
      >
        Objednávky.
        <span className="block italic text-cream/65 pl-[0.4em]">Co se právě děje.</span>
      </h1>

      <OrdersFilters events={events} totalRows={totalCount} />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="text-left">
              {['Číslo', 'Datum', 'Zákazník', 'Akce', 'Částka', 'Stav', 'Faktura'].map((h) => (
                <th
                  key={h}
                  className="font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 py-3 pr-4 border-b border-cream/15"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center font-serif italic text-cream/65 text-[18px]">
                  Žádné objednávky neodpovídají filtru.
                </td>
              </tr>
            )}
            {orders.map((order) => {
              const status = STATUS_LABEL[order.payment_status] ?? STATUS_LABEL.pending
              return (
                <tr
                  key={order.id}
                  className="border-b border-cream/10 hover:bg-cream/[0.03] transition-colors"
                >
                  <td className="py-3.5 pr-4 font-mono tabular-nums text-cream/85">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-orange transition-colors">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-cream/65 tabular-nums">
                    {formatDateTime(order.created_at)}
                  </td>
                  <td className="py-3.5 pr-4">
                    <Link
                      href={`/admin/customers/${encodeURIComponent(order.customer_email)}`}
                      className="block group"
                    >
                      <span className="text-cream group-hover:text-orange transition-colors">
                        {order.customer_first_name} {order.customer_last_name}
                      </span>
                      <span className="block font-mono text-[11px] text-cream/55">
                        {order.customer_email}
                      </span>
                      {order.is_company && (
                        <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-cream/40">
                          Firma · {order.customer_is_vat_payer ? 'plátce DPH' : 'neplátce'}
                        </span>
                      )}
                    </Link>
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-[12px] text-cream/65">
                    {eventNameById.get(order.event_id ?? '') ?? '—'}
                  </td>
                  <td className="py-3.5 pr-4 font-mono tabular-nums text-cream">
                    {formatCzk(order.total_czk)}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={cn(
                        'inline-block font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-1 border rounded-[1px]',
                        status.tone
                      )}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-[10px] tracking-[0.18em] uppercase">
                    {order.invoice_pdf_url ? (
                      <a
                        href={order.invoice_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange hover:text-cream transition-colors"
                      >
                        Faktura ↗
                      </a>
                    ) : order.proforma_pdf_url ? (
                      <a
                        href={order.proforma_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cream/65 hover:text-orange transition-colors"
                      >
                        Proforma ↗
                      </a>
                    ) : (
                      <span className="text-cream/30">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-cream/65 pt-4">
          <span>
            Strana {page} / {totalPages}
          </span>
          <div className="flex gap-3">
            {page > 1 && (
              <Link
                href={{ query: { ...params, page: String(page - 1) } }}
                className="text-cream hover:text-orange transition-colors"
              >
                ← Předchozí
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={{ query: { ...params, page: String(page + 1) } }}
                className="text-cream hover:text-orange transition-colors"
              >
                Další →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
