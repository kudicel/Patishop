'use client'

import { useState } from 'react'
import { ProductEditModal } from '@/components/ProductEditModal'

type ProductRow = {
  id: string
  name: string
  category: string
  categoryLabel: string
  price: number
  rating: number
  reviewCount: number
  badge: string | null
  images: string[]
  thumbImage: string
  shortDesc: string
  description: string
  features: string[]
  colors: string[]
  sizes: string[]
  supplier: string
  supplierNote: string
  active: boolean
}

export function ProductEditTrigger({ product }: { product: ProductRow }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-white/[0.08]
          text-[#7ecad6] hover:border-[#06b6d4]/40 hover:text-white transition-colors"
      >
        Düzenle
      </button>
      {open && (
        <ProductEditModal product={product} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
