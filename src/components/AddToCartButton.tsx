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
          <p className="text-xs font-bold text-[#7ecad6] mb-2">
            {t(country, 'color_label')} <span className="text-white">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-all ${
                  c === color
                    ? 'border-[#06b6d4] bg-[rgba(6,182,212,0.15)] text-[#06b6d4]'
                    : 'border-white/10 bg-white/5 text-[#7ecad6] hover:border-white/30'
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
          <p className="text-xs font-bold text-[#7ecad6] mb-2">
            {t(country, 'size_label')} <span className="text-white">{size}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-xl px-4 py-1.5 text-sm font-semibold border transition-all ${
                  s === size
                    ? 'border-[#06b6d4] bg-[rgba(6,182,212,0.15)] text-[#06b6d4]'
                    : 'border-white/10 bg-white/5 text-[#7ecad6] hover:border-white/30'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stok durumu */}
      {product.stock === 0 ? (
        <p className="text-sm font-bold text-red-400">Bu ürün şu anda stokta yok.</p>
      ) : product.stock <= 5 ? (
        <p className="text-sm font-bold text-orange-400">Son {product.stock} adet kaldı!</p>
      ) : null}

      {/* Qty + CTA */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-3 border rounded-full px-2 py-1 ${product.stock === 0 ? 'border-white/5 opacity-40' : 'border-white/10'}`}>
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            disabled={product.stock === 0}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-white/10 transition-colors disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="font-bold w-6 text-center">{qty}</span>
          <button
            onClick={() => setQty(q => Math.min(product.stock, q + 1))}
            disabled={product.stock === 0}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-white/10 transition-colors disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>

        <button
          onClick={() => addToCart(product, qty, color, size)}
          disabled={product.stock === 0}
          className={`flex-1 rounded-full py-3.5 font-bold text-sm transition-all ${
            product.stock === 0
              ? 'bg-white/10 text-[#7ecad6] cursor-not-allowed'
              : 'btn-brand'
          }`}
        >
          {product.stock === 0
            ? 'Stokta Yok'
            : `${formatPrice(product.price * qty, country)} · ${t(country, 'add_to_cart')}`
          }
        </button>
      </div>
    </div>
  )
}
