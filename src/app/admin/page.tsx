import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/locale'
import { statusLabel, statusClass } from '@/lib/orderStatus'

export default async function AdminDashboard() {
  const [totalOrders, totalCustomers, pendingOrders, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: 'user' } }),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { items: true },
    }),
  ])

  const revenueAgg = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { not: 'cancelled' } },
  })
  const totalRevenue = revenueAgg._sum.total ?? 0

  const stats = [
    { label: 'Toplam Sipariş',   value: totalOrders,                       icon: '📦', color: 'from-orange-500/20 to-orange-600/5' },
    { label: 'Toplam Gelir',     value: formatPrice(totalRevenue, 'TR'),   icon: '₺',  color: 'from-green-500/20 to-green-600/5' },
    { label: 'Bekleyen',         value: pendingOrders,                     icon: '⏳', color: 'from-yellow-500/20 to-yellow-600/5' },
    { label: 'Müşteri',          value: totalCustomers,                    icon: '👥', color: 'from-blue-500/20 to-blue-600/5' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black mb-1">Dashboard</h1>
      <p className="text-[#7ecad6] text-sm mb-8">Mağaza genel durumu</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label}
            className={`rounded-2xl border border-white/[0.08] bg-gradient-to-br ${s.color} p-5`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-xs text-[#7ecad6] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-bold">Son Siparişler</h2>
          <Link href="/admin/orders" className="text-sm text-[#06b6d4] hover:underline">
            Tümünü gör →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-6 py-8 text-[#7ecad6] text-sm text-center">Henüz sipariş yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#7ecad6] text-xs uppercase tracking-wide border-b border-white/[0.06]">
                  <th className="px-6 py-3 text-left">Sipariş No</th>
                  <th className="px-6 py-3 text-left">Müşteri</th>
                  <th className="px-6 py-3 text-left">Tarih</th>
                  <th className="px-6 py-3 text-right">Tutar</th>
                  <th className="px-6 py-3 text-left">Durum</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3">
                      <Link href={`/admin/orders/${order.id}`}
                        className="text-[#06b6d4] font-bold hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-[#7ecad6]">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="px-6 py-3 text-[#7ecad6]">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold">
                      {formatPrice(order.total, order.country)}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusClass(order.status)}`}>
                        {statusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
