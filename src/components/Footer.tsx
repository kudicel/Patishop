'use client'

import { useStore } from '@/lib/store'
import { t } from '@/lib/locale'

export function Footer() {
  const country = useStore(s => s.currentCountry)

  return (
    <footer className="mt-auto border-t border-[rgba(6,182,212,0.08)] px-6 py-8 lg:px-12 text-center text-[#7ecad6] text-sm">
      <p>© 2026 <span className="brand-gradient font-bold">PatiShop</span> — {t(country, 'footer_tagline')}</p>
      <p className="mt-1">{t(country, 'footer_delivery')}</p>
    </footer>
  )
}
