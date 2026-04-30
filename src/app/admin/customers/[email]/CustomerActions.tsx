'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useTransition, useState } from 'react'
import {
  addCustomerNote,
  addCustomerTag,
  removeCustomerTag,
  scheduleFollowUp,
} from '@/app/admin/orders/[id]/actions'
import type { CustomerNote } from '@/types/database'
import { cn } from '@/lib/utils'

interface CustomerActionsProps {
  email: string
  existingTags: string[]
  notes: CustomerNote[]
}

const inputClass =
  'w-full bg-transparent border-b border-cream/25 font-mono text-[13px] text-cream placeholder:text-cream/30 outline-none py-2 focus:border-orange transition-colors'
const textareaClass = cn(inputClass, 'resize-none font-sans text-[14px]')
const labelClass = 'block font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 mb-2'

function SmallButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-mono text-[10px] tracking-[0.22em] uppercase font-semibold px-4 py-2.5 border-2 border-orange bg-orange text-cream hover:bg-orange-dark disabled:opacity-50 transition-colors rounded-[1px]"
    >
      {pending ? 'Ukládám…' : children}
    </button>
  )
}

export function CustomerActions({ email, existingTags, notes }: CustomerActionsProps) {
  const [tagState, tagAction] = useFormState<{ ok?: boolean; error?: string; message?: string }, FormData>(
    addCustomerTag,
    {}
  )
  const [noteState, noteAction] = useFormState<{ ok?: boolean; error?: string; message?: string }, FormData>(
    addCustomerNote,
    {}
  )
  const [followUpState, followUpAction] = useFormState<{ ok?: boolean; error?: string; message?: string }, FormData>(
    scheduleFollowUp,
    {}
  )

  const [removingTag, removeTagTransition] = useTransition()
  const [tagFeedback, setTagFeedback] = useState<string | null>(null)

  const handleRemove = (tag: string) => {
    removeTagTransition(async () => {
      await removeCustomerTag(email, tag)
      setTagFeedback(`${tag} odstraněn`)
      setTimeout(() => setTagFeedback(null), 2000)
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Tags */}
      <section className="border border-cream/15 rounded-[1px] p-5">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-3">§ Tagy</p>
        <div className="flex flex-wrap gap-2 mb-4 min-h-[28px]">
          {existingTags.length === 0 && (
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-cream/45">
              Žádné tagy
            </span>
          )}
          {existingTags.map((tag) => (
            <button
              key={tag}
              type="button"
              disabled={removingTag}
              onClick={() => handleRemove(tag)}
              className="group inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-1 border border-cream/25 rounded-[1px] text-cream/85 hover:border-orange hover:text-orange transition-colors"
              title="Klikni pro odstranění"
            >
              {tag}
              <span className="opacity-40 group-hover:opacity-100">×</span>
            </button>
          ))}
        </div>
        <form action={tagAction} className="flex items-end gap-2">
          <input type="hidden" name="email" value={email} />
          <label className="block flex-1">
            <span className={labelClass}>Nový tag</span>
            <input name="tag" required maxLength={40} className={inputClass} placeholder="VIP, sponzor, opakovaný…" />
          </label>
          <SmallButton>Přidat</SmallButton>
        </form>
        {(tagState?.error || tagState?.message || tagFeedback) && (
          <p
            className={cn(
              'mt-3 font-mono text-[10px] tracking-[0.18em] uppercase',
              tagState?.error ? 'text-orange-dark' : 'text-orange'
            )}
          >
            {tagFeedback ?? tagState?.error ?? tagState?.message}
          </p>
        )}
      </section>

      {/* Note */}
      <section className="border border-cream/15 rounded-[1px] p-5">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-3">§ Poznámky</p>
        <form action={noteAction} className="space-y-3">
          <input type="hidden" name="email" value={email} />
          <label className="block">
            <span className={labelClass}>Nová poznámka</span>
            <textarea
              name="body"
              required
              rows={3}
              className={textareaClass}
              placeholder="Co se hodí pamatovat…"
            />
          </label>
          <label className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-cream/65">
            <input type="checkbox" name="isPinned" className="accent-orange" />
            Pinnout nahoře
          </label>
          <SmallButton>Přidat poznámku</SmallButton>
          {(noteState?.error || noteState?.message) && (
            <p className={cn('font-mono text-[10px] tracking-[0.18em] uppercase', noteState?.error ? 'text-orange-dark' : 'text-orange')}>
              {noteState?.error ?? noteState?.message}
            </p>
          )}
        </form>

        {notes.length > 0 && (
          <ul className="mt-5 pt-5 border-t border-cream/10 space-y-3 max-h-[260px] overflow-y-auto">
            {notes.map((note) => (
              <li key={note.id} className="font-serif italic text-cream/85 text-[14px] leading-[1.4]">
                {note.is_pinned && (
                  <span className="font-mono text-[8px] tracking-[0.22em] uppercase text-orange mr-2 not-italic">
                    Pin
                  </span>
                )}
                {note.body}
                <span className="block mt-1 font-mono text-[9px] tracking-[0.22em] uppercase text-cream/45 not-italic">
                  {new Date(note.created_at).toLocaleDateString('cs-CZ')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Follow-up */}
      <section className="border border-cream/15 rounded-[1px] p-5">
        <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-3">§ Naplánovat follow-up</p>
        <form action={followUpAction} className="space-y-3">
          <input type="hidden" name="email" value={email} />
          <label className="block">
            <span className={labelClass}>Předmět</span>
            <input name="subject" required maxLength={200} className={inputClass} placeholder="Ozvat se ohledně sponzoringu" />
          </label>
          <label className="block">
            <span className={labelClass}>Datum</span>
            <input name="dueAt" type="date" required className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Poznámka — volitelné</span>
            <textarea name="body" rows={2} className={textareaClass} placeholder="Detail…" />
          </label>
          <SmallButton>Naplánovat</SmallButton>
          {(followUpState?.error || followUpState?.message) && (
            <p className={cn('font-mono text-[10px] tracking-[0.18em] uppercase', followUpState?.error ? 'text-orange-dark' : 'text-orange')}>
              {followUpState?.error ?? followUpState?.message}
            </p>
          )}
        </form>
      </section>
    </div>
  )
}
