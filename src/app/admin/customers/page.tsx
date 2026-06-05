import { prisma } from '@/lib/prisma'

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'user' },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  })

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black mb-1">Müşteriler</h1>
      <p className="text-[#c4a896] text-sm mb-8">Toplam {customers.length} kayıtlı müşteri</p>

      <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
        {customers.length === 0 ? (
          <p className="px-6 py-12 text-[#c4a896] text-sm text-center">Henüz kayıtlı müşteri yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#c4a896] text-xs uppercase tracking-wide border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-6 py-3 text-left">Ad Soyad</th>
                  <th className="px-6 py-3 text-left">E-posta</th>
                  <th className="px-6 py-3 text-center">Sipariş</th>
                  <th className="px-6 py-3 text-left">Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3 font-semibold">{c.name ?? '—'}</td>
                    <td className="px-6 py-3 text-[#c4a896]">{c.email}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                        ${c._count.orders > 0
                          ? 'bg-[rgba(255,154,60,0.12)] text-[#ff9a3c]'
                          : 'bg-white/[0.06] text-[#c4a896]'}`}>
                        {c._count.orders}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[#c4a896] text-xs">
                      {new Date(c.createdAt).toLocaleDateString('tr-TR')}
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
