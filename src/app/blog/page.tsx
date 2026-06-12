import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BLOG_POSTS } from '@/lib/blog-posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Evcil Hayvan Bakım Rehberleri | PatiShop',
  description: 'Kedi ve köpek bakımı, beslenme, oyuncak seçimi hakkında uzman rehberleri.',
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="px-6 lg:px-12 py-12 max-w-6xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-[#7ecad6] mb-8">
          <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-white">Blog</span>
        </nav>

        <div className="mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#06b6d4] mb-3">Rehberler</span>
          <h1 className="text-4xl font-black mb-3">Evcil Hayvan Bakım Blogu</h1>
          <p className="text-[#7ecad6] max-w-2xl">Kedi ve köpeğinizin sağlıklı ve mutlu yaşaması için uzman önerileri.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {BLOG_POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.02] overflow-hidden
                hover:border-[rgba(6,182,212,0.3)] hover:-translate-y-1 transition-all duration-200">
              <div className="relative h-48 overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="50vw"/>
                <span className="absolute top-3 left-3 text-xs font-bold bg-[rgba(6,182,212,0.9)] text-white px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-[#7ecad6] mb-3">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime} okuma</span>
                </div>
                <h2 className="font-black text-lg mb-2 group-hover:text-[#06b6d4] transition-colors">{post.title}</h2>
                <p className="text-[#7ecad6] text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
