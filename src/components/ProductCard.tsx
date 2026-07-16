'use client'

import Image from 'next/image'
import { Product } from '@/types'
import { useStore } from '@/lib/store'
import { formatPrice, withKdv, t, TranslationKey } from '@/lib/locale'
import { badgeClass, stars } from '@/lib/utils'

const BADGE_KEYS: Record<string, TranslationKey> = {
  'Çok Satan':   'badge_bestseller',
  'En İyi Değer':'badge_best_value',
  'Premium':     'badge_premium',
  'Bütçe Dostu': 'badge_budget',
  'Yeni':        'badge_new',
  'Yeni Sezon':  'badge_new_season',
}

const CATEGORY_KEYS: Record<string, TranslationKey> = {
  'mama-kabi':       'filter_mama',
  'kum-temizleyici': 'filter_kum',
  'tasma':           'filter_tasma',
  'oyuncak':         'filter_oyuncak',
  'kiyafet':         'filter_kiyafet',
  'yatak':           'filter_yatak',
}

interface Props { product: Product }

export function ProductCard({ product }: Props) {
  const country        = useStore(s => s.currentCountry)
  const addToCart      = useStore(s => s.addToCart)
  const openModal      = useStore(s => s.openModal)
  const toggleWishlist = useStore(s => s.toggleWishlist)
  const isWishlisted   = useStore(s => s.isWishlisted)
  const wishlisted     = isWishlisted(product.id)

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
        {product.stock === 0 ? (
          <span className="absolute top-3 left-3 text-xs font-extrabold uppercase tracking-wide px-3 py-1 rounded-full bg-red-500/90 text-white">
            Tükendi
          </span>
        ) : product.badge ? (
          <span className={`absolute top-3 left-3 text-xs font-extrabold uppercase tracking-wide px-3 py-1 rounded-full ${badgeClass(product.badge)}`}>
            {BADGE_KEYS[product.badge] ? t(country, BADGE_KEYS[product.badge]) : product.badge}
          </span>
        ) : null}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute bottom-12 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-500/90 text-white">
            Son {product.stock} adet!
          </span>
        )}
        <button
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
          aria-label="Favorilere ekle"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? '#ec4899' : 'none'} stroke={wishlisted ? '#ec4899' : 'white'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
        <button
          onClick={e => { e.stopPropagation(); openModal(product.id) }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-1 opacity-0
            group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200
            bg-white/90 text-[#050f12] text-sm font-bold rounded-full px-5 py-2 whitespace-nowrap"
        >
          {t(country,'detail_btn')}
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="font-bold text-base">{product.name}</h3>
          <p className="text-[#06b6d4] text-xs font-bold uppercase tracking-wider mt-1">
            {CATEGORY_KEYS[product.category] ? t(country, CATEGORY_KEYS[product.category]) : product.categoryLabel}
          </p>
        </div>
        <p className="text-[#7ecad6] text-sm leading-relaxed line-clamp-2">{product.shortDesc}</p>
        <ul className="space-y-1">
          {product.features.slice(0,3).map(f => (
            <li key={f} className="text-[#7ecad6] text-xs flex items-start gap-1.5">
              <span className="text-[#06b6d4] flex-shrink-0 mt-px">✓</span>{f}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-xl font-black">{formatPrice(withKdv(product.price, country), country)}</span>
          <span className="text-[#06b6d4] text-sm font-bold bg-[rgba(6,182,212,0.1)] px-3 py-1 rounded-full">
            {stars(product.rating)} {product.rating}
          </span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); if (product.stock > 0) addToCart(product) }}
          disabled={product.stock === 0}
          className={`w-full rounded-full py-3 font-bold text-sm transition-all ${
            product.stock === 0
              ? 'bg-white/10 text-[#7ecad6] cursor-not-allowed'
              : 'btn-brand'
          }`}
        >
          {product.stock === 0 ? 'Stokta Yok' : t(country,'add_to_cart')}
        </button>
      </div>

      {/* Supplier */}
      <div className="px-5 pb-4 border-t border-[rgba(6,182,212,0.08)] pt-3">
        <p className="text-xs font-bold text-[#06b6d4] uppercase tracking-wide mb-0.5">
          {t(country,'supplier_label')}
        </p>
        <p className="text-[#7ecad6] text-xs">{product.supplier}</p>
        <p className="text-[#7ecad6] text-xs">{product.supplierNote}</p>
      </div>
    </article>
  )
}
