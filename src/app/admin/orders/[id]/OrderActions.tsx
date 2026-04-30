'use client'

import { useState, useTransition } from 'react'
import { regenerateInvoice, sendInvoiceEmail, markOrderPaid } from './actions'
import { cn } from '@/lib/utils'

interface OrderActionsProps {
  orderId: string
  isPaid: boolean
  hasInvoice: boolean
}

export function OrderActions({ orderId, isPaid, hasInvoice }: OrderActionsProps) {
  const [pending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ ok?: boolean; message: string } | null>(null)

  const run = async (fn: () => Promise<{ ok?: boolean; error?: string; message?: string }>) => {
    startTransition(async () => {
      const result = await fn()
      if (result.error) {
        setFeedback({ ok: false, message: result.error })
      } else {
        setFeedback({ ok: true, message: result.message ?? 'Hotovo.' })
      }
      setTimeout(() => setFeedback(null), 4000)
    })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {!isPaid && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => markOrderPaid(orderId))}
            className="font-mono text-[11px] tracking-[0.18em] uppercase px-4 py-3 border-2 border-orange bg-orange text-cream hover:bg-orange-dark transition-colors disabled:opacity-50 rounded-[1px]"
          >
            Označit jako zaplaceno
          </button>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => regenerateInvoice(orderId, !isPaid))}
          className="font-mono text-[11px] tracking-[0.18em] uppercase px-4 py-3 border border-cream/30 text-cream hover:border-cream transition-colors disabled:opacity-50 rounded-[1px]"
        >
          {hasInvoice ? 'Vygenerovat znovu' : 'Vygenerovat'}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => sendInvoiceEmail(orderId))}
          className="font-mono text-[11px] tracking-[0.18em] uppercase px-4 py-3 border border-cream/30 text-cream hover:border-cream transition-colors disabled:opacity-50 rounded-[1px]"
        >
          Odeslat e-mail znovu
        </button>
      </div>
      {feedback && (
        <p
          className={cn(
            'font-mono text-[10px] tracking-[0.18em] uppercase',
            feedback.ok ? 'text-orange' : 'text-orange-dark'
          )}
        >
          {feedback.message}
        </p>
      )}
    </div>
  )
}
