import { Container } from '@/components/layout/Container'

const principles = [
  {
    number: '01',
    bold: 'Fixní cena, všechno v ceně.',
    text: '2 290 Kč. Nejíš za 500 Kč, nepiješ za 200 Kč. Zaplatíš jednou a máš večer.',
  },
  {
    number: '02',
    bold: 'Jen aktivní podnikatelé.',
    text: 'Žádní zvědavci, žádní MLM lovci, žádní teenageři s vizitkou. David filtruje.',
  },
  {
    number: '03',
    bold: 'Každý měsíc jiná akce.',
    text: 'Degustace vína. Mořské plody. Loď. Ne pořád ta samá kavárna se stejnou diskuzí.',
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
    <div
      className="grid grid-cols-[56px_1fr] lg:grid-cols-[96px_1fr] gap-4 py-8 border-t border-ink/10"
    >
      <span className="font-mono text-[22px] text-orange">{number}</span>
      <p className="text-[22px] leading-[1.5] text-ink-soft">
        <strong className="text-ink font-medium">{bold}</strong> {text}
      </p>
    </div>
  )
}

export function PrinciplesSection() {
  return (
    <section id="principy" className="bg-cream py-24 lg:py-40">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6">
          {/* Left — section label */}
          <div className="lg:col-span-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft/60">
              — 02 / O čem to je
            </span>
          </div>

          {/* Right — heading + principles */}
          <div className="lg:col-span-6 lg:col-start-4">
            {/* Heading */}
            <h2
              className="font-serif text-ink leading-[1.08] mb-16 text-[clamp(40px,5.2vw,72px)]"
            >
              <span className="block">Není to networking.</span>
              <span className="block md:pl-[80px]">
                Je to večer, po kterém něco zbyde.
              </span>
            </h2>

            {/* Principles list */}
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
