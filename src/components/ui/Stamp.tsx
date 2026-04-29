import type { ReactNode } from 'react'

interface StampProps {
  children: ReactNode
  /** Default forest. Pass orange for high-emphasis status (LIVE / VYPRODÁNO). */
  tone?: 'forest' | 'cream' | 'orange' | 'teal'
  /** Default -2deg. Set to 0 for un-tilted, e.g., when used inline with running text. */
  tilt?: number
  /** Diagonal mode: rotated -6deg with thicker border, used as overlay across content. */
  diagonal?: boolean
  className?: string
}

const TONES: Record<NonNullable<StampProps['tone']>, string> = {
  forest: 'border-forest-deep text-forest-deep',
  cream: 'border-cream text-cream',
  orange: 'border-orange text-orange',
  teal: 'border-teal text-teal',
}

/**
 * Tilted bordered stamp pill. Used for status flags: ARCHIV, VYPRODÁNO, BRZY,
 * PROBĚHLO. The diagonal mode is for overlaying across cards or photos.
 */
export function Stamp({
  children,
  tone = 'forest',
  tilt = -2,
  diagonal = false,
  className = '',
}: StampProps) {
  return (
    <span
      className={`inline-flex items-center font-mono uppercase ${TONES[tone]} ${
        diagonal
          ? 'border-2 px-4 py-1.5 text-[14px] tracking-[0.18em]'
          : 'border px-2.5 py-1 text-[10px] tracking-[0.16em]'
      } ${className}`}
      style={{
        transform: `rotate(${diagonal ? -6 : tilt}deg)`,
      }}
    >
      {children}
    </span>
  )
}
