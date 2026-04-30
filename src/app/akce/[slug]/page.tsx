import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { EventHero } from '@/components/event/EventHero'
import { EventProgram } from '@/components/event/EventProgram'
import { EventLocation } from '@/components/event/EventLocation'
import { EventFAQ } from '@/components/event/EventFAQ'
import { EventCTA } from '@/components/event/EventCTA'
import { EventJsonLd } from '@/components/seo/EventJsonLd'
import { getEventBySlug } from '@/lib/events/queries'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Metadata } from 'next'
import type { FAQ } from '@/types/database'

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Akce nenalezena' }
  return {
    title: event.meta_title ?? event.name,
    description:
      event.meta_description ??
      event.short_description ??
      'DaKl Networking · Setkání podnikatelů, co něco dělají.',
    openGraph: {
      title: event.name,
      description: event.short_description ?? undefined,
      images: event.og_image_url
        ? [{ url: event.og_image_url, width: 1200, height: 630 }]
        : event.hero_image_url
          ? [{ url: event.hero_image_url }]
          : undefined,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: event.name,
      description: event.short_description ?? undefined,
    },
  }
}

const KAYAK_FAQS: Pick<FAQ, 'question' | 'answer'>[] = [
  {
    question: 'Co bylo zahrnuto v ceně?',
    answer:
      'Všechno. Jídlo, pití (alkoholické i nealkoholické), aktivity, vstup. Žádné domlouvání u baru.',
  },
  {
    question: 'Jaký byl dress code?',
    answer: 'Casual / smart casual. Jsi na pláži u řeky, ne v kanceláři.',
  },
  {
    question: 'Kdy bude další akce?',
    answer:
      'Datum oznámíme přihlášeným odběratelům jako prvním. Přihlas se na homepage.',
  },
  {
    question: 'Můžu se podívat na fotky a zápis?',
    answer:
      'Pracujeme na zápisu z lodi. Pošleme ho přihlášeným odběratelům spolu s pozvánkou na další vydání.',
  },
]

async function fetchFaqs(eventId: string, slug: string) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('faqs')
    .select('question, answer, sort_order')
    .or(`event_id.eq.${eventId},event_id.is.null`)
    .order('sort_order', { ascending: true })
  const dbFaqs = (data ?? []) as Array<Pick<FAQ, 'question' | 'answer'>>
  if (dbFaqs.length > 0) return dbFaqs
  if (slug === 'kayak-beach-bar') return KAYAK_FAQS
  return []
}

async function fetchSoldCount(eventId: string): Promise<number> {
  const supabase = createAdminClient()
  const { count } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId)
    .eq('payment_status', 'paid')
  return count ?? 0
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const [faqs, soldCount] = await Promise.all([fetchFaqs(event.id, slug), fetchSoldCount(event.id)])

  return (
    <>
      <Navbar
        ctaHref={event.status === 'published' ? `/akce/${event.slug}/prihlaska` : '/#odber'}
        ctaLabel={event.status === 'published' ? 'Přihlásit' : 'Odebírat'}
      />
      <EventJsonLd event={event} />
      <main>
        <EventHero event={event} soldCount={soldCount} />

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

        {event.program_json && Array.isArray(event.program_json) && event.program_json.length > 0 && (
          <EventProgram program={event.program_json} />
        )}
        <EventLocation event={event} />
        {faqs.length > 0 && <EventFAQ faqs={faqs} />}
        <EventCTA event={event} soldCount={soldCount} />
      </main>
      <Footer />
    </>
  )
}
