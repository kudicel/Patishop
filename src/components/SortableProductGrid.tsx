'use client'

import { useState } from 'react'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'rating'
type PetFilter = 'tumu' | 'kedi' | 'kopek'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default',    label: 'Önerilen' },
  { value: 'price-asc',  label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'price-desc', label: 'Fiyat: Yüksekten Düşüğe' },
  { value: 'rating',     label: 'En Çok Satan' },
]

// Kategori → hayvan türü eşlemesi
const KEDI_CATEGORIES  = new Set(['kum-temizleyici'])
const KOPEK_CATEGORIES = new Set(['tasma'])
// Diğer kategoriler her ikisi için de geçerli

function getPetType(product: Product): 'kedi' | 'kopek' | 'her-ikisi' {
  if (KEDI_CATEGORIES.has(product.category))  return 'kedi'
  if (KOPEK_CATEGORIES.has(product.category)) return 'kopek'
  return 'her-ikisi'
}

function filterByPet(products: Product[], pet: PetFilter): Product[] {
  if (pet === 'tumu') return products
  return products.filter(p => {
    const type = getPetType(p)
    return type === 'her-ikisi' || type === pet
  })
}

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const arr = [...products]
  if (sort === 'price-asc')  return arr.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return arr.sort((a, b) => b.price - a.price)
  if (sort === 'rating')     return arr.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
  return arr
}

export function SortableProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort]   = useState<SortKey>('default')
  const [pet, setPet]     = useState<PetFilter>('tumu')

  const filtered = filterByPet(products, pet)
  const sorted   = sortProducts(filtered, sort)

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Pet filtresi */}
        <div className="flex items-center gap-2">
          {(['tumu', 'kedi', 'kopek'] as PetFilter[]).map(p => (
            <button
              key={p}
              onClick={() => setPet(p)}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition-all ${
                pet === p
                  ? 'border-[rgba(6,182,212,0.5)] bg-[rgba(6,182,212,0.15)] text-[#06b6d4]'
                  : 'border-white/10 bg-white/5 text-[#7ecad6] hover:border-[rgba(6,182,212,0.3)] hover:text-white'
              }`}
            >
              {p === 'tumu' ? '🐾 Tümü' : p === 'kedi' ? '🐱 Kedi' : '🐶 Köpek'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-[#7ecad6]">{sorted.length} ürün</p>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="bg-white/5 border border-[rgba(6,182,212,0.2)] text-sm text-[#7ecad6] rounded-xl px-4 py-2
              outline-none focus:border-[#06b6d4] transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value} className="bg-[#050f12]">{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="text-center text-[#7ecad6] py-16">Bu filtreyle eşleşen ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </>
  )
}
