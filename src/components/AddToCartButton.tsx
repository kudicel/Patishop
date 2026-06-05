'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { useStore } from '@/lib/store'
import { formatPrice, t } from '@/lib/locale'

export function AddToCartButton({ product }: { product: Product }) {
  const addToCart = useStore(s => s.addToCart)
  const country   = useStore(s => s.currentCountry)
  const [qty,     setQty]   = useState(1)
  const [color,   setColor] = useState(product.colors?.[0])
  const [size,    setSize]  = useState(product.sizes?.[0])

  return (
    <div className="flex flex-col gap-4">
      {product.colors && (
        <div>
          <p className="text-xs font-bold text-[#c4a896] mb-2">
            {t(country, 'color_label')} <span className="text-white">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-all ${
                  c === color
                    ? 'border-[#ff9a3c] bg-[rgba(255,154,60,0.15)] text-[#ff9a3c]'
                    : 'border-white/10 bg-white/5 text-[#c4a896] hover:border-white/30'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes && (
        <div>
          <p className="text-xs font-bold text-[#c4a896] mb-2">
            {t(country, 'size_label')} <span className="text-white">{size}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-xl px-4 py-1.5 text-sm font-semibold border transition-all ${
                  s === size
                    ? 'border-[#ff9a3c] bg-[rgba(255,154,60,0.15)] text-[#ff9a3c]'
                    : 'border-white/10 bg-white/5 text-[#c4a896] hover:border-white/30'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Qty + CTA */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 border border-white/10 rounded-full px-2 py-1">
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-white/10 transition-colors"
          >
            −
          </button>
          <span className="font-bold w-6 text-center">{qty}</span>
          <button
            onClick={() => setQty(q => q + 1)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-white/10 transition-colors"
          >
            +
          </button>
        </div>

        <button
          onClick={() => addToCart(product, qty, color, size)}
          className="btn-brand flex-1 rounded-full py-3.5 font-bold text-sm"
        >
          {formatPrice(product.price * qty, country)} · {t(country, 'add_to_cart')}
        </button>
      </div>
    </div>
  )
}
