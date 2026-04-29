import type { ReactNode } from 'react'

interface CaptionBlockProps {
  /** First line — file code or origin label, rendered uppercase. */
  code: string
  /** Second line — location or subject. */
  location?: ReactNode
  /** Third line — date or coordinates. Defaults to free-form text. */
  meta?: ReactNode
  /** Variant of color treatment. Default `light` (cream on dark surfaces). */
  tone?: 'light' | 'dark'
  className?: string
}

/**
 * 3-line typeset caption beneath images and editorial blocks.
 * Plays the role of magazine photo apparatus: file code, location, meta.
 */
export function CaptionBlock({
  code,
  location,
  meta,
  tone = 'light',
  className = '',
}: CaptionBlockProps) {
  const palette =
    tone === 'light'
      ? 'text-cream/80'
      : 'text-ink-soft/85'
  const sub =
    tone === 'light'
      ? 'text-cream/55'
      : 'text-ink-soft/55'

  return (
    <figcaption className={`font-mono ${palette} ${className}`}>
      <span className="block text-[11px] uppercase tracking-[0.18em]">{code}</span>
      {location && (
        <span className={`block text-[12px] mt-1 ${sub}`}>{location}</span>
      )}
      {meta && (
        <span className={`block text-[11px] tabular-nums mt-0.5 ${sub}`}>{meta}</span>
      )}
    </figcaption>
  )
}
