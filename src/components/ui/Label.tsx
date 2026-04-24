import { cn } from '@/lib/utils'

type LabelSize = 'sm' | 'md' | 'default'

interface LabelProps {
  children: React.ReactNode
  size?: LabelSize
  className?: string
  as?: 'span' | 'div' | 'p'
}

const sizeStyles: Record<LabelSize, string> = {
  sm: 'font-mono text-[10px] tracking-[0.18em] uppercase',
  default: 'font-mono text-[11px] tracking-[0.14em] uppercase font-medium',
  md: 'font-mono text-[13px] tracking-[0.1em] uppercase font-medium',
}

export function Label({ children, size = 'default', className, as: Tag = 'span' }: LabelProps) {
  return <Tag className={cn(sizeStyles[size], className)}>{children}</Tag>
}
