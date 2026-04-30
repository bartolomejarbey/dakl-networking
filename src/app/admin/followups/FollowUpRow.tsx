'use client'

import { useTransition, useState } from 'react'
import Link from 'next/link'
import { updateFollowUpStatus } from '@/app/admin/orders/[id]/actions'
import type { FollowUp } from '@/types/database'
import { cn } from '@/lib/utils'

interface FollowUpRowProps {
  followUp: FollowUp
}

export function FollowUpRow({ followUp }: FollowUpRowProps) {
  const [pending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<string | null>(null)

  const change = (status: 'done' | 'snoozed' | 'cancelled', note?: string) => {
    startTransition(async () => {
      const r = await updateFollowUpStatus(followUp.id, status, note)
      setFeedback(r.error ?? 'Aktualizováno.')
      setTimeout(() => setFeedback(null), 2500)
    })
  }

  const dueAt = new Date(followUp.due_at)
  const dueLabel = `${String(dueAt.getDate()).padStart(2, '0')}.${String(dueAt.getMonth() + 1).padStart(2, '0')}.`

  return (
    <li className="border border-cream/15 rounded-[1px] p-5 space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-serif italic text-[18px] lg:text-[22px] leading-[1.2] text-cream">
            {followUp.subject}
          </p>
          {followUp.body && (
            <p className="mt-2 text-[14px] leading-[1.5] text-cream/65">
              {followUp.body}
            </p>
          )}
          <p className="mt-3 font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55">
            <Link
              href={`/admin/customers/${encodeURIComponent(followUp.email)}`}
              className="hover:text-orange transition-colors"
            >
              {followUp.email}
            </Link>
            {' · '}
            <span className="tabular-nums">{dueLabel}</span>
          </p>
        </div>
        <span
          className={cn(
            'shrink-0 font-mono text-[9px] tracking-[0.22em] uppercase px-2 py-1 border rounded-[1px]',
            followUp.status === 'pending' && 'text-orange border-orange',
            followUp.status === 'done' && 'text-cream/45 border-cream/25',
            followUp.status === 'snoozed' && 'text-cream/65 border-cream/40',
            followUp.status === 'cancelled' && 'text-orange-dark border-orange-dark'
          )}
        >
          {followUp.status}
        </span>
      </div>

      {followUp.status === 'pending' && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => change('done')}
            className="font-mono text-[10px] tracking-[0.22em] uppercase font-semibold px-3 py-2 border-2 border-orange bg-orange text-cream hover:bg-orange-dark disabled:opacity-50 transition-colors rounded-[1px]"
          >
            Hotovo
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => change('snoozed')}
            className="font-mono text-[10px] tracking-[0.22em] uppercase px-3 py-2 border border-cream/30 text-cream hover:border-cream disabled:opacity-50 transition-colors rounded-[1px]"
          >
            Snooze
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => change('cancelled')}
            className="font-mono text-[10px] tracking-[0.22em] uppercase px-3 py-2 border border-cream/15 text-cream/55 hover:border-orange-dark hover:text-orange-dark disabled:opacity-50 transition-colors rounded-[1px]"
          >
            Zrušit
          </button>
        </div>
      )}

      {followUp.completion_note && (
        <p className="font-serif italic text-[13px] text-cream/65">{followUp.completion_note}</p>
      )}

      {feedback && (
        <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-orange">{feedback}</p>
      )}
    </li>
  )
}
