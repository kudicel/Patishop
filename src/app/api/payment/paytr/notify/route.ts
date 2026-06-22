import { createHmac } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'

export const runtime = 'nodejs'

// PayTR posts form-urlencoded to this endpoint on every payment result.
// Must respond with plain text "OK" on success.
export async function POST(req: NextRequest) {
  try {
    const body        = await req.text()
    const params      = new URLSearchParams(body)
    const merchantOid = params.get('merchant_oid') ?? ''
    const status      = params.get('status') ?? ''
    const totalAmount = params.get('total_amount') ?? ''
    const hash        = params.get('hash') ?? ''

    const merchantKey  = process.env.PAYTR_MERCHANT_KEY
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT
    if (!merchantKey || !merchantSalt) {
      console.error('[PayTR notify] PAYTR_MERCHANT_KEY veya PAYTR_MERCHANT_SALT eksik')
      return new NextResponse('ERROR', { status: 500 })
    }

    // Verify hash: base64(hmac_sha256(merchant_oid + merchant_salt + status + total_amount, merchant_key))
    const expected = Buffer.from(
      createHmac('sha256', merchantKey)
        .update(merchantOid + merchantSalt + status + totalAmount)
        .digest()
    ).toString('base64')

    if (expected !== hash) {
      console.error('[PayTR notify] hash mismatch, merchantOid:', merchantOid)
      return new NextResponse('HASH_ERROR', { status: 400 })
    }

    if (status === 'success') {
      // updateMany: sadece hâlâ awaiting_payment olan siparişi güncelle (idempotency)
      const { count } = await prisma.order.updateMany({
        where: { id: merchantOid, status: 'awaiting_payment' },
        data:  { status: 'processing' },
      })

      // Sadece ilk başarılı notify'da email gönder (count=0 ise zaten işlendi)
      if (count > 0) {
        const order = await prisma.order.findUnique({
          where: { id: merchantOid },
          include: { items: true },
        })
        if (order) {
          const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop.tr'
          await sendOrderConfirmationEmail({
            to:           order.email,
            firstName:    order.firstName,
            orderNumber:  order.orderNumber,
            items:        order.items,
            subtotal:     order.subtotal,
            discount:     order.discount,
            couponCode:   order.couponCode ?? null,
            shippingPrice:order.shippingPrice,
            total:        order.total,
            baseUrl:      base,
          })
        }
      }
    } else {
      await prisma.order.updateMany({
        where: { id: merchantOid, status: 'awaiting_payment' },
        data:  { status: 'cancelled' },
      })
    }

    return new NextResponse('OK')
  } catch (err) {
    console.error('[POST /api/payment/paytr/notify]', err)
    return new NextResponse('ERROR', { status: 500 })
  }
}
