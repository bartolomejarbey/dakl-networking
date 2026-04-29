import { cn } from '@/lib/utils'

type WordmarkSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type WordmarkLayout = 'stacked' | 'inline' | 'mark'

interface WordmarkProps {
  /** Visual scale. Default `md`. */
  size?: WordmarkSize
  /** Layout: stacked masthead, inline horizontal, or just the DaKl mark. */
  layout?: WordmarkLayout
  /** Edition number to show after the subtitle, e.g. "04" → "/04". Pass `null` to hide. */
  edition?: string | null
  /** Subtitle text. Default "NETWORKING". */
  subtitle?: string
  className?: string
  /** Visual focus on the K letter — adds an orange ink-stroke under it. */
  accent?: boolean
}

const SIZE_STYLES: Record<WordmarkSize, {
  primary: string
  secondary: string
  rule: string
  gap: string
  trackingPrimary: string
  inlineBar: string
}> = {
  xs: {
    primary: 'text-[18px] leading-[0.95]',
    secondary: 'text-[7px] tracking-[0.34em]',
    rule: 'h-px w-7 mt-1 mb-1',
    gap: 'gap-0.5',
    trackingPrimary: '-tracking-[0.012em]',
    inlineBar: 'h-3.5',
  },
  sm: {
    primary: 'text-[24px] leading-[0.95]',
    secondary: 'text-[8px] tracking-[0.36em]',
    rule: 'h-px w-9 mt-1.5 mb-1',
    gap: 'gap-1',
    trackingPrimary: '-tracking-[0.014em]',
    inlineBar: 'h-4',
  },
  md: {
    primary: 'text-[30px] leading-[0.92]',
    secondary: 'text-[9px] tracking-[0.4em]',
    rule: 'h-px w-12 mt-2 mb-1.5',
    gap: 'gap-1.5',
    trackingPrimary: '-tracking-[0.016em]',
    inlineBar: 'h-5',
  },
  lg: {
    primary: 'text-[44px] leading-[0.92]',
    secondary: 'text-[10px] tracking-[0.42em]',
    rule: 'h-px w-16 mt-2.5 mb-2',
    gap: 'gap-2',
    trackingPrimary: '-tracking-[0.018em]',
    inlineBar: 'h-7',
  },
  xl: {
    primary: 'text-[72px] leading-[0.9]',
    secondary: 'text-[12px] tracking-[0.44em]',
    rule: 'h-px w-24 mt-4 mb-2.5',
    gap: 'gap-3',
    trackingPrimary: '-tracking-[0.022em]',
    inlineBar: 'h-10',
  },
}

/**
 * "DaKl" rendered as a custom wordmark — italic serif with subtle letter
 * scale variation (the lowercase a + l are slightly smaller and lifted, so
 * the D + K read as a typographic monogram). Optional orange ink-stroke
 * under the K.
 */
function DaKlMark({
  className,
  accent,
  trackingPrimary,
}: {
  className?: string
  accent: boolean
  trackingPrimary: string
}) {
  return (
    <span className={cn('font-serif italic relative inline-block whitespace-nowrap', trackingPrimary, className)}>
      <span className="inline-block">D</span>
      <span className="inline-block scale-[0.84] -translate-y-[0.04em] origin-bottom">a</span>
      <span className="relative inline-block">
        K
        {accent && (
          <span
            aria-hidden
            className="absolute left-[-6%] right-[-6%] bottom-[0.04em] h-[0.18em] -z-10 rotate-[-1.4deg]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 24' preserveAspectRatio='none'><path fill='%23E97940' d='M2,8 C40,4 80,2 130,4 C170,5 188,9 196,12 C200,16 192,18 170,19 C120,21 70,21 16,19 C4,18 0,15 2,12 C2,10 2,9 2,8 Z' opacity='.85'/></svg>\")",
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}
      </span>
      <span className="inline-block scale-[0.84] -translate-y-[0.04em] origin-bottom">l</span>
    </span>
  )
}

export function Wordmark({
  size = 'md',
  layout = 'stacked',
  edition = null,
  subtitle = 'Networking',
  className,
  accent = true,
}: WordmarkProps) {
  const s = SIZE_STYLES[size]

  if (layout === 'mark') {
    return <DaKlMark accent={accent} trackingPrimary={s.trackingPrimary} className={cn(s.primary, className)} />
  }

  if (layout === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-3 whitespace-nowrap', className)}>
        <DaKlMark accent={accent} trackingPrimary={s.trackingPrimary} className={s.primary} />
        <span aria-hidden className={cn('w-px bg-current opacity-40', s.inlineBar)} />
        <span className={cn('font-mono uppercase font-medium', s.secondary)}>
          {subtitle}
          {edition && (
            <>
              <span aria-hidden className="opacity-50 mx-1.5">/</span>
              <span className="tabular-nums">{edition}</span>
            </>
          )}
        </span>
      </span>
    )
  }

  // Stacked
  return (
    <span className={cn('inline-flex flex-col items-start leading-none', className)}>
      <DaKlMark accent={accent} trackingPrimary={s.trackingPrimary} className={s.primary} />
      <span aria-hidden className={cn('bg-orange', s.rule)} />
      <span className={cn('font-mono uppercase font-medium whitespace-nowrap', s.secondary)}>
        {subtitle}
        {edition && (
          <>
            <span aria-hidden className="opacity-50 mx-1.5">/</span>
            <span className="tabular-nums">{edition}</span>
          </>
        )}
      </span>
    </span>
  )
}
