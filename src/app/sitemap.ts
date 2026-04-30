import type { MetadataRoute } from 'next'
import { listPublicEvents } from '@/lib/events/queries'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://daklnetworking.cz'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await listPublicEvents()
  const now = new Date().toISOString()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${APP_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${APP_URL}/akce`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${APP_URL}/david-kladisovsky`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${APP_URL}/kontakt`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${APP_URL}/podminky`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${APP_URL}/ochrana-osobnich-udaju`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const eventRoutes: MetadataRoute.Sitemap = events
    .filter((e) => e.status === 'published' || e.status === 'archived')
    .map((event) => ({
      url: `${APP_URL}/akce/${event.slug}`,
      lastModified: event.updated_at,
      changeFrequency: event.status === 'published' ? 'weekly' : 'monthly',
      priority: event.status === 'published' ? 0.9 : 0.5,
    }))

  return [...staticRoutes, ...eventRoutes]
}
