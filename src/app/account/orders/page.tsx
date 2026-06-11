'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { t, formatPrice, TranslationKey } from '@/lib/locale'
import { statusClass } from '@/lib/orderStatus'

type OrderItem = {
  productName: string
  productPrice: number
  quantity: number
  selectedColor: string | null
  selectedSize: string | null
}

type Order = {
  id: string
  orderNumber: string
  status: string
  total: number
  country: string
  createdAt: string
  items: OrderItem[]
}

const STATUS_KEYS: Record<string, TranslationKey> = {
  awaiting_payment: 'status_awaiting_payment',
  pending:          'status_pending',
  processing:       'status_processing',
  shipped:          'status_shipped',
  delivered:        'status_delivered',
  cancelled:        'status_cancelled',
}

export default function MyOrdersPage() {
  const { data: session, status } = useSession()
  const router  = useRouter()
  const country = useStore(s => s.currentCountry)

  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return }
    if (status === 'authenticated') {
      fetch('/api/account/orders')
        .then(r => r.json())
        .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false) })
    }
  }, [status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#050f12] flex items-center justify-center text-[#7ecad6]">
        <span className="w-6 h-6 border-2 border-[#06b6d4] border-t-transparent rounded-full animate-spin mr-3" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050f12] text-white">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between lg:px-12">
        <Link href="/" className="brand-gradient text-2xl font-black tracking-tight">PatiShop</Link>
        <span className="text-[#7ecad6] text-sm truncate max-w-[200px]">{session?.user?.email}</span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 lg:px-12">
        <h1 className="text-3xl font-black mb-8">{t(country, 'my_orders')}</h1>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-5">📦</p>
            <p className="text-[#7ecad6] mb-6">{t(country, 'no_orders_yet')}</p>
            <Link href="/" className="btn-brand px-8 py-3 rounded-full font-bold text-sm inline-block">
              {t(country, 'btn_catalog')}
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map(order => {
              const statusKey = STATUS_KEYS[order.status]
              return (
                <article key={order.id}
                  className="rounded-[1.75rem] border border-[rgba(6,182,212,0.1)] bg-white/[0.03] p-6">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-[#06b6d4] font-black text-lg">{order.orderNumber}</p>
                      <p className="text-[#7ecad6] text-xs mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass(order.status)}`}>
                      {statusKey ? t(country, statusKey) : order.status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-[#7ecad6]">
                          {item.productName}
                          {item.selectedColor && <span className="text-xs ml-1.5 opacity-70">· {item.selectedColor}</span>}
                          {item.selectedSize  && <span className="text-xs ml-1 opacity-70">[{item.selectedSize}]</span>}
                          <span className="ml-2 text-white/60">× {item.quantity}</span>
                        </span>
                        <span className="font-semibold tabular-nums">
                          {formatPrice(item.productPrice * item.quantity, order.country)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <span className="text-[#7ecad6] text-sm">{t(country, 'co_total')}</span>
                    <span className="font-black text-xl">{formatPrice(order.total, order.country)}</span>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
