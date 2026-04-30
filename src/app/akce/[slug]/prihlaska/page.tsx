import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { CheckoutWizard } from '@/components/checkout/CheckoutWizard'
import { getEventBySlug } from '@/lib/events/queries'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const metadata: Metadata = {
  title: 'Přihláška | DaKl Networking',
  robots: { index: false, follow: false },
}

export default async function CheckoutPage({ params }: PageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const isOpen = event.status === 'published'

  return (
    <>
      <Navbar solid ctaHref="/#odber" ctaLabel="Odebírat" />
      <main>
        {isOpen ? (
          <CheckoutWizard event={event} />
        ) : (
          <section className="relative bg-cream text-ink pt-32 lg:pt-40 pb-32 min-h-[80vh] grain grain-light">
            <Container>
              <div className="max-w-[720px] mx-auto text-center">
                <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-10">
                  §&nbsp;Přihláška — {event.status === 'archived' ? 'Uzavřená' : 'Nedostupná'}
                </p>
                <h1
                  className="font-serif italic text-ink leading-[0.96] tracking-[-0.022em] text-[clamp(48px,8vw,128px)] mb-7"
                  style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
                >
                  {event.status === 'archived' ? (
                    <>
                      Tohle vydání
                      <span className="block">už proběhlo.</span>
                    </>
                  ) : (
                    <>
                      Přihlášky ještě
                      <span className="block">nejsou otevřené.</span>
                    </>
                  )}
                </h1>
                <p className="font-serif italic text-[clamp(20px,2.6vw,28px)] leading-[1.45] text-ink-soft mb-12 max-w-[560px] mx-auto">
                  {event.status === 'archived'
                    ? 'Děkujeme všem, kdo dorazili. Příští vydání oznámíme přihlášeným odběratelům jako prvním.'
                    : 'Pozvánku pošleme přihlášeným odběratelům jako prvním.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center">
                  <Link
                    href="/#odber"
                    className="group inline-flex items-center justify-center gap-3 bg-orange hover:bg-orange-dark text-cream font-mono text-[11px] tracking-[0.22em] uppercase font-semibold px-7 py-4 rounded-[1px] border-2 border-orange transition-colors duration-300"
                  >
                    Buď u dalšího
                    <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden>
                      &rarr;
                    </span>
                  </Link>
                  <Link
                    href="/akce"
                    className="group inline-flex items-center justify-center gap-3 border-2 border-ink/30 hover:border-ink text-ink font-mono text-[11px] tracking-[0.22em] uppercase font-semibold px-7 py-4 rounded-[1px] transition-colors duration-300"
                  >
                    Otevřít archiv
                    <span className="transition-transform duration-300 ease-editorial group-hover:translate-x-1" aria-hidden>
                      &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            </Container>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
