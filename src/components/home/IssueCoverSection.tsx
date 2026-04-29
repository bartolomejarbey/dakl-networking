'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { BrushAccent } from '@/components/ui/BrushAccent'

const EASE = [0.22, 1, 0.36, 1] as const

interface IssueCoverSectionProps {
  /** Issue number rendered in the masthead. */
  issue?: string
  /** Month + year for masthead. */
  edition?: string
}

export function IssueCoverSection({
  issue = '04',
  edition = 'Duben 2026',
}: IssueCoverSectionProps) {
  return (
    <section
      data-folio="01"
      data-folio-label="Kryt vydání"
      className="relative min-h-screen overflow-hidden bg-forest-deep text-cream pt-28 pb-20 lg:pt-32 lg:pb-24 flex flex-col"
    >
      {/* Subtle radial — top-left teal glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 28% 35%, rgba(30, 139, 133, 0.18), transparent 65%)',
        }}
      />
      <GrainOverlay opacity={0.05} />

      <Container className="relative z-10 flex-1 flex flex-col">
        {/* Masthead — top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between font-mono text-[10px] tracking-[0.24em] uppercase text-cream/65"
        >
          <div className="flex items-center gap-3">
            <span className="text-orange">§</span>
            <span>DaKl Networking — Pražský čtvrtletník</span>
          </div>
          <div className="flex items-center gap-5">
            <span>Vydání&nbsp;{issue}</span>
            <span className="opacity-50">·</span>
            <span>{edition}</span>
            <span className="opacity-50">·</span>
            <span>Praha</span>
          </div>
        </motion.div>

        <div className="hairline mt-4 mb-12 lg:mb-16 bg-cream/15" />

        {/* Centerpiece — three-line statement */}
        <div className="flex-1 flex flex-col justify-center max-w-[1180px]">
          <h1 className="font-serif text-cream leading-[0.95] tracking-[-0.025em] text-[clamp(54px,11vw,180px)]">
            <motion.span
              initial={{ opacity: 0, y: 28, clipPath: 'inset(0 0 100% 0)' }}
              animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
              transition={{ duration: 1, delay: 0.25, ease: EASE }}
              className="block"
              style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
            >
              Posádka se vrátila.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24, clipPath: 'inset(0 0 100% 0)' }}
              animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
              transition={{ duration: 1, delay: 0.55, ease: EASE }}
              className="block italic text-cream/85 text-[clamp(34px,6vw,96px)] mt-3 lg:mt-5 pl-[0.6em]"
              style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
            >
              Karty rozdány. Drinky vypity. Loď přežila.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24, clipPath: 'inset(0 0 100% 0)' }}
              animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
              transition={{ duration: 1, delay: 0.95, ease: EASE }}
              className="block mt-6 lg:mt-10"
              style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
            >
              Příští vydání:{' '}
              <BrushAccent>brzy</BrushAccent>
              <span className="text-orange">.</span>
            </motion.span>
          </h1>
        </div>

        {/* Bottom row — editor's note + next-issue stamp */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: EASE }}
          className="mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end"
        >
          {/* Editor's note */}
          <div className="lg:col-span-7 max-w-[520px]">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55 mb-4">
              — Slovo pořadatele
            </p>
            <p className="font-serif text-[20px] lg:text-[22px] leading-[1.45] text-cream/85 italic">
              Lidé se vrátili z lodi a něco zbylo. Vizitky v náprsních kapsách,
              jména v telefonech, dohody nedokončené ráno do mailu. Tohle je
              archiv toho večera — a oznámka, ať se přihlásíš na ten další.
            </p>
            <p className="mt-4 font-mono text-[11px] tracking-[0.18em] uppercase text-cream/55">
              David Kladišovský · Pořadatel
            </p>
          </div>

          {/* Next issue stamp */}
          <div className="lg:col-span-5 lg:justify-self-end">
            <div className="inline-flex flex-col gap-3 border border-cream/30 px-7 py-6 rounded-[1px] backdrop-blur-sm bg-forest/30">
              <span className="font-mono text-[9px] tracking-[0.26em] uppercase text-cream/55">
                Příští vydání
              </span>
              <span className="font-serif italic text-[44px] lg:text-[56px] leading-[1] text-cream">
                TBA
              </span>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-orange">
                Datum oznámíme přihlášeným
              </span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
