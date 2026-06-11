'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { t } from '@/lib/locale'

export function HeroSection() {
  const country = useStore(s => s.currentCountry)

  return (
    <section id="discover" className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center px-6 py-16 lg:px-12 lg:py-24">
      <div className="max-w-2xl">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#06b6d4] mb-4">
          {t(country,'hero_eyebrow')}
        </span>
        <h1 className="text-5xl lg:text-6xl font-black leading-[1.02] tracking-tight mb-6">
          {t(country,'hero_h1')}
        </h1>
        <p className="text-lg text-[#7ecad6] leading-relaxed mb-8 max-w-xl">
          {t(country,'hero_p')}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="#products"
            className="btn-brand inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold text-base"
          >
            {t(country,'btn_catalog')}
          </Link>
          <Link
            href="#suppliers"
            className="btn-ghost inline-flex items-center gap-2 rounded-full px-7 py-4 font-bold text-base"
          >
            {t(country,'btn_suppliers')}
          </Link>
        </div>
      </div>

      <div className="flex justify-center lg:justify-end">
        <div className="w-full max-w-md rounded-[2rem] border border-[rgba(6,182,212,0.15)]
          bg-gradient-to-b from-[rgba(40,20,8,0.95)] to-[rgba(20,10,4,0.98)] p-8 shadow-brand">
          <h2 className="text-2xl font-bold mb-3">Öne çıkan koleksiyon</h2>
          <p className="text-[#7ecad6] mb-5">Akıllı teknoloji ile günlük bakım bir arada</p>
          <ul className="space-y-3 text-[#7ecad6]">
            {[
              'Otomatik & WiFi kontrollü mama kapları',
              'Sessiz çalışan kum temizleyiciler',
              'Ergonomik tasma ve aksesuar setleri',
              'ISO sertifikalı fabrikalar, hızlı teslimat',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-[#06b6d4] mt-0.5 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
