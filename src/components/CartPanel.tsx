'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { formatPrice, withKdv, t } from '@/lib/locale'
import { bulkUnitPrice, bulkLineTotal, getTier, discountLabel } from '@/lib/bulk-pricing'

export function CartPanel() {
  const cart       = useStore(s => s.cart)
  const cartOpen   = useStore(s => s.cartOpen)
  const setCartOpen = useStore(s => s.setCartOpen)
  const removeFromCart = useStore(s => s.removeFromCart)
  const updateQty  = useStore(s => s.updateQty)
  const country    = useStore(s => s.currentCountry)

  const totalTRY = cart.reduce((sum, i) => sum + bulkLineTotal(withKdv(i.product.price, country), i.quantity), 0)

  if (!cartOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setCartOpen(false)} />
      <div className="fixed right-4 bottom-4 z-50 w-full max-w-[420px] max-h-[80vh] flex flex-col
        rounded-[1.75rem] border border-[rgba(6,182,212,0.2)] bg-[rgba(10,6,2,0.98)]
        shadow-modal animate-slide-up overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <h2 className="text-lg font-bold">{t(country,'cart')}</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-lg hover:bg-white/10 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {cart.length === 0 ? (
            <p className="text-[#7ecad6] text-sm">{t(country,'cart_empty')}</p>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 py-3 border-b border-white/[0.06] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.product.name}</p>
                  {(item.selectedColor || item.selectedSize) && (
                    <p className="text-[#7ecad6] text-xs mt-0.5">
                      {[item.selectedColor, item.selectedSize].filter(Boolean).join(' / ')}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-white/10 text-sm flex items-center justify-center hover:border-[#06b6d4] transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-white/10 text-sm flex items-center justify-center hover:border-[#06b6d4] transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-1 text-xs text-[#7ecad6] hover:text-red-400 transition-colors"
                    >
                      Sil
                    </button>
                    {(() => {
                      const label = discountLabel(getTier(item.quantity).discount)
                      return label ? (
                        <span className="text-xs font-bold bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-md">
                          {label}
                        </span>
                      ) : null
                    })()}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span className="text-[#06b6d4] font-bold text-sm">
                    {formatPrice(bulkLineTotal(withKdv(item.product.price, country), item.quantity), country)}
                  </span>
                  {getTier(item.quantity).discount > 0 && (
                    <span className="text-[#7ecad6] text-xs line-through">
                      {formatPrice(withKdv(item.product.price, country) * item.quantity, country)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-white/8 px-6 py-4 space-y-3">
            {/* Kargo eşiği */}
            {(() => {
              const FREE_SHIPPING = 3000
              const SHIPPING_FEE  = 499
              const remaining = FREE_SHIPPING - totalTRY
              return remaining > 0 ? (
                <div className="rounded-xl bg-[rgba(6,182,212,0.07)] border border-[rgba(6,182,212,0.15)] px-4 py-3">
                  <div className="flex justify-between text-xs text-[#7ecad6] mb-2">
                    <span>Kargo: <strong className="text-white">{SHIPPING_FEE}₺</strong> · Bedava için</span>
                    <span className="text-[#06b6d4] font-bold">{remaining.toFixed(0)}₺ kaldı</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#06b6d4] to-[#ec4899] transition-all"
                      style={{ width: `${Math.min((totalTRY / FREE_SHIPPING) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-[rgba(6,182,212,0.07)] border border-[rgba(6,182,212,0.15)] px-4 py-2.5 text-center text-sm text-[#06b6d4] font-semibold">
                  🎉 Kargo bedava!
                </div>
              )
            })()}
            <div className="flex justify-between items-center font-bold">
              <span>{t(country,'cart_total')}</span>
              <span className="text-xl text-[#06b6d4]">{formatPrice(totalTRY, country)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="btn-brand w-full rounded-full py-3.5 font-bold block text-center"
            >
              {t(country,'checkout')}
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
