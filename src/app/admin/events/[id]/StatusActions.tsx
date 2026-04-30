'use client'

import { useTransition, useState } from 'react'
import { setEventStatus } from '../actions'
import { cn } from '@/lib/utils'

interface StatusActionsProps {
  eventId: string
  currentStatus: 'draft' | 'published' | 'archived' | 'cancelled'
}

const STATUSES: Array<'draft' | 'published' | 'archived' | 'cancelled'> = [
  'draft',
  'published',
  'archived',
  'cancelled',
]

export function StatusActions({ eventId, currentStatus }: StatusActionsProps) {
  const [pending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<string | null>(null)

  const change = (status: typeof currentStatus) => {
    startTransition(async () => {
      const result = await setEventStatus(eventId, status)
      setFeedback(result.error ?? result.message ?? null)
      setTimeout(() => setFeedback(null), 3000)
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-y border-cream/15 py-4">
      <span className="font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 mr-2">
        Status
      </span>
      {STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          disabled={pending || s === currentStatus}
          onClick={() => change(s)}
          className={cn(
            'font-mono text-[10px] tracking-[0.22em] uppercase px-3 py-1.5 rounded-[1px] border transition-colors disabled:cursor-not-allowed',
            s === currentStatus
              ? 'bg-orange border-orange text-cream'
              : 'border-cream/25 text-cream/65 hover:border-cream hover:text-cream'
          )}
        >
          [&nbsp;{s}&nbsp;]
        </button>
      ))}
      {feedback && (
        <span className="ml-3 font-mono text-[10px] tracking-[0.18em] uppercase text-orange">
          {feedback}
        </span>
      )}
    </div>
  )
}
