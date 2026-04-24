import { Container } from '@/components/layout/Container'

export function BonumSection() {
  return (
    <section className="relative bg-cream py-32 lg:py-40 overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">
          {/* Left — Label (col 1-3) */}
          <div className="lg:col-span-3">
            <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-orange">
              — 08 / Spoluprace
            </span>
          </div>

          {/* Right — Content (col 4-12) */}
          <div className="lg:col-span-9 border-l-4 border-orange pl-8 lg:pl-10">
            {/* Brand name */}
            <span className="block font-mono text-[18px] tracking-[0.14em] uppercase font-semibold text-orange mb-6">
              Bonum Negotium
            </span>

            {/* Heading */}
            <h2
              className="font-serif text-ink leading-[1.05] mb-8 text-[clamp(32px,4vw,52px)]"
            >
              <span className="block">Poskytujeme benefity firmam,</span>
              <span className="block md:pl-[80px]">
                ktere rostou nejrychleji v CR.
              </span>
            </h2>

            {/* Description */}
            <p className="text-[18px] leading-[1.55] text-ink-soft max-w-[640px] mb-10">
              Benefity, poukazy, stravenky, wellness. Kdyz na networkingu reknes,
              ze mas 50+ zamestnancu, mozna ti poslu nabidku.
            </p>

            {/* CTA link */}
            <a
              href="https://bonumnegotium.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-[22px] text-orange border-b-2 border-orange pb-1 hover:text-orange-dark hover:border-orange-dark transition-colors"
            >
              bonumnegotium.cz &rarr;
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
