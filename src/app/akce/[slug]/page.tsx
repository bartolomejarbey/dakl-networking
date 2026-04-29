import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { EventHero } from '@/components/event/EventHero'
import { EventProgram } from '@/components/event/EventProgram'
import { EventLocation } from '@/components/event/EventLocation'
import { EventFAQ } from '@/components/event/EventFAQ'
import { EventCTA } from '@/components/event/EventCTA'
import type { Event } from '@/types/database'

const baseEvent = {
  long_description:
    'Celý večer na lodi. Žádné přednášky, žádný program, který tě nutí sedět. Volný pohyb, jídlo a pití po celou dobu, DJs, paddleboardy, beachvolejbal. Potkej lidi, co něco dělají.',
  meta_title: 'Neřízený networking na lodi | DaKl Networking',
  meta_description: 'Networking pro podnikatele na lodi Kayak Beach Bar.',
  og_image_url: null,
  published_at: '2026-03-01T10:00:00+01:00',
  created_at: '2026-03-01T10:00:00+01:00',
  updated_at: '2026-04-25T00:00:00Z',
  created_by: null,
}

const KAYAK_EVENT: Event = {
  ...baseEvent,
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
  program_json: [
    { time: '15:00', title: 'Příchod a registrace', description: 'Check-in, uvítací drink' },
    { time: '15:30', title: 'Jídlo a pití', description: 'Bufet po celou dobu akce' },
    { time: '16:00', title: 'DJs', description: 'Od chill beatů po taneční set' },
    { time: '16:30', title: 'Aktivity', description: 'Paddleboardy, kajaky, beachvolejbal' },
    { time: '20:00', title: 'Networking peak', description: 'Hlavní část večera' },
    { time: '23:30', title: 'Konec', description: 'Poslední drink a rozloučení' },
  ],
  status: 'archived',
}

const KAYAK_FAQS = [
  {
    question: 'Co bylo zahrnuto v ceně?',
    answer: 'Všechno. Jídlo, pití (alkoholické i nealkoholické), aktivity, vstup. Žádné domlouvání u baru.',
  },
  {
    question: 'Jaký byl dress code?',
    answer: 'Casual / smart casual. Jsi na pláži u řeky, ne v kanceláři.',
  },
  {
    question: 'Kdy bude další akce?',
    answer: 'Datum oznámíme přihlášeným odběratelům jako prvním. Přihlas se na homepage.',
  },
  {
    question: 'Můžu se podívat na fotky a zápis?',
    answer: 'Pracujeme na zápisu z lodi. Pošleme ho přihlášeným odběratelům spolu s pozvánkou na další vydání.',
  },
]

const SOLD_COUNT = 150

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params

  if (slug !== 'kayak-beach-bar') {
    notFound()
  }

  const event = KAYAK_EVENT

  return (
    <>
      <Navbar
        ctaHref={event.status === 'published' ? `/akce/${event.slug}/prihlaska` : '/#odber'}
        ctaLabel={event.status === 'published' ? 'Přihlásit' : 'Odebírat'}
      />
      <main>
        <EventHero event={event} soldCount={SOLD_COUNT} />

        {/* Editor's letter — magazine spread feel */}
        {event.long_description && (
          <section className="bg-cream text-ink py-24 lg:py-32">
            <Container>
              <div className="max-w-editorial mx-auto">
                <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-orange mb-8">
                  §&nbsp;Slovo pořadatele
                </p>
                <p className="dropcap font-serif text-[20px] lg:text-[22px] leading-[1.55] text-ink-soft">
                  {event.long_description}
                </p>
                <p className="mt-10 font-mono text-[10px] tracking-[0.22em] uppercase text-ink-soft/60">
                  — David Kladišovský, pořadatel
                </p>
              </div>
            </Container>
          </section>
        )}

        {event.program_json && <EventProgram program={event.program_json} />}
        <EventLocation event={event} />
        <EventFAQ faqs={KAYAK_FAQS} />
        <EventCTA event={event} soldCount={SOLD_COUNT} />
      </main>
      <Footer />
    </>
  )
}
