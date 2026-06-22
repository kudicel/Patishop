'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { useStore } from '@/lib/store'
import { formatPrice, t } from '@/lib/locale'

type ApiOrder = {
  id: string
  orderNumber: string
  status: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  zip: string
  country: string
  shippingMethod: string
  shippingPrice: number
  subtotal: number
  discount: number
  couponCode: string | null
  total: number
  createdAt: string
  items: {
    id: string
    productId: string
    productName: string
    productPrice: number
    quantity: number
    selectedColor: string | null
    selectedSize: string | null
  }[]
}

function OrderSuccessContent() {
  const country = useStore(s => s.currentCountry)
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [order, setOrder]   = useState<ApiOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) { setLoading(false); setNotFound(true); return }
    fetch(`/api/orders/${id}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); return null }
        return r.json()
      })
      .then((data: ApiOrder | null) => { setOrder(data); setLoading(false) })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [id])

  const displayCountry = order?.country ?? country

  if (notFound && !loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center space-y-4">
          <p className="text-[#7ecad6]">Sipariş bulunamadı.</p>
          <Link href="/" className="btn-brand inline-block px-8 py-3 rounded-full font-bold text-sm">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[rgba(6,182,212,0.12)] border border-[rgba(6,182,212,0.3)]
            flex items-center justify-center text-4xl">
            ✓
          </div>
        </div>

        <h1 className="text-2xl font-black text-center mb-2">
          {t(country, 'co_success_title')}
        </h1>
        <p className="text-[#7ecad6] text-center text-sm mb-2">
          {t(country, 'co_success_msg')}
        </p>

        {/* Email confirmation hint */}
        {order && (
          <p className="text-center text-xs text-white/40 mb-8">
            Onay emaili <span className="text-white/60">{order.email}</span> adresine gönderildi.
          </p>
        )}

        {loading && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 mb-6 text-center text-[#7ecad6] text-sm">
            Sipariş yükleniyor...
          </div>
        )}

        {!loading && order && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 mb-6 space-y-4">
            {/* Order number */}
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
              <span className="text-xs text-[#7ecad6] uppercase tracking-wide font-semibold">
                {t(country, 'co_order_num')}
              </span>
              <span className="font-black text-[#06b6d4] tracking-widest">#{order.orderNumber}</span>
            </div>

            {/* Recipient */}
            <div className="flex justify-between items-start text-sm">
              <span className="text-[#7ecad6]">Ad Soyad</span>
              <span className="font-semibold text-right">{order.firstName} {order.lastName}</span>
            </div>
            <div className="flex justify-between items-start text-sm">
              <span className="text-[#7ecad6]">E-posta</span>
              <span className="font-semibold text-right break-all">{order.email}</span>
            </div>
            <div className="flex justify-between items-start text-sm">
              <span className="text-[#7ecad6]">Adres</span>
              <span className="font-semibold text-right max-w-[55%]">
                {order.address}, {order.city} {order.zip}
              </span>
            </div>

            {/* Items */}
            <div className="border-t border-white/[0.06] pt-4 space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-[#7ecad6] truncate max-w-[60%]">
                    {item.productName}
                    {item.selectedColor && ` · ${item.selectedColor}`}
                    {item.selectedSize && ` · ${item.selectedSize}`}
                    {' '}×{item.quantity}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(item.productPrice * item.quantity, displayCountry)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-white/[0.06] pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#7ecad6]">{t(country, 'co_subtotal')}</span>
                <span>{formatPrice(order.subtotal, displayCountry)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">
                    İndirim{order.couponCode ? ` (${order.couponCode})` : ''}
                  </span>
                  <span className="text-green-400 font-semibold">
                    −{formatPrice(order.discount, displayCountry)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[#7ecad6]">{t(country, 'co_shipping')}</span>
                <span className={order.shippingPrice === 0 ? 'text-green-400' : ''}>
                  {order.shippingPrice === 0
                    ? t(country, 'co_free')
                    : formatPrice(order.shippingPrice, displayCountry)}
                </span>
              </div>
              <div className="flex justify-between font-black pt-1">
                <span>{t(country, 'co_total')}</span>
                <span className="text-[#06b6d4] text-lg">{formatPrice(order.total, displayCountry)}</span>
              </div>
            </div>
          </div>
        )}

        <Link href="/" className="btn-brand w-full rounded-full py-3.5 font-bold text-sm text-center block">
          {t(country, 'co_continue')}
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  const country = useStore(s => s.currentCountry)

  return (
    <div className="min-h-screen bg-[#050f12] text-white flex flex-col">
      <div className="border-b border-white/[0.06] px-6 py-4">
        <Link href="/" className="text-[#06b6d4] font-black text-xl tracking-tight">PatiShop</Link>
      </div>
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center text-[#7ecad6]">
          {t(country, 'co_continue')}...
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
    </div>
  )
}
