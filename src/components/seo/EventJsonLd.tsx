import type { Event } from '@/types/database'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://daklnetworking.cz'

export function EventJsonLd({ event }: { event: Event }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.short_description ?? undefined,
    startDate: event.starts_at,
    endDate: event.ends_at,
    eventStatus:
      event.status === 'cancelled'
        ? 'https://schema.org/EventCancelled'
        : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: event.location_name
      ? {
          '@type': 'Place',
          name: event.location_name,
          address: event.location_address
            ? {
                '@type': 'PostalAddress',
                streetAddress: event.location_address,
                addressLocality: 'Praha',
                addressCountry: 'CZ',
              }
            : undefined,
          ...(event.location_gps_lat && event.location_gps_lng
            ? {
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: event.location_gps_lat,
                  longitude: event.location_gps_lng,
                },
              }
            : {}),
        }
      : undefined,
    image: event.og_image_url || event.hero_image_url || `${APP_URL}/og-default.jpg`,
    organizer: {
      '@type': 'Organization',
      name: 'DaKl Networking',
      url: APP_URL,
    },
    offers:
      event.price_czk > 0
        ? {
            '@type': 'Offer',
            price: event.price_czk,
            priceCurrency: 'CZK',
            availability:
              event.status === 'published'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/SoldOut',
            url: `${APP_URL}/akce/${event.slug}/prihlaska`,
            validFrom: event.published_at ?? event.created_at,
          }
        : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
