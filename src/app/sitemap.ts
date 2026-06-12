import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/db-products'
import { BLOG_POSTS } from '@/lib/blog-posts'

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

  const blogUrls: MetadataRoute.Sitemap = BLOG_POSTS.map(p => ({
    url:              `${base}/blog/${p.slug}`,
    lastModified:     new Date(p.date),
    changeFrequency:  'monthly' as const,
    priority:         0.7,
  }))

  return [
    { url: base,          lastModified: new Date(), changeFrequency: 'daily'   as const, priority: 1   },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.8 },
    ...categoryUrls,
    ...productUrls,
    ...blogUrls,
  ]
}
