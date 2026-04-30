'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface CustomersFiltersProps {
  tags: string[]
  totalRows: number
}

export function CustomersFilters({ tags, totalRows }: CustomersFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString())
    if (value === null || value === '') next.delete(key)
    else next.set(key, value)
    startTransition(() => router.push(`${pathname}?${next.toString()}`))
  }

  const q = params.get('q') ?? ''
  const tag = params.get('tag') ?? ''
  const minOrders = params.get('min_orders') ?? ''

  return (
    <div className="border-b border-cream/15 pb-7 mb-7 space-y-5">
      <label className="block">
        <span className="block font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 mb-2">
          Hledat — e-mail, jméno, telefon
        </span>
        <input
          type="search"
          defaultValue={q}
          onChange={(e) => setParam('q', e.target.value)}
          placeholder="…"
          className="w-full bg-transparent border-b border-cream/25 font-mono text-[14px] text-cream placeholder:text-cream/30 outline-none py-2.5 focus:border-orange transition-colors"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        {tags.length > 0 && (
          <div>
            <p className="font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 mb-2">Tag</p>
            <div className="flex flex-wrap gap-2">
              <Pill active={tag === ''} onClick={() => setParam('tag', null)}>Vše</Pill>
              {tags.map((t) => (
                <Pill key={t} active={tag === t} onClick={() => setParam('tag', t)}>{t}</Pill>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 mb-2">
            Min. objednávek
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { v: '', l: 'Vše' },
              { v: '1', l: '≥ 1' },
              { v: '2', l: '≥ 2' },
              { v: '3', l: '≥ 3' },
            ].map((opt) => (
              <Pill key={opt.v} active={minOrders === opt.v} onClick={() => setParam('min_orders', opt.v || null)}>
                {opt.l}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 tabular-nums">
        <span>{pending ? 'Načítám…' : `${totalRows} záznamů`}</span>
        {(q || tag || minOrders) && (
          <button type="button" onClick={() => router.push(pathname)} className="text-orange hover:text-cream transition-colors">
            Vyčistit filtry
          </button>
        )}
      </div>
    </div>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'font-mono text-[10px] tracking-[0.22em] uppercase px-3 py-1.5 rounded-[1px] border transition-colors',
        active
          ? 'bg-orange border-orange text-cream'
          : 'bg-transparent border-cream/25 text-cream/65 hover:border-cream hover:text-cream'
      )}
    >
      [&nbsp;{children}&nbsp;]
    </button>
  )
}
