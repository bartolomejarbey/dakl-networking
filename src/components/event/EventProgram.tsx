'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import type { ProgramItem } from '@/types/database'

const EASE = [0.22, 1, 0.36, 1] as const

interface EventProgramProps {
  program: ProgramItem[]
}

export function EventProgram({ program }: EventProgramProps) {
  return (
    <section className="bg-cream text-ink py-24 lg:py-32">
      <Container>
        {/* Folio */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-12 lg:mb-16">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
            §&nbsp;Program
          </p>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/60">
            Časová osa večera · {program.length} bodů
          </p>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 14, clipPath: 'inset(0 0 100% 0)' }}
          whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-serif text-ink leading-[1] tracking-[-0.02em] text-[clamp(36px,5vw,80px)] mb-16"
          style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
        >
          Časová osa.
          <span className="block italic text-ink-soft pl-[0.4em]">
            Co se kdy děje.
          </span>
        </motion.h2>

        <ol className="border-t border-ink/15">
          {program.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
              className="grid grid-cols-[88px_1fr] lg:grid-cols-[140px_1fr] items-baseline gap-6 lg:gap-10 py-6 lg:py-8 border-b border-ink/15"
            >
              <span className="font-mono text-[16px] lg:text-[20px] tabular-nums text-orange">
                {item.time}
              </span>
              <div>
                <p className="font-serif italic text-ink text-[20px] lg:text-[26px] leading-[1.2]">
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-ink-soft text-[15px] lg:text-[16px] leading-[1.55] mt-2 max-w-[640px]">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
