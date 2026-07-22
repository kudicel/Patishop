'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { t } from '@/lib/locale'

export function Footer() {
  const country = useStore(s => s.currentCountry)

  return (
    <footer className="mt-auto border-t border-[rgba(6,182,212,0.08)] px-6 py-10 lg:px-12 text-[#7ecad6] text-sm">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Marka */}
          <div className="col-span-2 md:col-span-1">
            <p className="brand-gradient font-black text-xl mb-2">PatiShop</p>
            <p className="text-xs text-[#7ecad6]">{t(country, 'footer_tagline')}</p>
            <p className="text-xs text-[#7ecad6] mt-1">{t(country, 'footer_delivery')}</p>
          </div>

          {/* Alışveriş */}
          <div>
            <p className="text-white font-semibold mb-3">Alışveriş</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/#products" className="hover:text-white transition-colors">Tüm Ürünler</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/favoriler" className="hover:text-white transition-colors">Favorilerim</Link></li>
            </ul>
          </div>

          {/* Yardım */}
          <div>
            <p className="text-white font-semibold mb-3">Yardım</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/sss" className="hover:text-white transition-colors">Sık Sorulan Sorular</Link></li>
              <li><Link href="/hakkimizda" className="hover:text-white transition-colors">Hakkımızda</Link></li>
              <li><Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link></li>
              <li><Link href="/teslimat" className="hover:text-white transition-colors">Teslimat &amp; Kargo</Link></li>
              <li><Link href="/iade-kosullari" className="hover:text-white transition-colors">İptal &amp; İade</Link></li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <p className="text-white font-semibold mb-3">Yasal</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/mesafeli-satis-sozlesmesi" className="hover:text-white transition-colors">Mesafeli Satış Sözleşmesi</Link></li>
              <li><Link href="/gizlilik-politikasi" className="hover:text-white transition-colors">Gizlilik Politikası</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[rgba(6,182,212,0.08)] pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#7ecad6]">
          <p>© 2026 <span className="brand-gradient font-bold">PatiShop</span> — Kuvix Digital Solutions</p>
          <p>Vatan Caddesi, Özay Sokak No 4, 34534 Büyükçekmece-İstanbul/Türkiye</p>
        </div>
      </div>
    </footer>
  )
}
