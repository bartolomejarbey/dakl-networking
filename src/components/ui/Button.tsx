import { cn } from '@/lib/utils'
import Link from 'next/link'

type ButtonVariant = 'orange' | 'orange-lg' | 'orange-block'

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  orange:
    'inline-flex items-center gap-2.5 bg-orange text-cream font-mono text-xs tracking-[0.08em] uppercase font-medium px-[22px] py-[13px] rounded-[2px] transition-colors hover:bg-orange-dark',
  'orange-lg':
    'inline-flex items-center gap-2.5 bg-orange text-cream font-mono text-[13px] tracking-[0.08em] uppercase font-medium px-7 py-5 rounded-[2px] transition-colors hover:bg-orange-dark',
  'orange-block':
    'flex w-full justify-between items-center bg-orange text-cream font-mono text-[13px] tracking-[0.08em] uppercase font-medium px-7 py-[22px] rounded-[2px] transition-colors hover:bg-orange-dark',
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
}: ButtonProps) {
  const styles = cn(variantStyles[variant], className)

  if (href) {
    return (
      <Link href={href} className={styles} aria-label={ariaLabel}>
        {children}
        <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1">
          →
        </span>
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles}
      aria-label={ariaLabel}
    >
      {children}
      <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1">
        →
      </span>
    </button>
  )
}
