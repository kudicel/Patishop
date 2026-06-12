'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useStore } from '@/lib/store'
import { t } from '@/lib/locale'
import { LocaleSelector } from './LocaleSelector'

const CATEGORIES = [
  { slug: 'mama-kabi',       labelKey: 'filter_mama',    icon: '🍚' },
  { slug: 'kum-temizleyici', labelKey: 'filter_kum',     icon: '🪣' },
  { slug: 'tasma',           labelKey: 'filter_tasma',   icon: '🦮' },
  { slug: 'oyuncak',         labelKey: 'filter_oyuncak', icon: '🎾' },
  { slug: 'kiyafet',         labelKey: 'filter_kiyafet', icon: '👕' },
  { slug: 'yatak',           labelKey: 'filter_yatak',   icon: '🛏️' },
] as const

export function Header() {
  const { data: session, status } = useSession()
  const cartOpen    = useStore(s => s.cartOpen)
  const setCartOpen = useStore(s => s.setCartOpen)
  const cart        = useStore(s => s.cart)
  const country     = useStore(s => s.currentCountry)
  const totalQty    = cart.reduce((sum, i) => sum + i.quantity, 0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catsOpen, setCatsOpen]     = useState(false)

  return (
    <header className="sticky top-0 z-40 relative flex items-center justify-between gap-4 px-6 py-4 lg:px-12
      bg-[rgba(2,14,22,0.96)] backdrop-blur-xl border-b border-[rgba(6,182,212,0.2)]">

      {/* Brand */}
      <div className="flex-shrink-0">
        <Link href="/" className="brand-gradient text-2xl font-black tracking-tight">
          PatiShop
        </Link>
        <p className="hidden md:block text-xs text-[#7ecad6] mt-0.5">
          {t(country, 'brand_tagline')}
        </p>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#7ecad6]">
        <Link href="#discover"  className="hover:text-white transition-colors">{t(country, 'nav_discover')}</Link>

        {/* Ürünler dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            {t(country, 'nav_products')}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              className="mt-0.5 transition-transform group-hover:rotate-180">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none
            group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
            <div className="rounded-2xl border border-[rgba(6,182,212,0.2)] bg-[rgba(2,14,22,0.97)]
              backdrop-blur-xl p-2 min-w-[180px] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              {CATEGORIES.map(cat => (
                <Link key={cat.slug} href={`/kategori/${cat.slug}`}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#7ecad6]
                    hover:bg-[rgba(6,182,212,0.1)] hover:text-white transition-colors">
                  <span>{cat.icon}</span>
                  <span>{t(country, cat.labelKey)}</span>
                </Link>
              ))}
              <div className="border-t border-white/[0.06] mt-1 pt-1">
                <Link href="/#products"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#06b6d4]
                    hover:bg-[rgba(6,182,212,0.1)] transition-colors font-semibold">
                  <span>→</span>
                  <span>Tüm Ürünler</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Link href="#suppliers" className="hover:text-white transition-colors">{t(country, 'nav_suppliers')}</Link>
        <Link href="#analytics" className="hover:text-white transition-colors">{t(country, 'nav_analytics')}</Link>
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <LocaleSelector />

        {/* Auth area */}
        {status === 'loading' ? null : session ? (
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/account/orders"
              className="btn-ghost px-3 py-2 rounded-full text-sm font-semibold">
              {t(country, 'my_orders')}
            </Link>
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

        {/* Hamburger — only mobile */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="md:hidden btn-ghost p-2 rounded-xl"
          aria-label="Menü"
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50
          bg-[rgba(2,14,22,0.98)] backdrop-blur-xl border-b border-[rgba(6,182,212,0.2)]
          px-6 py-4 flex flex-col gap-1">

          <Link href="#discover" onClick={() => setMobileOpen(false)}
            className="px-3 py-3 rounded-xl text-sm font-medium text-[#7ecad6] hover:text-white hover:bg-[rgba(6,182,212,0.08)] transition-colors">
            {t(country, 'nav_discover')}
          </Link>

          {/* Kategoriler accordion */}
          <button
            onClick={() => setCatsOpen(o => !o)}
            className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-[#7ecad6] hover:text-white hover:bg-[rgba(6,182,212,0.08)] transition-colors"
          >
            <span>{t(country, 'nav_products')}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              className={`transition-transform ${catsOpen ? 'rotate-180' : ''}`}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

          {catsOpen && (
            <div className="ml-3 flex flex-col gap-0.5">
              {CATEGORIES.map(cat => (
                <Link key={cat.slug} href={`/kategori/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#7ecad6] hover:text-white hover:bg-[rgba(6,182,212,0.08)] transition-colors">
                  <span>{cat.icon}</span>
                  <span>{t(country, cat.labelKey)}</span>
                </Link>
              ))}
              <Link href="/#products" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#06b6d4] font-semibold hover:bg-[rgba(6,182,212,0.08)] transition-colors">
                <span>→</span>
                <span>Tüm Ürünler</span>
              </Link>
            </div>
          )}

          <Link href="#suppliers" onClick={() => setMobileOpen(false)}
            className="px-3 py-3 rounded-xl text-sm font-medium text-[#7ecad6] hover:text-white hover:bg-[rgba(6,182,212,0.08)] transition-colors">
            {t(country, 'nav_suppliers')}
          </Link>
          <Link href="#analytics" onClick={() => setMobileOpen(false)}
            className="px-3 py-3 rounded-xl text-sm font-medium text-[#7ecad6] hover:text-white hover:bg-[rgba(6,182,212,0.08)] transition-colors">
            {t(country, 'nav_analytics')}
          </Link>

          <div className="border-t border-white/[0.06] mt-2 pt-2">
            {status !== 'loading' && (session ? (
              <>
                <Link href="/account/orders" onClick={() => setMobileOpen(false)}
                  className="block px-3 py-3 rounded-xl text-sm font-medium text-[#7ecad6] hover:text-white hover:bg-[rgba(6,182,212,0.08)] transition-colors">
                  {t(country, 'my_orders')}
                </Link>
                <button onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }) }}
                  className="w-full text-left px-3 py-3 rounded-xl text-sm font-medium text-[#7ecad6] hover:text-white hover:bg-[rgba(6,182,212,0.08)] transition-colors">
                  {t(country, 'logout')}
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="block px-3 py-3 rounded-xl text-sm font-medium text-[#7ecad6] hover:text-white hover:bg-[rgba(6,182,212,0.08)] transition-colors">
                {t(country, 'nav_login')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
