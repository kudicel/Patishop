import { NextRequest, NextResponse } from 'next/server'
import { retrieveCheckoutForm } from '@/lib/iyzico'
import { prisma } from '@/lib/prisma'

// iyzico POSTs form data (application/x-www-form-urlencoded) here
export async function POST(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001'

  try {
    const body = await req.formData()
    const token       = body.get('token') as string
    const status      = body.get('status') as string
    const conversationId = body.get('conversationId') as string // orderId

    if (!token || status === 'failure') {
      return NextResponse.redirect(`${base}/payment/iyzico/fail?orderId=${conversationId ?? ''}`, { status: 302 })
    }

    // Retrieve payment result
    const result = await retrieveCheckoutForm(token)

    const orderId = conversationId

    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      await prisma.order.update({
        where: { id: orderId },
        data:  { status: 'processing' },
      })
      return NextResponse.redirect(`${base}/order-success?id=${orderId}`, { status: 302 })
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data:  { status: 'cancelled' },
      })
      return NextResponse.redirect(`${base}/payment/iyzico/fail?orderId=${orderId}`, { status: 302 })
    }
  } catch (err) {
    console.error('[POST /api/payment/iyzico/callback]', err)
    return NextResponse.redirect(`${base}/payment/iyzico/fail`, { status: 302 })
  }
}
