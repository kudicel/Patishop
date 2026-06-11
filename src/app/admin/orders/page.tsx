import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/locale'
import { statusLabel, statusClass, ORDER_STATUSES } from '@/lib/orderStatus'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const { status: filterStatus, page: pageParam } = await searchParams
  const page    = Math.max(1, Number(pageParam ?? 1))
  const perPage = 20
  const skip    = (page - 1) * perPage

  const where = filterStatus && filterStatus !== 'all'
    ? { status: filterStatus }
    : {}

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
      include: { items: { select: { quantity: true } } },
    }),
    prisma.order.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black mb-1">Siparişler</h1>
      <p className="text-[#7ecad6] text-sm mb-6">Toplam {total} sipariş</p>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ value: 'all', label: 'Tümü' }, ...ORDER_STATUSES].map(s => {
          const active = (filterStatus ?? 'all') === s.value
          return (
            <Link
              key={s.value}
              href={`/admin/orders${s.value === 'all' ? '' : `?status=${s.value}`}`}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors
                ${active
                  ? 'btn-brand'
                  : 'bg-white/[0.06] text-[#7ecad6] hover:bg-white/10 hover:text-white'}`}
            >
              {s.label}
            </Link>
          )
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
        {orders.length === 0 ? (
          <p className="px-6 py-12 text-[#7ecad6] text-sm text-center">Bu filtrede sipariş bulunamadı.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#7ecad6] text-xs uppercase tracking-wide border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-6 py-3 text-left">Sipariş No</th>
                  <th className="px-6 py-3 text-left">Müşteri</th>
                  <th className="px-6 py-3 text-left">Ülke</th>
                  <th className="px-6 py-3 text-center">Ürün</th>
                  <th className="px-6 py-3 text-right">Tutar</th>
                  <th className="px-6 py-3 text-left">Tarih</th>
                  <th className="px-6 py-3 text-left">Durum</th>
                  <th className="px-6 py-3 text-center">CJ</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const qty = order.items.reduce((s, i) => s + i.quantity, 0)
                  return (
                    <tr key={order.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3 font-bold text-[#06b6d4]">{order.orderNumber}</td>
                      <td className="px-6 py-3">
                        <div>{order.firstName} {order.lastName}</div>
                        <div className="text-xs text-[#7ecad6]">{order.email}</div>
                      </td>
                      <td className="px-6 py-3 text-[#7ecad6]">{order.country}</td>
                      <td className="px-6 py-3 text-center text-[#7ecad6]">{qty}</td>
                      <td className="px-6 py-3 text-right font-semibold">
                        {formatPrice(order.total, order.country)}
                      </td>
                      <td className="px-6 py-3 text-[#7ecad6] text-xs">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusClass(order.status)}`}>
                          {statusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        {order.cjOrderId ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                            CJ
                          </span>
                        ) : (
                          <span className="text-white/20 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <Link href={`/admin/orders/${order.id}`}
                          className="text-xs text-[#06b6d4] hover:underline">
                          Detay →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link
              key={p}
              href={`/admin/orders?${filterStatus ? `status=${filterStatus}&` : ''}page=${p}`}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-colors
                ${p === page
                  ? 'btn-brand'
                  : 'bg-white/[0.06] text-[#7ecad6] hover:bg-white/10'}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
