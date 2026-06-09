import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://versavid.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://versavid.com/dashboard', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://versavid.com/create', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
