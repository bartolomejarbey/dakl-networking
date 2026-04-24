import { cn } from '@/lib/utils'
import { EVENT_TYPE_LABELS } from '@/lib/utils'

interface BadgeProps {
  type: string
  className?: string
}

export function Badge({ type, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block font-mono text-[10px] tracking-[0.14em] uppercase font-medium',
        'border border-current px-2.5 py-1 rounded-[2px]',
        className
      )}
    >
      {EVENT_TYPE_LABELS[type] || type}
    </span>
  )
}
