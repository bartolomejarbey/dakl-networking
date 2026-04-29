import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { Duotone } from '@/components/ui/Duotone'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { CaptionBlock } from '@/components/ui/CaptionBlock'
import Link from 'next/link'

const interview = [
  {
    question: 'Proč pořádáš DaKl Networking?',
    answer:
      'Protože většina networkingu, kterou jsem zažil, byla nudná, formální a po dvou hodinách v zasedačce jsi rád, že jdeš pryč. Tohle je opak — večer, ze kterého ráno něco zbyde v telefonu.',
  },
  {
    question: 'Pro koho to děláš?',
    answer:
      'Pro lidi, co něco dělají. Vlastníky firem, freelancery, manažery. Nikoho, kdo přišel hledat klienty z řad jiných hostů. Filtruju to osobně.',
  },
  {
    question: 'Co znamená „neřízený networking"?',
    answer:
      'Žádné nucené kolečko představování. Žádné jmenovky s funkcí. Volný pohyb po lodi, jídlo a pití po celou dobu, DJs. Lidi se potkají sami, když to dává smysl.',
  },
  {
    question: 'Co tě k tomu přivedlo?',
    answer:
      'Mám rád lidi, mám rád kvalitní jídlo, mám rád dobrou hudbu. Tohle jsou tři věci, které když dáš dohromady ve správném prostředí, vznikají vztahy, které drží. Ne kontakty, vztahy.',
  },
  {
    question: 'A Bonum Negotium?',
    answer:
      'To je sesterský projekt — benefity pro firmy, co rostou. Sám se na akcích občas potkám s majiteli firem, co potřebují benefitového partnera. Nepřekvapilo mě, že DaKl a Bonum začaly vzájemně dávat smysl.',
  },
  {
    question: 'Kam to chceš dotáhnout?',
    answer:
      'Není to o škálování. Je to o kvalitě jednoho večera. Když odjedeš z lodi a do týdne ti někdo z těch lidí napíše „mám pro tebe nápad" — tak to fungovalo.',
  },
]

export default function DavidKladisovskyPage() {
  return (
    <>
      <Navbar solid />
      <main>
        {/* I — Cover portrait */}
        <section className="relative bg-forest-deep text-cream pt-32 lg:pt-40 pb-20 lg:pb-28 overflow-hidden">
          <GrainOverlay opacity={0.04} />
          <Container className="relative z-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-12">
              <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
                §&nbsp;Rozhovor — Pořadatel
              </p>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-cream/55">
                Vydání 04 · Duben 2026
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
              <div className="lg:col-span-7">
                <h1
                  className="font-serif text-cream leading-[0.96] tracking-[-0.025em] text-[clamp(56px,11vw,180px)]"
                  style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
                >
                  David
                  <span className="block italic text-cream/85 pl-[0.4em]">
                    Kladišovský.
                  </span>
                </h1>
                <p className="mt-10 font-mono text-[11px] tracking-[0.22em] uppercase text-cream/65 max-w-[560px] leading-[1.7]">
                  Pořadatel DaKl Networking · Zakladatel Bonum Negotium · Brno 1991 · Praha od 2018
                </p>
              </div>

              <figure className="lg:col-span-5">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1px] bg-forest">
                  <Duotone
                    src="/images/david.jpg"
                    alt="David Kladišovský"
                    fill
                    variant="forest-cream"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute top-5 left-5 font-mono text-[10px] tracking-[0.24em] uppercase text-cream border border-cream/60 px-3 py-1.5 rounded-[1px] backdrop-blur-sm bg-forest-deep/40"
                  >
                    Portrét · 4:5
                  </span>
                </div>
                <CaptionBlock
                  code="DK-001 · POŘADATEL"
                  location="Praha · leden 2026"
                  meta="Foto z archivu"
                  className="mt-4"
                />
              </figure>
            </div>
          </Container>
        </section>

        {/* II — Q&A */}
        <section className="relative bg-cream text-ink py-24 lg:py-36 grain grain-light">
          <Container>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between mb-14 lg:mb-20">
              <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange">
                §&nbsp;II — Rozhovor
              </p>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/60">
                {String(interview.length).padStart(2, '0')}&nbsp;otázek
              </p>
            </div>

            <h2
              className="font-serif text-ink leading-[1] tracking-[-0.02em] text-[clamp(40px,6vw,96px)] mb-16 lg:mb-24 max-w-[1100px]"
              style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
            >
              Krátký rozhovor
              <span className="block italic text-ink-soft pl-[0.4em]">
                bez přepychu.
              </span>
            </h2>

            <ol className="border-t border-ink/15">
              {interview.map((item, i) => (
                <li
                  key={i}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start py-12 lg:py-16 border-b border-ink/15"
                >
                  <div className="lg:col-span-4">
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-orange mb-3 tabular-nums">
                      Q{String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="font-mono text-ink text-[14px] lg:text-[15px] tracking-[0.06em] uppercase font-medium leading-[1.5]">
                      {item.question}
                    </h3>
                  </div>
                  <div className="lg:col-span-8">
                    <p
                      className="font-serif italic text-ink text-[clamp(20px,2.4vw,30px)] leading-[1.4] first-line:font-serif"
                      style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* III — Colophon */}
        <section className="bg-cream text-ink py-24 lg:py-32">
          <Container>
            <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-10">
              §&nbsp;III — Kolofón
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 max-w-[1080px]">
              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 mb-3">
                  Sesterský projekt
                </p>
                <p className="font-serif italic text-[28px] lg:text-[32px] leading-[1.15] text-ink mb-4">
                  Bonum Negotium
                </p>
                <p className="text-ink-soft text-[16px] leading-[1.55] mb-5">
                  Benefity pro firmy, co rostou. Stravenky, poukazy, wellness.
                </p>
                <a
                  href="https://bonumnegotium.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] tracking-[0.22em] uppercase text-orange border-b border-orange/40 hover:border-orange transition-colors pb-1"
                >
                  bonumnegotium.cz &rarr;
                </a>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 mb-3">
                  Kontakt
                </p>
                <ul className="space-y-2.5 font-mono text-[14px] text-ink">
                  <li>
                    <a href="mailto:david@daklnetworking.cz" className="hover:text-orange transition-colors">
                      david@daklnetworking.cz
                    </a>
                  </li>
                  <li>
                    <a href="tel:+420601348249" className="hover:text-orange transition-colors">
                      +420 601 348 249
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com/in/davidkladisovsky"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange transition-colors"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://instagram.com/daklnetworking"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange transition-colors"
                    >
                      @daklnetworking
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/55 mb-3">
                  Další vydání
                </p>
                <p className="font-serif italic text-[20px] lg:text-[22px] leading-[1.4] text-ink mb-5">
                  Pozvánky chodí přihlášeným odběratelům. Žádný marketing.
                </p>
                <Link
                  href="/#odber"
                  className="font-mono text-[11px] tracking-[0.22em] uppercase text-orange border-b border-orange/40 hover:border-orange transition-colors pb-1"
                >
                  Přihlásit k odběru &rarr;
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
