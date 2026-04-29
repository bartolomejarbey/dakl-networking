import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { CheckoutWizard } from '@/components/checkout/CheckoutWizard'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import type { Event } from '@/types/database'
import type { Metadata } from 'next'

const KAYAK_EVENT: Event = {
  id: '1',
  slug: 'kayak-beach-bar',
  name: 'Neřízený networking na lodi',
  type: 'lod',
  starts_at: '2026-04-24T15:00:00+02:00',
  ends_at: '2026-04-24T23:30:00+02:00',
  location_name: 'Kayak Beach Bar',
  location_address: 'Náplavka, Železniční most, Praha 2',
  location_gps_lat: 50.0693,
  location_gps_lng: 14.4148,
  price_czk: 2290,
  capacity: 150,
  hero_image_url: '/images/kaybeach.jpg',
  short_description:
    'Neformátní networking pro podnikatele na lodi. Jídlo, pití, DJs, aktivity — vše v ceně.',
  long_description: null,
  program_json: null,
  meta_title: 'Přihláška | DaKl Networking',
  meta_description: 'Přihláška na akci DaKl Networking',
  og_image_url: null,
  status: 'archived',
  published_at: '2026-03-01T10:00:00+01:00',
  created_at: '2026-03-01T10:00:00+01:00',
  updated_at: '2026-04-25T00:00:00Z',
  created_by: null,
}

const SOLD_COUNT = 150

export const metadata: Metadata = {
  title: 'Přihláška | DaKl Networking',
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CheckoutPage({ params }: PageProps) {
  const { slug } = await params

  if (slug !== 'kayak-beach-bar') {
    notFound()
  }

  const event = KAYAK_EVENT
  const isArchived = event.status === 'archived'

  return (
    <>
      <Navbar solid ctaHref="/#odber" ctaLabel="Odebírat" />
      <main>
        {isArchived ? (
          <section className="relative bg-cream text-ink pt-32 lg:pt-40 pb-32 min-h-[80vh] grain grain-light">
            <Container>
              <div className="max-w-[720px] mx-auto text-center">
                <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-10">
                  §&nbsp;Přihláška — Uzavřená
                </p>
                <h1
                  className="font-serif italic text-ink leading-[0.96] tracking-[-0.022em] text-[clamp(48px,8vw,128px)] mb-7"
                  style={{ paddingTop: '0.06em', paddingBottom: '0.06em' }}
                >
                  Tohle vydání
                  <span className="block">už proběhlo.</span>
                </h1>
                <p className="font-serif italic text-[clamp(20px,2.6vw,28px)] leading-[1.45] text-ink-soft mb-12 max-w-[560px] mx-auto">
                  Děkujeme všem, kdo dorazili. Příští vydání oznámíme přihlášeným odběratelům jako prvním.
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
        ) : (
          <CheckoutWizard event={event} soldCount={SOLD_COUNT} />
        )}
      </main>
      <Footer />
    </>
  )
}
