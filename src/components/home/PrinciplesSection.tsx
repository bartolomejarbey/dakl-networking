import Image from 'next/image'
import { Container } from '@/components/layout/Container'

const principles = [
  {
    number: '01',
    bold: 'Jedna cena, všechno uvnitř.',
    text: 'Jídlo, pití, program. Žádné domlouvání na baru, žádné zvlášť faktury. Zaplatíš jednou a máš večer.',
  },
  {
    number: '02',
    bold: 'Jen aktivní podnikatelé.',
    text: 'Žádní zvědavci, žádní MLM lovci, žádní teenageři s vizitkou. Každou akci David filtruje osobně.',
  },
  {
    number: '03',
    bold: 'Každý měsíc jiný formát.',
    text: 'Degustace vína, mořské plody, loď na Vltavě, letní párty. Ne pořád to samé kafe v zasedačce.',
  },
]

function PrincipleRow({
  number,
  bold,
  text,
}: {
  number: string
  bold: string
  text: string
}) {
  return (
    <div className="grid grid-cols-[48px_1fr] lg:grid-cols-[72px_1fr] gap-4 py-7 border-t border-ink/10">
      <span className="font-mono text-[20px] text-orange">{number}</span>
      <p className="text-[18px] lg:text-[20px] leading-[1.5] text-ink-soft">
        <strong className="text-ink font-medium">{bold}</strong> {text}
      </p>
    </div>
  )
}

export function PrinciplesSection() {
  return (
    <section id="principy" className="bg-cream py-24 lg:py-32">
      <Container>
        {/* Section label */}
        <div className="mb-12 lg:mb-16">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft/60">
            — O čem to je
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left — Photo */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px]">
              <Image
                src="/images/kaybeach.jpg"
                alt="Atmosféra DaKl Networking akcí"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 46vw"
              />
              <div className="absolute inset-0 bg-forest-deep/[0.10]" />
              {/* Orange tag */}
              <span className="absolute bottom-5 left-5 font-mono text-[10px] tracking-[0.16em] uppercase text-cream bg-forest-deep/70 backdrop-blur-sm px-3 py-1.5 rounded-[2px]">
                Networking · Praha · 2026
              </span>
            </div>
          </div>

          {/* Right — Heading + principles */}
          <div className="lg:col-span-6">
            <h2 className="font-serif text-ink leading-[1.05] mb-10 text-[clamp(40px,5.2vw,64px)]">
              <span className="block">Není to networking.</span>
              <span className="block md:pl-[60px]">
                Je to večer, po kterém něco zbyde.
              </span>
            </h2>

            <div className="flex flex-col">
              {principles.map((principle) => (
                <PrincipleRow
                  key={principle.number}
                  number={principle.number}
                  bold={principle.bold}
                  text={principle.text}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
