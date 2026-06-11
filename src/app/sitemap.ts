import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/db-products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base     = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop-gamma.vercel.app'
  const products = await getProducts()

  const categories = ['mama-kabi', 'kum-temizleyici', 'tasma', 'oyuncak', 'kiyafet', 'yatak']

  const categoryUrls: MetadataRoute.Sitemap = categories.map(slug => ({
    url:             `${base}/kategori/${slug}`,
    lastModified:    new Date(),
    changeFrequency: 'weekly' as const,
    priority:        0.9,
  }))

  const productUrls: MetadataRoute.Sitemap = products.map(p => ({
    url:              `${base}/products/${p.id}`,
    lastModified:     new Date(),
    changeFrequency:  'weekly' as const,
    priority:         0.8,
  }))

  return [
    {
      url:             base,
      lastModified:    new Date(),
      changeFrequency: 'daily' as const,
      priority:        1,
    },
    ...categoryUrls,
    ...productUrls,
  ]
}
