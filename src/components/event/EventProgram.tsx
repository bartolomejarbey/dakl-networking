import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import type { ProgramItem } from '@/types/database'

interface EventProgramProps {
  program: ProgramItem[]
}

export function EventProgram({ program }: EventProgramProps) {
  return (
    <section className="bg-cream py-20 lg:py-28">
      <Container>
        <div>
          <h2
            className="font-serif text-ink leading-[1.1] mb-12 text-[clamp(32px,4vw,52px)]"
          >
            Program
          </h2>

          <div>
            {program.map((item, i) => (
              <div
                key={i}
                className={cn(
                  'grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-start py-5',
                  'border-t border-teal/[0.15]',
                  i === program.length - 1 && 'border-b border-teal/[0.15]'
                )}
              >
                <span className="font-mono text-[14px] text-orange tabular-nums pt-0.5">
                  {item.time}
                </span>
                <div>
                  <p className="text-ink font-semibold text-[16px] leading-[1.4]">
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-ink-soft text-[14px] leading-[1.5] mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
