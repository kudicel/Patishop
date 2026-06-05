'use client'

import Image from 'next/image'
import { Product } from '@/types'
import { useStore } from '@/lib/store'
import { formatPrice, t } from '@/lib/locale'
import { badgeClass, stars } from '@/lib/utils'

interface Props { product: Product }

export function ProductCard({ product }: Props) {
  const country    = useStore(s => s.currentCountry)
  const addToCart  = useStore(s => s.addToCart)
  const openModal  = useStore(s => s.openModal)

  return (
    <article
      className="card flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-brand cursor-pointer group"
      onClick={() => openModal(product.id)}
    >
      {/* Thumb */}
      <div className="relative h-56 img-zoom rounded-t-[2rem] overflow-hidden flex-shrink-0">
        <Image
          src={product.thumbImage}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          loading="lazy"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 text-xs font-extrabold uppercase tracking-wide px-3 py-1 rounded-full ${badgeClass(product.badge)}`}>
            {product.badge}
          </span>
        )}
        <button
          onClick={e => { e.stopPropagation(); openModal(product.id) }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-1 opacity-0
            group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200
            bg-white/90 text-[#0a0704] text-sm font-bold rounded-full px-5 py-2 whitespace-nowrap"
        >
          {t(country,'detail_btn')}
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-bold text-base">{product.name}</h3>
          <p className="text-[#ff9a3c] text-xs font-bold uppercase tracking-wider mt-1">
            {product.categoryLabel}
          </p>
        </div>
        <p className="text-[#c4a896] text-sm leading-relaxed line-clamp-2">{product.shortDesc}</p>
        <ul className="space-y-1">
          {product.features.slice(0,3).map(f => (
            <li key={f} className="text-[#c4a896] text-xs flex items-start gap-1.5">
              <span className="text-[#ff9a3c] flex-shrink-0 mt-px">✓</span>{f}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-xl font-black">{formatPrice(product.price, country)}</span>
          <span className="text-[#ff9a3c] text-sm font-bold bg-[rgba(255,154,60,0.1)] px-3 py-1 rounded-full">
            {stars(product.rating)} {product.rating}
          </span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); addToCart(product) }}
          className="btn-brand w-full rounded-full py-3 font-bold text-sm"
        >
          {t(country,'add_to_cart')}
        </button>
      </div>

      {/* Supplier */}
      <div className="px-5 pb-4 border-t border-[rgba(255,154,60,0.08)] pt-3">
        <p className="text-xs font-bold text-[#ff9a3c] uppercase tracking-wide mb-0.5">
          {t(country,'supplier_label')}
        </p>
        <p className="text-[#c4a896] text-xs">{product.supplier}</p>
        <p className="text-[#c4a896] text-xs">{product.supplierNote}</p>
      </div>
    </article>
  )
}
