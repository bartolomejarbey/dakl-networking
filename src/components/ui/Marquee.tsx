import type { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  /** Animation duration. Default 60s. */
  speed?: 'slow' | 'normal' | 'fast'
  /** Repetitions of the children inside the track. Default 2 (minimum for seamless loop). */
  copies?: number
  className?: string
  /** Visual divider between repetitions. */
  separator?: ReactNode
}

const SPEEDS: Record<NonNullable<MarqueeProps['speed']>, string> = {
  slow: 'animate-[marquee_90s_linear_infinite]',
  normal: 'animate-[marquee_60s_linear_infinite]',
  fast: 'animate-[marquee_30s_linear_infinite]',
}

/**
 * Pure-CSS infinite horizontal marquee. Pauses on hover.
 */
export function Marquee({
  children,
  speed = 'normal',
  copies = 2,
  className = '',
  separator,
}: MarqueeProps) {
  const inner = Array.from({ length: copies }).map((_, i) => (
    <span key={i} className="flex items-center shrink-0 whitespace-nowrap" aria-hidden={i > 0}>
      {children}
      {separator && <span className="px-6 opacity-40">{separator}</span>}
    </span>
  ))

  return (
    <div className={`group flex overflow-hidden ${className}`}>
      <div className={`marquee-inner flex shrink-0 whitespace-nowrap ${SPEEDS[speed]} group-hover:[animation-play-state:paused]`}>
        {inner}
      </div>
    </div>
  )
}
