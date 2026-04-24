import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';

interface PageProps {
  params: { slug: string };
  searchParams: { order?: string };
}

export default function PotvrzeniPage({ params, searchParams }: PageProps) {
  if (params.slug !== 'kayak-beach-bar') {
    notFound();
  }

  const orderNumber = searchParams.order || 'CN-2026-XXXX';

  return (
    <>
      <Navbar />
      <main>
        {/* Hero section */}
        <section className="bg-forest pt-[140px] pb-[140px] max-md:pt-[100px] max-md:pb-[100px]">
          <Container>
            <div className="flex flex-col items-center text-center">
              <div className="w-[80px] h-[80px] rounded-full bg-cream/20 flex items-center justify-center mb-8">
                <Check className="w-[48px] h-[48px] text-cream" strokeWidth={2.5} />
              </div>
              <h1 className="font-serif text-cream text-[clamp(40px,5.2vw,72px)] leading-tight mb-6">
                Hotovo. Vidíme se na akci.
              </h1>
              <p className="font-mono text-cream/80 text-sm tracking-wide">
                Kayak Beach Bar · 24.04.2026 · 15:00–23:30
              </p>
            </div>
          </Container>
        </section>

        {/* Cards section */}
        <section className="bg-cream pt-[140px] pb-[140px] max-md:pt-[100px] max-md:pb-[100px]">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {/* Card 1: Calendar */}
              <div className="bg-white rounded-[2px] p-8 shadow-sm">
                <h2 className="font-serif text-ink text-2xl mb-4">Přidat do kalendáře</h2>
                <p className="font-sans text-ink-soft text-base mb-6">
                  Přidej si akci do kalendáře, ať na ni nezapomeneš. Stáhne se ti .ics soubor.
                </p>
                <button className="inline-flex items-center justify-center px-7 py-4 bg-orange text-cream font-mono text-[13px] uppercase tracking-[0.08em] font-medium rounded-[2px] hover:bg-orange-dark transition-colors">
                  Stáhnout .ics
                </button>
              </div>

              {/* Card 2: Updates */}
              <div className="bg-white rounded-[2px] p-8 shadow-sm">
                <h2 className="font-serif text-ink text-2xl mb-4">Sledovat updates</h2>
                <p className="font-sans text-ink-soft text-base mb-6">
                  Sleduj nás na sociálních sítích a buď v obraze o novinkách a dalších akcích.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://instagram.com/conventus.cz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-forest text-sm hover:underline"
                  >
                    → Instagram
                  </a>
                  <a
                    href="https://linkedin.com/company/conventus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-forest text-sm hover:underline"
                  >
                    → LinkedIn
                  </a>
                </div>
              </div>

              {/* Card 3: Referral */}
              <div className="bg-white rounded-[2px] p-8 shadow-sm">
                <h2 className="font-serif text-ink text-2xl mb-4">Pozvat přítele</h2>
                <p className="font-sans text-ink-soft text-base mb-6">
                  Referral program spouštíme brzy. Pozvi kamaráda a získej slevu na příští akci.
                </p>
                <span className="font-mono text-ink-soft text-sm">Již brzy</span>
              </div>
            </div>

            {/* What to expect */}
            <div className="max-w-[720px] mx-auto">
              <h2 className="font-serif text-ink text-3xl mb-8">Co očekávat</h2>
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <span className="w-2 h-2 rounded-full bg-orange mt-2.5 shrink-0" />
                  <p className="font-sans text-ink text-lg">
                    Do 15 minut dostaneš email s fakturou a detaily
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="w-2 h-2 rounded-full bg-orange mt-2.5 shrink-0" />
                  <p className="font-sans text-ink text-lg">
                    Den před akcí ti pošleme připomínku
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="w-2 h-2 rounded-full bg-orange mt-2.5 shrink-0" />
                  <p className="font-sans text-ink text-lg">
                    Když se nemůžeš dostavit, dej nám vědět 48h předem
                  </p>
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
