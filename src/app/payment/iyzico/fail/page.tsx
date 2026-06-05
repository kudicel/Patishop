import Link from 'next/link'

export default async function IyzicoFailPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const { orderId } = await searchParams

  return (
    <div className="min-h-screen bg-[#0a0602] text-white flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30
        flex items-center justify-center text-4xl mb-6">
        ✗
      </div>
      <h1 className="text-2xl font-black mb-2">Ödeme Başarısız</h1>
      <p className="text-[#c4a896] text-sm mb-2">
        Kart bilgilerinizi kontrol edip tekrar deneyin.
      </p>
      {orderId && (
        <p className="text-xs text-[#c4a896] mb-8">
          Sipariş: <span className="text-[#ff9a3c] font-bold">{orderId}</span>
        </p>
      )}
      <div className="flex gap-3">
        <Link href="/" className="btn-brand px-8 py-3 rounded-full font-bold text-sm">
          Ana Sayfaya Dön
        </Link>
        <Link href="/checkout" className="btn-ghost px-8 py-3 rounded-full font-bold text-sm">
          Yeniden Dene
        </Link>
      </div>
    </div>
  )
}
