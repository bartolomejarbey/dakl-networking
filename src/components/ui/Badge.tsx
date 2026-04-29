import { cn, EVENT_TYPE_LABELS } from '@/lib/utils'

interface BadgeProps {
  type: string
  /** Default `outline`. `solid` fills with current color and inverts text. */
  variant?: 'outline' | 'solid'
  className?: string
}

export function Badge({ type, variant = 'outline', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block font-mono text-[10px] tracking-[0.18em] uppercase font-medium px-2.5 py-1 rounded-[1px]',
        variant === 'outline' && 'border border-current',
        variant === 'solid' && 'bg-current',
        className
      )}
    >
      <span className={variant === 'solid' ? 'text-cream mix-blend-difference' : ''}>
        {EVENT_TYPE_LABELS[type] || type}
      </span>
    </span>
  )
}
