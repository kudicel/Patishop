'use client'

import { useState } from 'react'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'rating'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default',    label: 'Önerilen' },
  { value: 'price-asc',  label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'price-desc', label: 'Fiyat: Yüksekten Düşüğe' },
  { value: 'rating',     label: 'En Çok Satan' },
]

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const arr = [...products]
  if (sort === 'price-asc')  return arr.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return arr.sort((a, b) => b.price - a.price)
  if (sort === 'rating')     return arr.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
  return arr
}

export function SortableProductGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>('default')
  const sorted = sortProducts(products, sort)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#7ecad6]">{products.length} ürün</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  )
}
