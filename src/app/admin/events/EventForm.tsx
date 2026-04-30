'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createEvent, updateEvent } from './actions'
import type { Event } from '@/types/database'
import { cn } from '@/lib/utils'

interface EventFormProps {
  event?: Event
}

const labelClass = 'block font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55 mb-2'
const inputClass =
  'w-full bg-transparent border-b border-cream/25 font-mono text-[13px] text-cream placeholder:text-cream/30 outline-none py-2 focus:border-orange transition-colors'
const textareaClass = cn(inputClass, 'resize-none font-sans text-[14px] py-2')

const TYPE_OPTIONS: { value: Event['type']; label: string }[] = [
  { value: 'lod', label: 'Loď' },
  { value: 'vino', label: 'Víno' },
  { value: 'more', label: 'Moře' },
  { value: 'garden', label: 'Letní/garden' },
  { value: 'jine', label: 'Jiné' },
]

const STATUS_OPTIONS: { value: Event['status']; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
  { value: 'cancelled', label: 'Cancelled' },
]

function toLocalDateTime(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-mono text-[10px] tracking-[0.22em] uppercase font-semibold px-5 py-3 border-2 border-orange bg-orange text-cream hover:bg-orange-dark disabled:opacity-50 transition-colors rounded-[1px]"
    >
      {pending ? 'Ukládám…' : label}
    </button>
  )
}

export function EventForm({ event }: EventFormProps) {
  const isEdit = Boolean(event)
  const action = isEdit && event
    ? (updateEvent.bind(null, event.id) as unknown as (prev: unknown, fd: FormData) => Promise<{ ok?: boolean; error?: string; message?: string }>)
    : (createEvent as unknown as (prev: unknown, fd: FormData) => Promise<{ ok?: boolean; error?: string; message?: string }>)
  const [state, formAction] = useFormState(action, {})

  return (
    <form action={formAction} className="space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
        <label className="block md:col-span-2">
          <span className={labelClass}>Název</span>
          <input name="name" required defaultValue={event?.name ?? ''} className={inputClass} placeholder="Neřízený networking na lodi" />
        </label>
        <label className="block">
          <span className={labelClass}>Slug (URL)</span>
          <input name="slug" required pattern="^[a-z0-9-]+$" defaultValue={event?.slug ?? ''} className={inputClass} placeholder="neco-na-lodi" />
        </label>

        <label className="block">
          <span className={labelClass}>Typ</span>
          <select name="type" required defaultValue={event?.type ?? 'lod'} className={cn(inputClass, 'appearance-none cursor-pointer')}>
            {TYPE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value} className="bg-charcoal text-cream">
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Začátek</span>
          <input
            type="datetime-local"
            name="starts_at"
            required
            defaultValue={toLocalDateTime(event?.starts_at)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Konec</span>
          <input
            type="datetime-local"
            name="ends_at"
            required
            defaultValue={toLocalDateTime(event?.ends_at)}
            className={inputClass}
          />
        </label>

        <label className="block md:col-span-2">
          <span className={labelClass}>Místo (název)</span>
          <input name="location_name" defaultValue={event?.location_name ?? ''} className={inputClass} placeholder="Kayak Beach Bar" />
        </label>
        <label className="block">
          <span className={labelClass}>Status</span>
          <select name="status" defaultValue={event?.status ?? 'draft'} className={cn(inputClass, 'appearance-none cursor-pointer')}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value} className="bg-charcoal text-cream">
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block md:col-span-3">
          <span className={labelClass}>Adresa</span>
          <input name="location_address" defaultValue={event?.location_address ?? ''} className={inputClass} placeholder="Náplavka, Železniční most, Praha 2" />
        </label>

        <label className="block">
          <span className={labelClass}>GPS Lat</span>
          <input name="location_gps_lat" defaultValue={event?.location_gps_lat ?? ''} className={inputClass} placeholder="50.0693" />
        </label>
        <label className="block">
          <span className={labelClass}>GPS Lng</span>
          <input name="location_gps_lng" defaultValue={event?.location_gps_lng ?? ''} className={inputClass} placeholder="14.4148" />
        </label>
        <label className="block">
          <span className={labelClass}>Cena Kč</span>
          <input name="price_czk" type="number" required min={0} defaultValue={event?.price_czk ?? 0} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Kapacita</span>
          <input name="capacity" type="number" required min={0} defaultValue={event?.capacity ?? 0} className={inputClass} />
        </label>
      </div>

      <div className="border-t border-cream/15 pt-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <label className="block">
          <span className={labelClass}>Krátký popis</span>
          <textarea name="short_description" rows={3} defaultValue={event?.short_description ?? ''} className={textareaClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Dlouhý popis</span>
          <textarea name="long_description" rows={3} defaultValue={event?.long_description ?? ''} className={textareaClass} />
        </label>
      </div>

      <label className="block">
        <span className={labelClass}>Hero image URL</span>
        <input name="hero_image_url" defaultValue={event?.hero_image_url ?? ''} className={inputClass} placeholder="/images/kaybeach.jpg nebo https://…" />
      </label>

      <label className="block">
        <span className={labelClass}>
          Program JSON — array {`[{ time, title, description? }]`}
        </span>
        <textarea
          name="program_json"
          rows={6}
          defaultValue={event?.program_json ? JSON.stringify(event.program_json, null, 2) : ''}
          className={cn(textareaClass, 'font-mono text-[12px]')}
          placeholder='[{ "time": "15:00", "title": "Příchod", "description": "Welcome drink" }]'
        />
      </label>

      <div className="border-t border-cream/15 pt-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <label className="block">
          <span className={labelClass}>Meta title</span>
          <input name="meta_title" defaultValue={event?.meta_title ?? ''} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>OG image URL</span>
          <input name="og_image_url" defaultValue={event?.og_image_url ?? ''} className={inputClass} />
        </label>
        <label className="block md:col-span-2">
          <span className={labelClass}>Meta description</span>
          <textarea name="meta_description" rows={2} defaultValue={event?.meta_description ?? ''} className={textareaClass} />
        </label>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-cream/15">
        <p
          className={cn(
            'font-mono text-[10px] tracking-[0.18em] uppercase',
            state?.error ? 'text-orange-dark' : state?.message ? 'text-orange' : 'opacity-0'
          )}
        >
          {state?.error || state?.message || '·'}
        </p>
        <SaveButton label={isEdit ? 'Uložit změny' : 'Vytvořit akci'} />
      </div>
    </form>
  )
}
