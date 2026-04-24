import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';

export default function DavidKladisovskyPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-teal pt-[140px] pb-[140px] max-md:pt-[100px] max-md:pb-[100px]">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-7">
                <h1 className="font-serif text-cream text-[clamp(40px,5.2vw,72px)] leading-tight mb-4">
                  David Kladišovský
                </h1>
                <p className="font-mono text-cream/70 text-sm tracking-wide">
                  Pořadatel Conventus · Zakladatel Bonum Negotium
                </p>
              </div>
              <div className="md:col-span-5">
                <div className="relative aspect-[4/5] w-full max-w-[400px] mx-auto rounded-[2px] overflow-hidden">
                  <Image
                    src="/images/david.jpg"
                    alt="David Kladišovský"
                    fill
                    className="object-cover grayscale"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Bio section */}
        <section className="bg-cream pt-[100px] pb-[80px] max-md:pt-[80px] max-md:pb-[60px]">
          <Container>
            <div className="max-w-[720px]">
              <h2 className="font-serif text-ink text-3xl mb-8">Proč dělám Conventus</h2>
              <div className="space-y-6 font-sans text-ink text-lg leading-relaxed">
                <p>
                  Conventus jsem založil v roce 2023, protože jsem věřil, že čeští podnikatelé
                  potřebují prostor pro setkávání, který není ani formální konference, ani random
                  networking. Chtěl jsem vytvořit místo, kde se lidé potkávají přirozeně, v
                  příjemném prostředí a s jasným účelem.
                </p>
                <p>
                  Od té doby jsme uspořádali 47 akcí a propojili přes 6 850 účastníků. Každá akce
                  je jiná — od komorních dinner pro 12 lidí po letní párty pro 200. Ale vždy
                  platí jedno: kvalita lidí a kvalita zážitku.
                </p>
                <p>
                  Věřím, že nejlepší byznysové příležitosti vznikají tam, kde se lidé cítí
                  uvolněně a otevřeně. Proto investuju tolik energie do kurátorství každé akce —
                  od výběru místa přes dramaturgii programu po osobní pozvánky.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Bonum Negotium section */}
        <section className="bg-cream pb-[80px] max-md:pb-[60px]">
          <Container>
            <div className="max-w-[720px]">
              <h2 className="font-serif text-ink text-3xl mb-8">Bonum Negotium</h2>
              <div className="space-y-6 font-sans text-ink text-lg leading-relaxed">
                <p>
                  Vedle Conventus vedu Bonum Negotium — poradenskou firmu zaměřenou na růst
                  malých a středních podniků. Pomáháme podnikatelům s obchodní strategií,
                  marketingem a budováním značky.
                </p>
                <p>
                  Conventus a Bonum Negotium se vzájemně doplňují. Akce mi umožňují být v
                  kontaktu s podnikatelskou komunitou a porozumět jejím potřebám. A díky
                  poradenské praxi vím, co podnikatelé skutečně řeší.
                </p>
              </div>
              <a
                href="https://bnservices.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-8 font-mono text-teal text-sm hover:underline"
              >
                → bnservices.cz
              </a>
            </div>
          </Container>
        </section>

        {/* Contact section */}
        <section className="bg-cream pb-[140px] max-md:pb-[100px]">
          <Container>
            <div className="max-w-[720px]">
              <h2 className="font-serif text-ink text-3xl mb-8">Kontakt</h2>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:david@conventus.cz"
                    className="font-mono text-ink text-base hover:text-teal transition-colors"
                  >
                    david@conventus.cz
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/davidkladisovsky"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-ink text-base hover:text-teal transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/conventus.cz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-ink text-base hover:text-teal transition-colors"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
