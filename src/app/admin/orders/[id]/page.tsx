import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { OrderActions } from './OrderActions'
import type { Order, OrderEvent, Event, IssuerSettings } from '@/types/database'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ').format(value).replace(/ /g, ' ') + ' Kč'
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return `${day}.${month}.${d.getFullYear()} · ${time}`
}

const STATUS_TONE: Record<string, { label: string; tone: string }> = {
  pending: { label: 'Pending', tone: 'text-cream/55 border-cream/30' },
  paid: { label: 'Zaplaceno', tone: 'text-orange border-orange' },
  failed: { label: 'Failed', tone: 'text-orange-dark border-orange-dark' },
  refunded: { label: 'Vráceno', tone: 'text-cream/65 border-cream/40' },
  cancelled: { label: 'Cancelled', tone: 'text-cream/45 border-cream/25' },
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = createAdminClient()

  const [orderRes, eventsRes] = await Promise.all([
    supabase.from('orders').select('*').eq('id', id).single<Order>(),
    null,
  ])

  if (orderRes.error || !orderRes.data) {
    notFound()
  }

  const order = orderRes.data

  let event: Pick<Event, 'name' | 'starts_at' | 'location_name' | 'location_address'> | null = null
  if (order.event_id) {
    const { data: ev } = await supabase
      .from('events')
      .select('name, starts_at, location_name, location_address')
      .eq('id', order.event_id)
      .single<Pick<Event, 'name' | 'starts_at' | 'location_name' | 'location_address'>>()
    event = ev ?? null
  }

  const { data: timelineRaw } = await supabase
    .from('order_events')
    .select('*')
    .eq('order_id', id)
    .order('created_at', { ascending: false })
  const timeline = (timelineRaw ?? []) as OrderEvent[]

  const issuer = order.issuer_snapshot as IssuerSettings | null

  const status = STATUS_TONE[order.payment_status] ?? STATUS_TONE.pending
  const isPaid = order.payment_status === 'paid'
  const hasInvoice = Boolean(order.invoice_pdf_url || order.proforma_pdf_url)

  // VAT breakdown for display
  const isVatPayer = issuer?.is_vat_payer ?? false
  const vatRate = issuer?.vat_rate ?? 0
  const baseAmount = isVatPayer ? Math.round(order.total_czk / (1 + vatRate / 100)) : order.total_czk
  const vatAmount = isVatPayer ? order.total_czk - baseAmount : 0

  return (
    <div className="space-y-10">
      {/* Folio header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-baseline lg:justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
            §&nbsp;Objednávka
          </p>
          <h1
            className="mt-3 font-mono tabular-nums text-cream text-[clamp(28px,3.6vw,44px)] leading-none tracking-[-0.01em]"
          >
            {order.order_number}
          </h1>
        </div>
        <div className="flex flex-col items-start lg:items-end gap-2">
          <span
            className={`inline-block font-mono text-[10px] tracking-[0.22em] uppercase px-3 py-1.5 border rounded-[1px] ${status.tone}`}
          >
            {status.label}
          </span>
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 tabular-nums">
            Vytvořeno {formatDateTime(order.created_at)}
          </span>
          <Link
            href="/admin/orders"
            className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 hover:text-orange transition-colors"
          >
            ← Všechny objednávky
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer */}
          <Section title="Zákazník">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <Field label="Jméno" value={`${order.customer_first_name} ${order.customer_last_name}`} />
              <Field label="E-mail" value={order.customer_email} mono link={`mailto:${order.customer_email}`} />
              {order.customer_phone && (
                <Field label="Telefon" value={order.customer_phone} mono link={`tel:${order.customer_phone}`} />
              )}
              <Field
                label="Typ zákazníka"
                value={
                  order.is_company
                    ? `Firma (${order.customer_is_vat_payer ? 'plátce DPH' : 'neplátce'})`
                    : 'Fyzická osoba'
                }
              />
              {order.is_company && order.company_name && (
                <Field label="Firma" value={order.company_name} />
              )}
              {order.company_ico && <Field label="IČO" value={order.company_ico} mono />}
              {order.company_dic && <Field label="DIČ" value={order.company_dic} mono />}
              {(order.billing_address || order.billing_city) && (
                <Field
                  label="Fakturační adresa"
                  value={[order.billing_address, order.billing_zip, order.billing_city]
                    .filter(Boolean)
                    .join(', ')}
                />
              )}
            </div>
            <div className="mt-5 pt-5 border-t border-cream/15 flex justify-end">
              <Link
                href={`/admin/customers/${encodeURIComponent(order.customer_email)}`}
                className="font-mono text-[10px] tracking-[0.22em] uppercase text-orange hover:text-cream transition-colors"
              >
                Profil zákazníka →
              </Link>
            </div>
          </Section>

          {/* Event */}
          {event && (
            <Section title="Akce">
              <p className="font-serif italic text-[clamp(20px,2.6vw,28px)] leading-[1.2] text-cream">
                {event.name}
              </p>
              <p className="mt-3 font-mono text-[11px] tracking-[0.18em] uppercase text-cream/65 tabular-nums">
                {formatDateTime(event.starts_at)}
              </p>
              {(event.location_name || event.location_address) && (
                <p className="mt-1 font-mono text-[11px] tracking-[0.18em] uppercase text-cream/55">
                  {[event.location_name, event.location_address].filter(Boolean).join(' · ')}
                </p>
              )}
            </Section>
          )}

          {/* Line items + totals */}
          <Section title="Položky">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left">
                  {['Popis', 'Ks', isVatPayer ? 'Bez DPH' : 'Cena', 'Celkem'].map((h, i) => (
                    <th
                      key={h}
                      className={`font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 py-2 ${i > 0 ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-cream/10">
                  <td className="py-3 font-serif italic text-cream">
                    Vstupné · {event?.name ?? 'DaKl Networking'}
                  </td>
                  <td className="py-3 text-right font-mono tabular-nums">{order.quantity}×</td>
                  <td className="py-3 text-right font-mono tabular-nums">
                    {formatCzk(isVatPayer ? Math.round(order.unit_price_czk / (1 + vatRate / 100)) : order.unit_price_czk)}
                  </td>
                  <td className="py-3 text-right font-mono tabular-nums">
                    {formatCzk(isVatPayer ? baseAmount : order.total_czk)}
                  </td>
                </tr>
                {isVatPayer && (
                  <tr className="border-t border-cream/10">
                    <td colSpan={3} className="py-2 font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 text-right">
                      DPH {vatRate} %
                    </td>
                    <td className="py-2 text-right font-mono tabular-nums">{formatCzk(vatAmount)}</td>
                  </tr>
                )}
                <tr className="border-t border-cream/30">
                  <td colSpan={3} className="py-3 font-mono text-[11px] tracking-[0.22em] uppercase text-cream text-right">
                    K úhradě
                  </td>
                  <td className="py-3 text-right font-mono tabular-nums text-cream text-[18px]">
                    {formatCzk(order.total_czk)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Issuer snapshot */}
          {issuer && (
            <Section title="Vystavila">
              <p className="font-serif italic text-[20px] text-cream">{issuer.name}</p>
              <p className="mt-2 font-mono text-[11px] tracking-[0.18em] uppercase text-cream/65">
                IČO {issuer.ico}
                {issuer.dic ? ` · DIČ ${issuer.dic}` : ' · neplátce DPH'}
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.18em] uppercase text-cream/45">
                Issuer key: {order.issuer_key ?? '—'}
              </p>
            </Section>
          )}

          {/* PDF preview */}
          {(order.invoice_pdf_url || order.proforma_pdf_url) && (
            <Section title={order.invoice_pdf_url ? 'Faktura PDF' : 'Proforma PDF'}>
              <div className="aspect-[3/4] w-full max-w-[560px] mx-auto bg-cream/5 border border-cream/15">
                <iframe
                  src={order.invoice_pdf_url || order.proforma_pdf_url || ''}
                  className="w-full h-full"
                  title="PDF preview"
                />
              </div>
              <div className="mt-4 text-center">
                <a
                  href={order.invoice_pdf_url || order.proforma_pdf_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] tracking-[0.22em] uppercase text-orange hover:text-cream transition-colors"
                >
                  Otevřít v novém tabu ↗
                </a>
              </div>
            </Section>
          )}
        </div>

        {/* RIGHT — actions + timeline */}
        <div className="space-y-6">
          <Section title="Akce">
            <OrderActions orderId={order.id} isPaid={isPaid} hasInvoice={hasInvoice} />
          </Section>

          <Section title="Časová osa">
            <ol className="space-y-4">
              {timeline.length === 0 && (
                <li className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/45">
                  Žádné události
                </li>
              )}
              {timeline.map((evt) => (
                <li key={evt.id} className="border-l border-cream/15 pl-4 -ml-1">
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-orange">
                    {evt.event_type}
                  </p>
                  {evt.description && (
                    <p className="mt-1 font-serif italic text-cream/85 text-[14px] leading-[1.4]">
                      {evt.description}
                    </p>
                  )}
                  <p className="mt-1 font-mono text-[9px] tracking-[0.22em] uppercase text-cream/45 tabular-nums">
                    {formatDateTime(evt.created_at)}
                  </p>
                </li>
              ))}
            </ol>
          </Section>
        </div>
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

function Field({
  label,
  value,
  mono,
  link,
}: {
  label: string
  value: string
  mono?: boolean
  link?: string
}) {
  const inner = mono ? (
    <span className="font-mono text-[13px] text-cream tabular-nums">{value}</span>
  ) : (
    <span className="text-cream">{value}</span>
  )
  return (
    <div>
      <p className="font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 mb-1.5">
        {label}
      </p>
      {link ? (
        <a href={link} className="hover:text-orange transition-colors">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  )
}
