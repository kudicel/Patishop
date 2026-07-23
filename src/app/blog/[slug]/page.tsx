import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BLOG_POSTS, getBlogPost } from '@/lib/blog-posts'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

// "[metin](/yol)" biçimindeki basit markdown linklerini gerçek <Link> bileşenine çevirir
function renderInline(text: string, keyPrefix: string) {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let idx = 0
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    nodes.push(
      <Link key={`${keyPrefix}-link-${idx++}`} href={match[2]} className="text-[#06b6d4] font-semibold hover:underline">
        {match[1]}
      </Link>
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes.length ? nodes : [text]
}

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return {
    title: `${post.title} | PatiShop Blog`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.image] },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const others = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3)

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop.tr'
  const url  = `${base}/blog/${slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [post.image],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'PatiShop',
      url: base,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PatiShop',
      url: base,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: post.category,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="px-6 lg:px-12 py-12 max-w-4xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-[#7ecad6] mb-8">
          <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-white line-clamp-1">{post.title}</span>
        </nav>

        <div className="mb-8">
          <span className="inline-block text-xs font-bold bg-[rgba(6,182,212,0.15)] text-[#06b6d4] px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-4xl font-black mb-4">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-[#7ecad6]">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime} okuma</span>
          </div>
        </div>

        <div className="relative h-72 rounded-[2rem] overflow-hidden mb-10">
          <Image src={post.image} alt={post.title} fill className="object-cover" sizes="100vw" priority/>
        </div>

        <article className="prose prose-invert prose-cyan max-w-none text-[#c4d9e0] leading-relaxed
          [&_h2]:text-white [&_h2]:text-2xl [&_h2]:font-black [&_h2]:mt-8 [&_h2]:mb-4
          [&_h3]:text-white [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3
          [&_p]:mb-4 [&_ul]:my-4 [&_li]:mb-2 [&_strong]:text-white">
          {post.content.split('\n').map((line, i) => {
            if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>
            if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>
            if (line.startsWith('**') && line.endsWith('**')) return <p key={i}><strong>{line.slice(2, -2)}</strong></p>
            if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{renderInline(line.slice(2), `li-${i}`)}</li>
            if (line.match(/^\d+\. /)) return <li key={i} className="ml-4 list-decimal">{renderInline(line.replace(/^\d+\. /, ''), `oli-${i}`)}</li>
            if (line.trim() === '') return null
            return <p key={i}>{renderInline(line, `p-${i}`)}</p>
          })}
        </article>

        {others.length > 0 && (
          <section className="mt-16 pt-10 border-t border-white/[0.08]">
            <h2 className="text-2xl font-black mb-6">Diğer Yazılar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {others.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`}
                  className="group rounded-2xl border border-white/10 overflow-hidden hover:border-[rgba(6,182,212,0.3)] transition-all">
                  <div className="relative h-32 overflow-hidden">
                    <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="33vw"/>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-sm group-hover:text-[#06b6d4] transition-colors line-clamp-2">{p.title}</p>
                    <p className="text-[#7ecad6] text-xs mt-1">{p.readTime} okuma</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
