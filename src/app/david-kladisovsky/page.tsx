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
        <section className="bg-forest pt-[140px] pb-[140px] max-md:pt-[100px] max-md:pb-[100px]">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-7">
                <h1 className="font-serif text-cream text-[clamp(40px,5.2vw,72px)] leading-tight mb-4">
                  David Kladišovský
                </h1>
                <p className="font-mono text-cream/70 text-sm tracking-wide">
                  Pořadatel DaKl Networking · Zakladatel Bonum Negotium
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
              <h2 className="font-serif text-ink text-3xl mb-8">Proč dělám DaKl Networking</h2>
              <div className="space-y-6 font-sans text-ink text-lg leading-relaxed">
                <p>
                  DaKl Networking pořádám pro lidi, kteří něco dělají — vlastníky firem,
                  freelancery, manažery, co si jednou za čas potřebují vyrazit z kanceláře
                  a potkat se s někým, s kým dává smysl mluvit o byznysu.
                </p>
                <p>
                  Bez prezentací. Bez networkingových her. Bez kafe v zasedačce. Místo toho:
                  loď na Vltavě, dobrá kuchyně, pití, hudba, pár hodin, kdy nikam nemusíš
                  a přesto odjedeš s kontakty, co ti za rok vydělají.
                </p>
                <p>
                  Každá akce je jiná — od degustací vína přes mořské plody po letní párty
                  na lodi. Místo si filtruji sám. Kvalita lidí je to, co DaKl dělá DaKl.
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
                  Vedle DaKl vedu Bonum Negotium — firmu, která dodává benefity,
                  stravenky a poukazy firmám, co rostou. S rostoucí firmou roste
                  i potřeba se o lidi postarat a ne přijít o ně do měsíce.
                </p>
                <p>
                  DaKl a Bonum Negotium se potkávají. Na akcích jsou často lidi,
                  kterým se hodí benefitový partner. Pokud děláš něco, co mě zaujme,
                  možná ti pošlu nabídku.
                </p>
              </div>
              <a
                href="https://bonumnegotium.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-8 font-mono text-forest text-sm hover:underline"
              >
                → bonumnegotium.cz
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
                    href="mailto:david@daklnetworking.cz"
                    className="font-mono text-ink text-base hover:text-forest transition-colors"
                  >
                    david@daklnetworking.cz
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/davidkladisovsky"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-ink text-base hover:text-forest transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/daklnetworking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-ink text-base hover:text-forest transition-colors"
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
