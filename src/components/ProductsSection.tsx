'use client'

import { useState, useMemo } from 'react'
import { Product, Category } from '@/types'
import { ProductCard } from './ProductCard'
import { useStore } from '@/lib/store'
import { t } from '@/lib/locale'

const CATEGORIES: { key: string; label: string; i18n: string }[] = [
  { key:'all',              label:'Hepsi',           i18n:'filter_all' },
  { key:'mama-kabi',        label:'Mama Kabı',        i18n:'filter_mama' },
  { key:'kum-temizleyici',  label:'Kum Temizleyici',  i18n:'filter_kum' },
  { key:'tasma',            label:'Tasma',            i18n:'filter_tasma' },
  { key:'oyuncak',          label:'Oyuncak',          i18n:'filter_oyuncak' },
  { key:'kiyafet',          label:'Kıyafet',          i18n:'filter_kiyafet' },
  { key:'yatak',            label:'Yatak',            i18n:'filter_yatak' },
]

export function ProductsSection({ products }: { products: Product[] }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')
  const country = useStore(s => s.currentCountry)

  const filtered = useMemo(() => {
    let list = products
    if (activeFilter !== 'all') list = list.filter(p => p.category === activeFilter as Category)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q))
    }
    return list
  }, [products, activeFilter, search])

  return (
    <section id="products" className="px-6 lg:px-12 pb-20">
      {/* Section header */}
      <div className="mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#ff9a3c] mb-3">
          Ürün Kataloğu
        </span>
        <h2 className="text-4xl font-black mb-3">Kedi & Köpek Aksesuarları</h2>
        <p className="text-[#c4a896] max-w-2xl leading-relaxed">
          Tüm ürünler ISO sertifikalı Çin fabrikalarından doğrudan ithal, 17 ülkeye hızlı ve güvenli kargo.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition-all ${
                activeFilter === cat.key
                  ? 'border-[rgba(255,154,60,0.5)] bg-[rgba(255,154,60,0.15)] text-[#ff9a3c]'
                  : 'border-white/10 bg-white/5 text-[#c4a896] hover:border-[rgba(255,154,60,0.3)] hover:text-white'
              }`}
            >
              {t(country, cat.i18n as any) || cat.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t(country,'search_placeholder')}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-[#fff8f4]
            placeholder:text-white/40 focus:outline-none focus:border-[rgba(255,154,60,0.4)] min-w-[220px]"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-[#c4a896] py-20">Ürün bulunamadı.</p>
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
