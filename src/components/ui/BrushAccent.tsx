import type { ReactNode } from 'react'

interface BrushAccentProps {
  children: ReactNode
  className?: string
  /** Default: orange. Pass `teal` for the secondary accent variant. */
  variant?: 'orange' | 'teal'
  /** Inline-block by default; switch to inline for body-text accents. */
  inline?: boolean
}

const PATHS = {
  orange:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 80' preserveAspectRatio='none'><path fill='%23E97940' d='M8,34 C60,22 120,18 180,24 C240,28 300,30 360,26 C378,24 390,28 392,36 C394,46 380,52 360,54 C300,58 240,56 180,56 C120,56 60,54 12,50 C4,48 0,44 2,40 C4,36 6,34 8,34 Z' opacity='.82'/><path fill='%23E97940' d='M20,40 C80,32 160,28 240,30 C290,32 340,34 378,32' stroke='%23E97940' stroke-width='2' fill='none' opacity='.3'/></svg>",
  teal:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 80' preserveAspectRatio='none'><path fill='%231E8B85' d='M8,34 C60,22 120,18 180,24 C240,28 300,30 360,26 C378,24 390,28 392,36 C394,46 380,52 360,54 C300,58 240,56 180,56 C120,56 60,54 12,50 C4,48 0,44 2,40 C4,36 6,34 8,34 Z' opacity='.78'/><path fill='%231E8B85' d='M20,40 C80,32 160,28 240,30 C290,32 340,34 378,32' stroke='%231E8B85' stroke-width='2' fill='none' opacity='.3'/></svg>",
}

/**
 * Wraps a word (or short phrase) with the brand brush stroke behind it.
 * Use sparingly — once per page max, on the most important word in a headline.
 */
export function BrushAccent({
  children,
  className = '',
  variant = 'orange',
  inline = false,
}: BrushAccentProps) {
  const Tag = inline ? 'span' : 'span'
  return (
    <Tag
      className={`relative ${inline ? 'inline' : 'inline-block'} px-[0.18em] ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-[-2px_-6px_-4px_-6px] -z-10 bg-no-repeat bg-[length:100%_100%] -rotate-[1.2deg]"
        style={{
          backgroundImage: `url("${PATHS[variant]}")`,
        }}
      />
      <span className="relative">{children}</span>
    </Tag>
  )
}
