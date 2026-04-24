import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('max-w-container mx-auto px-[var(--gutter)] relative', className)}>
      {children}
    </div>
  )
}
