'use client'

import { useState, useMemo } from 'react'
import { Product, Category } from '@/types'
import { ProductCard } from './ProductCard'
import { useStore } from '@/lib/store'
import { t, TranslationKey } from '@/lib/locale'

const CATEGORIES: { key: string; i18n: TranslationKey }[] = [
  { key: 'all',             i18n: 'filter_all' },
  { key: 'mama-kabi',       i18n: 'filter_mama' },
  { key: 'kum-temizleyici', i18n: 'filter_kum' },
  { key: 'tasma',           i18n: 'filter_tasma' },
  { key: 'oyuncak',         i18n: 'filter_oyuncak' },
  { key: 'kiyafet',         i18n: 'filter_kiyafet' },
  { key: 'yatak',           i18n: 'filter_yatak' },
]

const KEDI_CATS  = new Set(['kum-temizleyici'])
const KOPEK_CATS = new Set(['tasma'])

export function ProductsSection({ products }: { products: Product[] }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [petFilter, setPetFilter]       = useState<'tumu' | 'kedi' | 'kopek'>('tumu')
  const [search, setSearch] = useState('')
  const country = useStore(s => s.currentCountry)

  const filtered = useMemo(() => {
    let list = products
    if (activeFilter !== 'all') list = list.filter(p => p.category === activeFilter as Category)
    if (petFilter !== 'tumu') {
      list = list.filter(p => {
        const isKedi  = KEDI_CATS.has(p.category)
        const isKopek = KOPEK_CATS.has(p.category)
        if (petFilter === 'kedi')  return isKedi  || (!isKedi && !isKopek)
        if (petFilter === 'kopek') return isKopek || (!isKedi && !isKopek)
        return true
      })
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q))
    }
    return list
  }, [products, activeFilter, petFilter, search])

  return (
    <section id="products" className="px-6 lg:px-12 pb-20">
      <div className="mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#06b6d4] mb-3">
          {t(country, 'products_eyebrow')}
        </span>
        <h2 className="text-4xl font-black mb-3">{t(country, 'brand_tagline')}</h2>
        <p className="text-[#7ecad6] max-w-2xl leading-relaxed">
          {t(country, 'products_p')}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        {(['tumu', 'kedi', 'kopek'] as const).map(p => (
          <button key={p} onClick={() => setPetFilter(p)}
            className={`rounded-full px-4 py-2 text-sm font-semibold border transition-all ${
              petFilter === p
                ? 'border-[rgba(236,72,153,0.5)] bg-[rgba(236,72,153,0.12)] text-[#ec4899]'
                : 'border-white/10 bg-white/5 text-[#7ecad6] hover:border-white/20 hover:text-white'
            }`}>
            {p === 'tumu' ? '🐾 Tümü' : p === 'kedi' ? '🐱 Kedi' : '🐶 Köpek'}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition-all ${
                activeFilter === cat.key
                  ? 'border-[rgba(6,182,212,0.5)] bg-[rgba(6,182,212,0.15)] text-[#06b6d4]'
                  : 'border-white/10 bg-white/5 text-[#7ecad6] hover:border-[rgba(6,182,212,0.3)] hover:text-white'
              }`}
            >
              {t(country, cat.i18n)}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t(country, 'search_placeholder')}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-[#f0fafb]
            placeholder:text-white/40 focus:outline-none focus:border-[rgba(6,182,212,0.4)] min-w-[220px]"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-[#7ecad6] py-20">{t(country, 'products_not_found')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
