import { createAdminClient } from '@/lib/supabase/admin'
import { IssuerForm } from './IssuerForm'
import { isPlaceholderIssuer } from '@/lib/invoicing/issuer'
import type { IssuerSettings } from '@/types/database'

export const dynamic = 'force-dynamic'

async function getIssuer(key: 'issuer_payer' | 'issuer_nonpayer'): Promise<IssuerSettings> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single<{ value: IssuerSettings }>()
  return data!.value
}

async function getInvoiceSeries(): Promise<{ prefix: string; current: number }> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'invoice_series')
    .single<{ value: { prefix: string; current: number } }>()
  return data?.value ?? { prefix: 'CN-2026-', current: 0 }
}

export default async function AdminSettingsPage() {
  const [payer, nonpayer, series] = await Promise.all([
    getIssuer('issuer_payer'),
    getIssuer('issuer_nonpayer'),
    getInvoiceSeries(),
  ])

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">§ Nastavení</p>
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55">
          Issuer + invoice series
        </p>
      </div>

      <h1
        className="font-serif text-cream leading-[0.96] tracking-[-0.022em] text-[clamp(32px,4.5vw,56px)]"
        style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
      >
        Nastavení.
        <span className="block italic text-cream/65 pl-[0.4em]">Identita firem na fakturách.</span>
      </h1>

      {(isPlaceholderIssuer(payer) || isPlaceholderIssuer(nonpayer)) && (
        <div className="border border-orange/40 bg-orange/5 px-5 py-4 rounded-[1px]">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-orange leading-[1.55]">
            Pozor — issuer data jsou stále placeholder. Vyplň reálné údaje obou firem,
            jinak budou faktury obsahovat text „— placeholder" v hlavičce.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <section className="border border-cream/15 rounded-[1px] p-6">
          <IssuerForm issuerKey="issuer_payer" initial={payer} />
        </section>
        <section className="border border-cream/15 rounded-[1px] p-6">
          <IssuerForm issuerKey="issuer_nonpayer" initial={nonpayer} />
        </section>
      </div>

      <section className="border border-cream/15 rounded-[1px] p-6 max-w-[600px]">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-4">
          § Číslování faktur
        </p>
        <div className="flex items-baseline gap-6">
          <div>
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-cream/55 mb-1">
              Aktuální prefix
            </p>
            <p className="font-mono text-[24px] tabular-nums text-cream">{series.prefix}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-cream/55 mb-1">
              Poslední číslo
            </p>
            <p className="font-mono text-[24px] tabular-nums text-cream">
              {String(series.current).padStart(4, '0')}
            </p>
          </div>
        </div>
        <p className="mt-5 font-mono text-[10px] tracking-[0.18em] uppercase text-cream/55 leading-[1.6]">
          Sequence se inkrementuje automaticky při každé objednávce. Změna prefixu (např. nový rok)
          provedena přes /admin/settings → API.
        </p>
      </section>
    </div>
  )
}
