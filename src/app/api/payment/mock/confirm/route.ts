import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_PAYMENT_MODE !== 'mock') {
    return NextResponse.json({ error: 'Mock mod aktif değil.' }, { status: 403 })
  }
  try {
    const { orderId } = await req.json() as { orderId: string }
    if (!orderId) return NextResponse.json({ error: 'orderId gerekli.' }, { status: 400 })

    await prisma.order.update({
      where: { id: orderId },
      data:  { status: 'processing' },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/payment/mock/confirm]', err)
    return NextResponse.json({ error: 'Sipariş güncellenemedi.' }, { status: 500 })
  }
}
