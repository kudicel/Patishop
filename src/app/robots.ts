import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop.tr'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/account', '/checkout', '/order-success'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'Google-Extended', 'PerplexityBot', 'anthropic-ai', 'ClaudeBot', 'Claude-Web'],
        allow: '/',
        disallow: ['/admin', '/api/', '/account', '/checkout', '/order-success'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
