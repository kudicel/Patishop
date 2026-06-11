import { redirect } from 'next/navigation'
import Link from 'next/link'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export default async function StripeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; orderId?: string }>
}) {
  const { session_id, orderId } = await searchParams

  if (!session_id || !orderId) redirect('/')

  // Verify payment with Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id)

  if (session.payment_status === 'paid') {
    await prisma.order.update({
      where: { id: orderId },
      data:  { status: 'processing' },
    })
    redirect(`/order-success?id=${orderId}`)
  }

  // Payment not completed — show error
  return (
    <div className="min-h-screen bg-[#050f12] text-white flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30
        flex items-center justify-center text-4xl mb-6">
        ✗
      </div>
      <h1 className="text-2xl font-black mb-2">Ödeme Tamamlanamadı</h1>
      <p className="text-[#7ecad6] text-sm mb-8">
        Ödeme işlemi beklenmedik bir şekilde sonuçlandı.
      </p>
      <Link href="/" className="btn-brand px-8 py-3 rounded-full font-bold text-sm">
        Ana Sayfaya Dön
      </Link>
    </div>
  )
}
