'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { t } from '@/lib/locale'

export function Footer() {
  const country = useStore(s => s.currentCountry)

  return (
    <footer className="mt-auto border-t border-[rgba(6,182,212,0.08)] px-6 py-8 lg:px-12 text-[#7ecad6] text-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p>© 2026 <span className="brand-gradient font-bold">PatiShop</span> — {t(country, 'footer_tagline')}</p>
          <p className="mt-1">{t(country, 'footer_delivery')}</p>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link href="/favoriler" className="hover:text-white transition-colors">Favorilerim</Link>
          <Link href="/#products" className="hover:text-white transition-colors">Ürünler</Link>
        </div>
      </div>
    </footer>
  )
}
