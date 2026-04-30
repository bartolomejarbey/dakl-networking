'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface FilterOption {
  value: string
  label: string
}

interface OrdersFiltersProps {
  events: FilterOption[]
  totalRows: number
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Zaplaceno' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Vráceno' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function OrdersFilters({ events, totalRows }: OrdersFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString())
    if (value === null || value === '') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    next.delete('page') // reset pagination
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`)
    })
  }

  const event = params.get('event') ?? ''
  const status = params.get('status') ?? ''
  const search = params.get('q') ?? ''

  return (
    <div className="border-b border-cream/15 pb-7 mb-7 space-y-5">
      {/* Search */}
      <label className="block">
        <span className="block font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 mb-2">
          Hledat — e-mail, jméno, číslo objednávky
        </span>
        <input
          type="search"
          defaultValue={search}
          onChange={(e) => setParam('q', e.target.value)}
          placeholder="david@…"
          className="w-full bg-transparent border-b border-cream/25 font-mono text-[14px] text-cream placeholder:text-cream/30 outline-none py-2.5 focus:border-orange transition-colors"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        {/* Event filter */}
        <div>
          <p className="font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 mb-2">
            Akce
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterPill active={event === ''} onClick={() => setParam('event', null)}>
              Všechny
            </FilterPill>
            {events.map((opt) => (
              <FilterPill
                key={opt.value}
                active={event === opt.value}
                onClick={() => setParam('event', opt.value)}
              >
                {opt.label}
              </FilterPill>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <div>
          <p className="font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 mb-2">
            Status
          </p>
          <div className="flex flex-wrap gap-2">
            <FilterPill active={status === ''} onClick={() => setParam('status', null)}>
              Vše
            </FilterPill>
            {STATUS_OPTIONS.map((opt) => (
              <FilterPill
                key={opt.value}
                active={status === opt.value}
                onClick={() => setParam('status', opt.value)}
              >
                {opt.label}
              </FilterPill>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 tabular-nums">
        <span>{pending ? 'Načítám…' : `${totalRows} záznamů`}</span>
        {(event || status || search) && (
          <button
            type="button"
            onClick={() => router.push(pathname)}
            className="text-orange hover:text-cream transition-colors"
          >
            Vyčistit filtry
          </button>
        )}
      </div>
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
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
