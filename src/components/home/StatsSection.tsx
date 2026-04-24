import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

export function StatsSection() {
  return (
    <section className="relative bg-forest py-32 lg:py-40 overflow-hidden">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #F5EFE2 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <Container className="relative z-10">
        {/* Header */}
        <div className="mb-20 lg:mb-28">
          <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-orange mb-6">
            — 05 / Cisla
          </span>
          <h2
            className="font-serif text-cream leading-[0.98] text-[clamp(44px,5.6vw,80px)]"
          >
            <span className="block">Proc to funguje.</span>
            <span className="block text-cream/55 pl-[0.5em]">
              Protoze to funguje.
            </span>
          </h2>
        </div>

        {/* Stats layout */}
        <div className="relative lg:min-h-[880px]">
          {/* Stat 01 — Events */}
          <div
            className={cn(
              'mb-16 lg:mb-0',
              'lg:absolute lg:left-0 lg:top-0 lg:w-[50%]'
            )}
          >
            <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-orange mb-3">
              Akci odehrano
            </span>
            <span
              className="block font-mono text-cream leading-none whitespace-nowrap"
              style={{
                fontSize: 'clamp(120px, 17vw, 220px)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              47
            </span>
            <span className="block text-cream/70 text-[16px] mt-4 max-w-[360px]">
              Od prvniho dinneru v roce 2023.
            </span>
          </div>

          {/* Stat 02 — Attendees */}
          <div
            className={cn(
              'mb-16 lg:mb-0',
              'lg:absolute lg:right-[4%] lg:top-[240px] lg:w-[34%]'
            )}
          >
            <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-orange mb-3">
              Ucastniku
            </span>
            <span
              className="block font-mono text-cream leading-none whitespace-nowrap"
              style={{
                fontSize: 'clamp(72px, 12vw, 164px)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              6 850+
            </span>
            <span className="block text-cream/70 text-[16px] mt-4 max-w-[360px]">
              Unikatnich lidi proslo akcemi.
            </span>
          </div>

          {/* Stat 03 — Occupancy */}
          <div
            className={cn(
              'mb-16 lg:mb-0',
              'lg:absolute lg:left-[8%] lg:top-[440px] lg:w-[42%]'
            )}
          >
            <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-orange mb-3">
              Prumerna obsazenost
            </span>
            <span
              className="block font-mono text-cream leading-none whitespace-nowrap"
              style={{
                fontSize: 'clamp(80px, 14vw, 188px)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              94%
            </span>
            <span className="block text-cream/70 text-[16px] mt-4 max-w-[360px]">
              Vetsina akci vyproda tyden predem.
            </span>
          </div>

          {/* Stat 04 — ROI quote */}
          <div
            className={cn(
              'mb-16 lg:mb-0',
              'lg:absolute lg:right-0 lg:top-[560px] lg:w-[50%]'
            )}
          >
            <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-orange mb-3">
              Prumerne ROI
            </span>
            <p className="font-serif italic text-cream text-[22px] lg:text-[26px] leading-[1.4] max-w-[480px] mt-4">
              &bdquo;Po trech akcich jsem uzavrel spolupraci za 1,2 M. Cena
              vstupneho se mi vratila 47&times;.&ldquo;
            </p>
            <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-cream/60 mt-4">
              — Jakub K., CEO
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
