'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { BrushAccent } from '@/components/ui/BrushAccent'

const EASE = [0.22, 1, 0.36, 1] as const

const principles = [
  {
    number: '01',
    headline: 'Jedna cena, všechno uvnitř.',
    body: 'Jídlo, pití, program. Žádné domlouvání na baru, žádné zvlášť faktury. Zaplatíš jednou a máš večer.',
  },
  {
    number: '02',
    headline: 'Jen aktivní podnikatelé.',
    bodyAccentWord: 'osobně',
    body: ['Žádní zvědavci, žádní MLM lovci, žádní teenageři s vizitkou. Každou akci David filtruje ', 'osobně', '.'],
  },
  {
    number: '03',
    headline: 'Každý měsíc jiný formát.',
    body: 'Degustace vína, mořské plody, loď na Vltavě, letní párty. Ne pořád to samé kafe v zasedačce.',
  },
] as const

export function PrinciplesSection() {
  return (
    <section
      id="principy"
      data-folio="03"
      data-folio-label="Stanovy"
      className="relative bg-cream text-ink py-24 lg:py-36"
    >
      {/* 1% film grain on cream */}
      <div className="absolute inset-0 pointer-events-none grain-light grain" />

      <Container className="relative z-10">
        {/* Section folio */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-16 lg:mb-24">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
            §&nbsp;03 — Stanovy
          </p>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/60">
            Tři pravidla od pořadatele · platí ve všech vydáních
          </p>
        </div>

        {/* Manifesto headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16, clipPath: 'inset(0 0 100% 0)' }}
          whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-serif text-ink leading-[0.98] tracking-[-0.022em] text-[clamp(48px,7.5vw,120px)] mb-20 lg:mb-28 max-w-[1200px]"
          style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
        >
          Není to networking.
          <span className="block italic text-ink-soft pl-[0.5em] mt-2 lg:mt-4">
            Je to večer, po kterém něco zbyde.
          </span>
        </motion.h2>

        {/* Three manifesto entries */}
        <ol className="border-t border-ink/15">
          {principles.map((p, i) => {
            const renderBody = () => {
              if (typeof p.body === 'string') return p.body
              const parts = p.body
              return (
                <>
                  {parts[0]}
                  <BrushAccent variant="teal">{parts[1]}</BrushAccent>
                  {parts[2]}
                </>
              )
            }
            return (
              <motion.li
                key={p.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.7, delay: 0.1 * i, ease: EASE }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start py-12 lg:py-16 border-b border-ink/15"
              >
                <span className="lg:col-span-2 font-mono text-[14px] tracking-[0.18em] uppercase text-orange tabular-nums">
                  §&nbsp;{p.number}
                </span>
                <div className="lg:col-span-10">
                  <h3 className="font-serif italic text-ink text-[clamp(28px,3.6vw,52px)] leading-[1.05] tracking-[-0.018em] mb-5 lg:mb-7">
                    {p.headline}
                  </h3>
                  <p className="text-ink-soft text-[18px] lg:text-[22px] leading-[1.5] max-w-[760px]">
                    {renderBody()}
                  </p>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </Container>
    </section>
  )
}
