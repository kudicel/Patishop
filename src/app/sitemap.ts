import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/db-products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base     = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop-gamma.vercel.app'
  const products = await getProducts()

  const productUrls: MetadataRoute.Sitemap = products.map(p => ({
    url:              `${base}/products/${p.id}`,
    lastModified:     new Date(),
    changeFrequency:  'weekly',
    priority:         0.8,
  }))

  return [
    {
      url:             base,
      lastModified:    new Date(),
      changeFrequency: 'daily',
      priority:        1,
    },
    ...productUrls,
  ]
}
