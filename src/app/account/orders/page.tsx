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
  cjOrderId: string | null
  cjStatus: string | null
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

const STEPS = [
  { key: 'pending',    icon: '✅', label: 'Sipariş Alındı' },
  { key: 'processing', icon: '📦', label: 'Hazırlanıyor' },
  { key: 'shipped',    icon: '🚚', label: 'Kargoya Verildi' },
  { key: 'delivered',  icon: '🏠', label: 'Teslim Edildi' },
]

const STEP_ORDER = ['awaiting_payment', 'pending', 'processing', 'shipped', 'delivered']

function getStepIndex(status: string) {
  if (status === 'cancelled') return -1
  const idx = STEP_ORDER.indexOf(status)
  return idx >= 0 ? idx : 1
}

function estimatedDelivery(createdAt: string) {
  const d = new Date(createdAt)
  d.setDate(d.getDate() + 15) // ~orta nokta 10–20 iş günü
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function OrderProgressBar({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
        <span>✕</span> Sipariş İptal Edildi
      </div>
    )
  }

  if (status === 'awaiting_payment') {
    return (
      <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold">
        <span>⏳</span> Ödeme Bekleniyor
      </div>
    )
  }

  const currentIdx = getStepIndex(status)

  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/[0.06]" />
      <div
        className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-[#06b6d4] to-[#ec4899] transition-all duration-500"
        style={{ width: `${Math.min(100, (currentIdx - 1) / (STEPS.length - 1) * 100)}%` }}
      />

      <div className="relative flex justify-between">
        {STEPS.map((step, i) => {
          const stepIdx = i + 1 // pending=1, processing=2, shipped=3, delivered=4
          const done    = currentIdx >= stepIdx
          const active  = currentIdx === stepIdx

          return (
            <div key={step.key} className="flex flex-col items-center gap-1.5 w-1/4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 transition-all ${
                done
                  ? 'bg-gradient-to-br from-[#06b6d4] to-[#ec4899] shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-white/[0.06] border border-white/[0.1]'
              } ${active ? 'ring-2 ring-[#06b6d4]/40' : ''}`}>
                {done ? step.icon : <span className="text-white/20 text-sm">{i + 1}</span>}
              </div>
              <span className={`text-[10px] text-center leading-tight ${done ? 'text-white font-semibold' : 'text-white/30'}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function MyOrdersPage() {
  const { data: session, status } = useSession()
  const router  = useRouter()
  const country = useStore(s => s.currentCountry)

  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [openId,  setOpenId]  = useState<string | null>(null)

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
              const isOpen    = openId === order.id

              return (
                <article key={order.id}
                  className="rounded-[1.75rem] border border-[rgba(6,182,212,0.1)] bg-white/[0.03] overflow-hidden">

                  {/* Header — clickable to expand */}
                  <button
                    onClick={() => setOpenId(isOpen ? null : order.id)}
                    className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div>
                      <p className="text-[#06b6d4] font-black text-lg">{order.orderNumber}</p>
                      <p className="text-[#7ecad6] text-xs mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass(order.status)}`}>
                        {statusKey ? t(country, statusKey) : order.status}
                      </span>
                      <span className="text-white/30 text-sm">{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </button>

                  {/* Total always visible */}
                  <div className="px-6 pb-4 flex items-center justify-between">
                    <span className="text-[#7ecad6] text-sm">{t(country, 'co_total')}</span>
                    <span className="font-black text-xl">{formatPrice(order.total, order.country)}</span>
                  </div>

                  {/* Expandable detail */}
                  {isOpen && (
                    <div className="border-t border-white/[0.06] px-6 py-6 space-y-6">

                      {/* Progress stepper */}
                      <OrderProgressBar status={order.status} />

                      {/* Tahmini teslimat */}
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <div className="flex items-center gap-3 text-sm rounded-xl bg-[rgba(6,182,212,0.06)] border border-[rgba(6,182,212,0.12)] px-4 py-3">
                          <span className="text-base">🗓️</span>
                          <span className="text-[#7ecad6]">Tahmini teslimat: <strong className="text-white">{estimatedDelivery(order.createdAt)}</strong></span>
                        </div>
                      )}

                      {/* CJ kargo takip */}
                      {(order.cjOrderId || order.cjStatus) && (
                        <div className="rounded-xl bg-[rgba(255,154,60,0.06)] border border-[rgba(255,154,60,0.15)] px-4 py-3 space-y-1">
                          <p className="text-xs font-bold uppercase tracking-wide text-[#ff9a3c] mb-2">Kargo Takip</p>
                          {order.cjOrderId && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#7ecad6]">CJ Sipariş No</span>
                              <span className="font-mono text-white text-xs">{order.cjOrderId}</span>
                            </div>
                          )}
                          {order.cjStatus && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#7ecad6]">Kargo Durumu</span>
                              <span className="text-white font-semibold text-xs">{order.cjStatus}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Items */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#7ecad6] mb-3">Sipariş İçeriği</p>
                        <div className="space-y-2">
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
                      </div>

                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
