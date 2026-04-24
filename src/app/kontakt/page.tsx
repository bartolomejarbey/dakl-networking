import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/layout/Container';

export default function KontaktPage() {
  return (
    <>
      <Navbar solid />
      <main>
        {/* Hero */}
        <section className="bg-cream pt-[140px] pb-[140px] max-md:pt-[100px] max-md:pb-[100px]">
          <Container>
            <h1 className="font-serif text-ink text-[clamp(40px,5.2vw,72px)] leading-tight mb-16">
              Kontakt
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
              {/* Left: General Contact */}
              <div className="md:col-span-6">
                <div className="mb-10">
                  <h2 className="font-mono text-ink-soft text-xs uppercase tracking-widest mb-6">
                    Obecný kontakt
                  </h2>
                  <ul className="space-y-4">
                    <li>
                      <span className="font-mono text-ink-soft text-sm block mb-1">Email</span>
                      <a
                        href="mailto:david@conventus.cz"
                        className="font-sans text-ink text-lg hover:text-forest transition-colors"
                      >
                        david@conventus.cz
                      </a>
                    </li>
                    <li>
                      <span className="font-mono text-ink-soft text-sm block mb-1">Instagram</span>
                      <a
                        href="https://instagram.com/conventus.cz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-ink text-lg hover:text-forest transition-colors"
                      >
                        @conventus.cz
                      </a>
                    </li>
                    <li>
                      <span className="font-mono text-ink-soft text-sm block mb-1">Adresa</span>
                      <p className="font-sans text-ink text-lg">Praha, Česká republika</p>
                    </li>
                  </ul>
                </div>

                {/* Contact Form */}
                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="font-mono text-ink-soft text-xs uppercase tracking-widest block mb-2"
                    >
                      Jméno
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 bg-cream border border-ink/10 rounded-[2px] font-sans text-ink text-base focus:outline-none focus:border-forest transition-colors"
                      placeholder="Tvoje jméno"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="font-mono text-ink-soft text-xs uppercase tracking-widest block mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 bg-cream border border-ink/10 rounded-[2px] font-sans text-ink text-base focus:outline-none focus:border-forest transition-colors"
                      placeholder="tvuj@email.cz"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="font-mono text-ink-soft text-xs uppercase tracking-widest block mb-2"
                    >
                      Zpráva
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full px-4 py-3 bg-cream border border-ink/10 rounded-[2px] font-sans text-ink text-base focus:outline-none focus:border-forest transition-colors resize-none"
                      placeholder="Napiš nám..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-7 py-4 bg-orange text-cream font-mono text-[13px] uppercase tracking-[0.08em] font-medium rounded-[2px] hover:bg-orange-dark transition-colors"
                  >
                    Odeslat zprávu
                  </button>
                </form>
              </div>

              {/* Right: Partnership */}
              <div className="md:col-span-6">
                <h2 className="font-serif text-ink text-3xl mb-4">Partnerství a sponzoring</h2>
                <p className="font-sans text-ink-soft text-lg mb-8">
                  Chceš být na akci jako partner? Nabízíme různé formy spolupráce pro značky,
                  které chtějí oslovit komunitu aktivních podnikatelů.
                </p>
                <ul className="space-y-3 mb-10">
                  <li className="flex gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange mt-2.5 shrink-0" />
                    <span className="font-sans text-ink text-base">
                      Branding na akci a v komunikaci
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange mt-2.5 shrink-0" />
                    <span className="font-sans text-ink text-base">
                      Přístup k cílové skupině podnikatelů
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange mt-2.5 shrink-0" />
                    <span className="font-sans text-ink text-base">
                      Možnost vlastní prezentace nebo workshopu
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-2 h-2 rounded-full bg-orange mt-2.5 shrink-0" />
                    <span className="font-sans text-ink text-base">
                      VIP vstupenky pro váš tým
                    </span>
                  </li>
                </ul>
                <p className="font-sans text-ink text-base">
                  Napiš nám na{' '}
                  <a
                    href="mailto:david@conventus.cz"
                    className="text-forest font-medium hover:underline"
                  >
                    david@conventus.cz
                  </a>
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
