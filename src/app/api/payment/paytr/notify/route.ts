import { createHmac } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const merchantKey  = process.env.PAYTR_MERCHANT_KEY!
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT!

    // Verify hash: base64(hmac_sha256(merchant_oid + merchant_salt + status + total_amount, merchant_key))
    const expected = Buffer.from(
      createHmac('sha256', merchantKey)
        .update(merchantOid + merchantSalt + status + totalAmount)
        .digest()
    ).toString('base64')

    if (expected !== hash) {
      console.error('[PayTR notify] hash mismatch')
      return new NextResponse('HASH_ERROR', { status: 400 })
    }

    if (status === 'success') {
      await prisma.order.update({
        where: { id: merchantOid },
        data:  { status: 'processing' },
      })
    } else {
      await prisma.order.update({
        where: { id: merchantOid },
        data:  { status: 'cancelled' },
      })
    }

    return new NextResponse('OK')
  } catch (err) {
    console.error('[POST /api/payment/paytr/notify]', err)
    return new NextResponse('ERROR', { status: 500 })
  }
}
