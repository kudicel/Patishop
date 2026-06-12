import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

async function approveReview(id: string) {
  'use server'
  await prisma.review.update({ where: { id }, data: { approved: true } })
  revalidatePath('/admin/reviews')
}

async function deleteReview(id: string) {
  'use server'
  await prisma.review.delete({ where: { id } })
  revalidatePath('/admin/reviews')
}

export default async function AdminReviewsPage() {
  const [pending, approved] = await Promise.all([
    prisma.review.findMany({ where: { approved: false }, orderBy: { createdAt: 'desc' } }),
    prisma.review.findMany({ where: { approved: true  }, orderBy: { createdAt: 'desc' }, take: 20 }),
  ])

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black mb-1">Yorumlar</h1>
      <p className="text-[#7ecad6] text-sm mb-8">Müşteri yorumlarını onayla veya sil</p>

      {/* Bekleyen yorumlar */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-bold text-lg">Bekleyen Onay</h2>
          {pending.length > 0 && (
            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">
              {pending.length}
            </span>
          )}
        </div>
        {pending.length === 0 ? (
          <p className="text-[#7ecad6] text-sm">Onay bekleyen yorum yok.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map(r => (
              <div key={r.id} className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-sm">{r.name}</span>
                      <span className="text-amber-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      <span className="text-[#7ecad6] text-xs">{r.productId}</span>
                    </div>
                    <p className="text-[#c4a896] text-sm">{r.comment}</p>
                    <p className="text-[#7ecad6] text-xs mt-1">{new Date(r.createdAt).toLocaleString('tr-TR')}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <form action={approveReview.bind(null, r.id)}>
                      <button className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 text-sm font-bold hover:bg-green-500/30 transition-colors">
                        Onayla
                      </button>
                    </form>
                    <form action={deleteReview.bind(null, r.id)}>
                      <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-colors">
                        Sil
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Onaylı yorumlar */}
      <section>
        <h2 className="font-bold text-lg mb-4">Onaylı Yorumlar</h2>
        {approved.length === 0 ? (
          <p className="text-[#7ecad6] text-sm">Henüz onaylı yorum yok.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {approved.map(r => (
              <div key={r.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-sm">{r.name}</span>
                      <span className="text-amber-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      <span className="text-[#06b6d4] text-xs">{r.productId}</span>
                    </div>
                    <p className="text-[#c4a896] text-sm">{r.comment}</p>
                    <p className="text-[#7ecad6] text-xs mt-1">{new Date(r.createdAt).toLocaleString('tr-TR')}</p>
                  </div>
                  <form action={deleteReview.bind(null, r.id)}>
                    <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-colors">
                      Sil
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
