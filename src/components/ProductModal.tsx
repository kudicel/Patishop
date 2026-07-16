'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { Product } from '@/types'
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

type PublicSupplier = { name: string; productIds: string[] }

export function ProductModal({ products }: { products: Product[] }) {
  const modalProductId = useStore(s => s.modalProductId)
  const closeModal     = useStore(s => s.closeModal)
  const addToCart      = useStore(s => s.addToCart)
  const country        = useStore(s => s.currentCountry)

  const product = products.find(p => p.id === modalProductId)

  const [imgIndex,     setImgIndex]     = useState(0)
  const [qty,          setQty]          = useState(1)
  const [color,        setColor]        = useState<string|undefined>()
  const [size,         setSize]         = useState<string|undefined>()
  const [supplierName, setSupplierName] = useState<string | null>(null)

  useEffect(() => {
    if (product) {
      setImgIndex(0)
      setQty(1)
      setColor(product.colors?.[0])
      setSize(product.sizes?.[0])
      setSupplierName(null)
      fetch('/api/public/suppliers')
        .then(r => r.json())
        .then((suppliers: PublicSupplier[]) => {
          const match = suppliers.find(s => s.productIds.includes(product.id))
          setSupplierName(match?.name ?? null)
        })
        .catch(() => {})
    }
  }, [product])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeModal])

  useEffect(() => {
    document.body.style.overflow = product ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [product])

  if (!product) return null

  const handleAdd = () => {
    addToCart(product, qty, color, size)
    closeModal()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) closeModal() }}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-[rgba(6,182,212,0.18)] bg-[#060f12] shadow-modal animate-scale-in">
        {/* Close */}
        <button
          onClick={closeModal}
          className="sticky top-3 float-right mr-4 mt-3 z-10 w-9 h-9 rounded-full border border-white/10 bg-white/5
            flex items-center justify-center text-xl font-light hover:bg-[rgba(6,182,212,0.15)] transition-colors"
        >
          ×
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 clear-both">
          {/* Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#061218]">
              <Image
                src={product.images[imgIndex]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
                priority
              />
              {product.badge && (
                <span className={`absolute top-3 left-3 text-xs font-extrabold uppercase tracking-wide px-3 py-1 rounded-full ${badgeClass(product.badge)}`}>
                  {BADGE_KEYS[product.badge] ? t(country, BADGE_KEYS[product.badge]) : product.badge}
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-colors flex-shrink-0 ${
                      i === imgIndex ? 'border-[#06b6d4]' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#06b6d4]">
                {CATEGORY_KEYS[product.category] ? t(country, CATEGORY_KEYS[product.category]) : product.categoryLabel}
              </span>
              <h2 className="text-2xl font-black mt-1">{product.name}</h2>
              <div className="flex items-center gap-2 mt-1.5 text-sm">
                <span className="text-amber-400">{stars(product.rating)}</span>
                <strong>{product.rating}</strong>
                <span className="text-[#7ecad6]">({product.reviewCount} {t(country,'reviews_label')})</span>
              </div>
            </div>

            <p className="text-[#7ecad6] text-sm leading-relaxed">{product.description}</p>

            <ul className="space-y-1.5">
              {product.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#7ecad6]">
                  <span className="text-[#06b6d4] flex-shrink-0 mt-px">✓</span>{f}
                </li>
              ))}
            </ul>

            {/* Variants */}
            {product.colors && (
              <div>
                <p className="text-xs font-bold text-[#7ecad6] mb-2">
                  {t(country,'color_label')} <span className="text-white">{color}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
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
                  {t(country,'size_label')} <span className="text-white">{size}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
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

            {/* Qty */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-[#7ecad6]">{t(country,'qty_label')}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(q => Math.max(1,q-1))}
                  className="w-9 h-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-lg hover:border-[#06b6d4] hover:bg-[rgba(6,182,212,0.1)] transition-colors"
                >
                  −
                </button>
                <span className="text-lg font-bold w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(q => q+1)}
                  className="w-9 h-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-lg hover:border-[#06b6d4] hover:bg-[rgba(6,182,212,0.1)] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4 mt-2">
              <span className="text-3xl font-black">{formatPrice(withKdv(product.price, country) * qty, country)}</span>
              <button onClick={handleAdd} className="btn-brand flex-1 rounded-full py-3.5 font-bold text-sm">
                {t(country,'add_to_cart')}
              </button>
            </div>

            {/* Supplier */}
            <div className="rounded-2xl border border-[rgba(6,182,212,0.1)] bg-[rgba(6,182,212,0.04)] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#06b6d4] mb-1">
                {t(country,'supplier_label')}
              </p>
              <p className="text-[#7ecad6] text-sm">
                {supplierName ?? product.supplier}
              </p>
              <p className="text-[#7ecad6] text-xs mt-0.5">{product.supplierNote}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
