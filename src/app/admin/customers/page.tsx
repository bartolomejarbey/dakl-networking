import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { CustomersFilters } from './CustomersFilters'
import type { CustomerOverview } from '@/types/database'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ q?: string; tag?: string; min_orders?: string }>
}

function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ').format(value).replace(/ /g, ' ') + ' Kč'
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${String(d.getFullYear()).slice(2)}`
}

async function fetchData(params: { q?: string; tag?: string; min_orders?: string }) {
  const supabase = createAdminClient()
  let query = supabase.from('customer_overview').select('*').order('last_order_at', { ascending: false })

  if (params.q) {
    const q = `%${params.q.replace(/[%_]/g, '\\$&')}%`
    query = query.or(`email.ilike.${q},full_name.ilike.${q},phone.ilike.${q}`)
  }
  if (params.tag) {
    query = query.contains('tags', [params.tag])
  }
  if (params.min_orders) {
    query = query.gte('order_count', Math.max(parseInt(params.min_orders, 10), 1))
  }

  const { data: customers } = await query
  const { data: tagsData } = await supabase.from('customer_tags').select('tag').limit(500)
  const tagsSet = new Set(((tagsData ?? []) as { tag: string }[]).map((t) => t.tag))

  return {
    customers: ((customers ?? []) as CustomerOverview[]),
    tags: Array.from(tagsSet).sort(),
  }
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { customers, tags } = await fetchData(params)

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">§ Zákazníci</p>
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 tabular-nums">
          {customers.length} kontaktů
        </p>
      </div>

      <h1
        className="font-serif text-cream leading-[0.96] tracking-[-0.022em] text-[clamp(32px,4.5vw,56px)]"
        style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
      >
        Posádka.
        <span className="block italic text-cream/65 pl-[0.4em]">Zákazníci napříč ročníkem.</span>
      </h1>

      <CustomersFilters tags={tags} totalRows={customers.length} />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="text-left border-b border-cream/15">
              {['E-mail', 'Jméno', 'Objednávky', 'Hodnota', 'Poslední', 'Tagy'].map((h) => (
                <th
                  key={h}
                  className="font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 py-3 pr-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center font-serif italic text-cream/65 text-[18px]">
                  Žádní zákazníci neodpovídají filtru.
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.email} className="border-b border-cream/10 hover:bg-cream/[0.03] transition-colors">
                <td className="py-3 pr-4 font-mono text-cream/85">
                  <Link
                    href={`/admin/customers/${encodeURIComponent(c.email)}`}
                    className="hover:text-orange transition-colors"
                  >
                    {c.email}
                  </Link>
                </td>
                <td className="py-3 pr-4 font-serif italic text-cream/85">{c.full_name ?? '—'}</td>
                <td className="py-3 pr-4 font-mono tabular-nums text-cream">
                  {c.paid_order_count}/{c.order_count}
                </td>
                <td className="py-3 pr-4 font-mono tabular-nums text-cream">
                  {formatCzk(c.lifetime_value_czk)}
                </td>
                <td className="py-3 pr-4 font-mono text-cream/65 tabular-nums">{formatDate(c.last_order_at)}</td>
                <td className="py-3 pr-4">
                  <div className="flex flex-wrap gap-1">
                    {(c.tags ?? []).slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[9px] tracking-[0.18em] uppercase px-2 py-0.5 border border-cream/25 rounded-[1px] text-cream/65"
                      >
                        {tag}
                      </span>
                    ))}
                    {(c.tags ?? []).length > 4 && (
                      <span className="font-mono text-[9px] text-cream/45">
                        +{(c.tags ?? []).length - 4}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
