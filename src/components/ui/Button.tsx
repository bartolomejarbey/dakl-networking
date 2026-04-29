'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { MagneticButton } from './MagneticButton'

type ButtonVariant =
  | 'orange'
  | 'orange-lg'
  | 'orange-block'
  | 'outline-cream'
  | 'outline-ink'
  | 'ghost-cream'
  | 'ghost-ink'
  | 'stamp'

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  ariaLabel?: string
  /** Show the trailing arrow. Defaults to true; set false for stamp/ghost styles. */
  showArrow?: boolean
  /** Wrap with magnetic-pull behaviour on pointer-fine devices. */
  magnetic?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  orange:
    'group inline-flex items-center gap-2.5 bg-orange text-cream font-mono text-xs tracking-[0.08em] uppercase font-medium px-6 py-[13px] rounded-[1px] transition-colors duration-300 hover:bg-orange-dark',
  'orange-lg':
    'group inline-flex items-center gap-3 bg-orange text-cream font-mono text-[13px] tracking-[0.1em] uppercase font-medium px-8 py-5 rounded-[1px] transition-colors duration-300 hover:bg-orange-dark',
  'orange-block':
    'group flex w-full justify-between items-center bg-orange text-cream font-mono text-[13px] tracking-[0.1em] uppercase font-medium px-7 py-[20px] rounded-[1px] transition-colors duration-300 hover:bg-orange-dark',
  'outline-cream':
    'group inline-flex items-center gap-2.5 border border-cream text-cream font-mono text-xs tracking-[0.08em] uppercase font-medium px-6 py-[12px] rounded-[1px] transition-colors duration-300 hover:bg-cream hover:text-forest-deep',
  'outline-ink':
    'group inline-flex items-center gap-2.5 border border-ink text-ink font-mono text-xs tracking-[0.08em] uppercase font-medium px-6 py-[12px] rounded-[1px] transition-colors duration-300 hover:bg-ink hover:text-cream',
  'ghost-cream':
    'group inline-flex items-center gap-2 text-cream font-mono text-[11px] tracking-[0.18em] uppercase font-medium py-1 transition-opacity duration-300 hover:opacity-100 opacity-90',
  'ghost-ink':
    'group inline-flex items-center gap-2 text-ink font-mono text-[11px] tracking-[0.18em] uppercase font-medium py-1 transition-opacity duration-300 hover:opacity-100 opacity-90',
  stamp:
    'group inline-flex items-center gap-2 border-2 border-orange bg-orange text-cream font-mono text-[11px] tracking-[0.16em] uppercase font-semibold px-5 py-2.5 rounded-[1px] transition-colors duration-300 hover:bg-orange-dark hover:border-orange-dark',
}

export function Button({
  children,
  variant = 'orange',
  href,
  onClick,
  type = 'button',
  disabled,
  className,
  ariaLabel,
  showArrow = true,
  magnetic = false,
}: ButtonProps) {
  const styles = cn(variantStyles[variant], className)

  const arrow = showArrow ? (
    <span className="inline-block transition-transform duration-300 ease-editorial group-hover:translate-x-[3px]" aria-hidden>
      &rarr;
    </span>
  ) : null

  const inner = href ? (
    <Link href={href} className={styles} aria-label={ariaLabel}>
      <span>{children}</span>
      {arrow}
    </Link>
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} className={styles} aria-label={ariaLabel}>
      <span>{children}</span>
      {arrow}
    </button>
  )

  if (magnetic) {
    return <MagneticButton className="inline-block">{inner}</MagneticButton>
  }

  return inner
}
