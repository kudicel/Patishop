'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useStore } from '@/lib/store'
import { t } from '@/lib/locale'
import { LocaleSelector } from './LocaleSelector'

export function Header() {
  const { data: session, status } = useSession()
  const cartOpen    = useStore(s => s.cartOpen)
  const setCartOpen = useStore(s => s.setCartOpen)
  const cart        = useStore(s => s.cart)
  const country     = useStore(s => s.currentCountry)
  const totalQty    = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-6 py-4 lg:px-12
      bg-[rgba(10,7,4,0.92)] backdrop-blur-xl border-b border-white/5">

      {/* Brand */}
      <div className="flex-shrink-0">
        <Link href="/" className="brand-gradient text-2xl font-black tracking-tight">
          PatiShop
        </Link>
        <p className="hidden md:block text-xs text-[#c4a896] mt-0.5">
          {t(country, 'brand_tagline')}
        </p>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#c4a896]">
        <Link href="#discover"  className="hover:text-white transition-colors">{t(country, 'nav_discover')}</Link>
        <Link href="#products"  className="hover:text-white transition-colors">{t(country, 'nav_products')}</Link>
        <Link href="#suppliers" className="hover:text-white transition-colors">{t(country, 'nav_suppliers')}</Link>
        <Link href="#analytics" className="hover:text-white transition-colors">{t(country, 'nav_analytics')}</Link>
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <LocaleSelector />

        {/* Auth area */}
        {status === 'loading' ? null : session ? (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-[#c4a896] max-w-[120px] truncate">
              {session.user?.name ?? session.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="btn-ghost px-3 py-2 rounded-full text-sm font-semibold"
            >
              {t(country, 'logout')}
            </button>
          </div>
        ) : (
          <Link href="/login" className="hidden sm:inline-flex btn-ghost px-4 py-2.5 rounded-full text-sm font-semibold">
            {t(country, 'nav_login')}
          </Link>
        )}

        {/* Cart */}
        <button
          onClick={() => setCartOpen(!cartOpen)}
          className="btn-ghost flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <span>{t(country, 'cart')}</span>
          {totalQty > 0 && (
            <span className="btn-brand text-xs font-bold rounded-full px-2 py-0.5 min-w-[1.4rem] text-center">
              {totalQty}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
