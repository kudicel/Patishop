import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/locale'
import { OrderStatusUpdater } from '@/components/OrderStatusUpdater'
import { CJOrderPanel } from '@/components/CJOrderPanel'

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order) notFound()

  const rows = [
    ['Müşteri',        `${order.firstName} ${order.lastName}`],
    ['E-posta',        order.email],
    ['Telefon',        order.phone],
    ['Adres',          `${order.address}, ${order.city} ${order.zip}`],
    ['Ülke',           order.country],
    ['Kargo',          order.shippingMethod === 'express' ? 'Hızlı Kargo' : 'Standart Kargo'],
    ['Sipariş Tarihi', new Date(order.createdAt).toLocaleString('tr-TR')],
  ]

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="text-[#c4a896] hover:text-white text-sm transition-colors">
          ← Siparişler
        </Link>
        <span className="text-white/20">/</span>
        <span className="font-black text-[#ff9a3c]">{order.orderNumber}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer details */}
          <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
              <h2 className="font-bold text-sm uppercase tracking-wide text-[#c4a896]">Müşteri Bilgileri</h2>
            </div>
            <div className="px-6 py-4 space-y-3">
              {rows.map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-4 text-sm">
                  <span className="text-[#c4a896] flex-shrink-0">{label}</span>
                  <span className="font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order items */}
          <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
              <h2 className="font-bold text-sm uppercase tracking-wide text-[#c4a896]">
                Ürünler ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {order.items.map(item => (
                <div key={item.id} className="px-6 py-4 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    {(item.selectedColor || item.selectedSize) && (
                      <p className="text-xs text-[#c4a896] mt-0.5">
                        {[item.selectedColor, item.selectedSize].filter(Boolean).join(' / ')}
                      </p>
                    )}
                    <p className="text-xs text-[#c4a896] mt-0.5">x{item.quantity}</p>
                  </div>
                  <span className="font-bold text-[#ff9a3c]">
                    {formatPrice(item.productPrice * item.quantity, order.country)}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-white/[0.06] space-y-2 bg-white/[0.01]">
              <div className="flex justify-between text-sm">
                <span className="text-[#c4a896]">Ara Toplam</span>
                <span>{formatPrice(order.subtotal, order.country)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#c4a896]">Kargo</span>
                <span className={order.shippingPrice === 0 ? 'text-green-400' : ''}>
                  {order.shippingPrice === 0 ? 'Ücretsiz' : formatPrice(order.shippingPrice, order.country)}
                </span>
              </div>
              <div className="flex justify-between font-black text-base pt-1 border-t border-white/[0.06]">
                <span>Toplam</span>
                <span className="text-[#ff9a3c]">{formatPrice(order.total, order.country)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: status updater + CJ panel */}
        <div className="space-y-4">
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
          <CJOrderPanel
            orderId={order.id}
            initialCjOrderId={order.cjOrderId ?? null}
            initialCjStatus={order.cjStatus ?? null}
          />
        </div>
      </div>
    </div>
  )
}
