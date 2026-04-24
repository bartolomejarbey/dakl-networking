import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { CountdownTimer } from '@/components/ui/CountdownTimer'

interface HeroSectionProps {
  ctaHref?: string
  ctaLabel?: string
  nextEventDate?: string
  nextEventVenue?: string
}

const headlineLines = [
  'Neřízený networking.',
  'Lidé, co něco dělají.',
  'Večer, po kterém něco zbyde.',
]

const blobMask = `url("data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M421.5,301.5Q393,353,358.5,399Q324,445,267,447.5Q210,450,163,418.5Q116,387,89,339Q62,291,57,237.5Q52,184,88,141.5Q124,99,170,72Q216,45,270,42Q324,39,366.5,74.5Q409,110,432,165Q455,220,440.5,265Q426,310,421.5,301.5Z' fill='white'/%3E%3C/svg%3E")`

export function HeroSection({
  ctaHref = '#',
  ctaLabel = 'Přihlásit na 24.4. →',
  nextEventDate,
  nextEventVenue,
}: HeroSectionProps) {
  // Split all lines into words with line tracking for stagger
  const allWords: { word: string; lineIndex: number }[] = []
  headlineLines.forEach((line, lineIndex) => {
    line.split(' ').forEach((word) => {
      allWords.push({ word, lineIndex })
    })
  })

  return (
    <section className="relative min-h-screen bg-teal overflow-hidden">
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #F5EFE2 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <Container className="relative z-10 min-h-screen flex flex-col">
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 flex-1 items-center pt-32 lg:pt-0">
          {/* Left content — col 1-7 */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Section label */}
            <span
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/60"
            >
              — 01 / Většina sítí není síť
            </span>

            {/* Headline with word-by-word stagger via CSS animation */}
            <h1
              className="font-serif text-cream leading-[0.98] text-[clamp(44px,6.6vw,96px)]"
            >
              {headlineLines.map((line, lineIndex) => {
                const wordsBeforeLine = headlineLines
                  .slice(0, lineIndex)
                  .reduce((count, l) => count + l.split(' ').length, 0)

                return (
                  <span key={lineIndex} className="block">
                    {line.split(' ').map((word, wordIndex) => {
                      const globalIndex = wordsBeforeLine + wordIndex
                      return (
                        <span
                          key={`${lineIndex}-${wordIndex}`}
                          className="inline-block mr-[0.24em] animate-fade-in-up"
                          style={{ animationDelay: `${0.4 + globalIndex * 0.08}s` }}
                        >
                          {word}
                        </span>
                      )
                    })}
                  </span>
                )
              })}
            </h1>

            {/* Subtitle */}
            <p
              className="text-[19px] leading-[1.5] text-cream/[0.72] max-w-[540px]"
            >
              Jedny z nejlepších ROI business akcí v ČR. Každý měsíc jiný
              formát, pokaždé 150 lidí, co něco dělají.
            </p>

            {/* Action buttons */}
            <div
              className="flex flex-wrap items-center gap-6"
            >
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2.5 bg-orange text-cream font-mono text-[13px] tracking-[0.08em] uppercase font-medium px-7 py-5 rounded-[2px] transition-colors hover:bg-orange-dark"
              >
                {ctaLabel}
              </Link>
              <Link
                href="#principy"
                className="font-mono text-[13px] tracking-[0.08em] uppercase text-cream underline underline-offset-4 decoration-cream/40 hover:decoration-cream transition-colors"
              >
                Jak to funguje
              </Link>
            </div>
          </div>

          {/* Right side — col 8-12: hero image */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div
              className="relative w-full max-w-[520px] aspect-[4/5] overflow-hidden"
            >
              {/* Paint drip decorative circles */}
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-orange/20" />
              <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-orange/30" />
              <div className="absolute top-1/2 -right-8 w-10 h-10 rounded-full bg-cream/10" />

              {/* Hero image with blob mask */}
              <div
                className="relative w-full h-full overflow-hidden"
                style={{
                  maskImage: blobMask,
                  WebkitMaskImage: blobMask,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?auto=format&fit=crop&w=1400&q=80"
                  alt="Conventus networking event"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom area */}
        <div className="relative pb-10 lg:pb-16 mt-12 lg:mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Scroll indicator — desktop only */}
            <div className="hidden lg:flex lg:col-span-4 items-end">
              <div
                className="flex items-center gap-3"
              >
                <div className="w-px h-12 bg-cream/30" />
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-cream/40">
                  Scrolluj dolů
                </span>
              </div>
            </div>

            {/* Countdown — bottom-right on desktop, below content on mobile */}
            {nextEventDate && (
              <div className="lg:col-span-5 lg:col-start-8 flex justify-center lg:justify-end">
                <div>
                  <CountdownTimer
                    targetDate={nextEventDate}
                    venueName={nextEventVenue}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
