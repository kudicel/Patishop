import { createHmac } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json() as { orderId: string }
    if (!orderId) return NextResponse.json({ error: 'orderId gerekli.' }, { status: 400 })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })
    if (!order) return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 })

    const merchantId   = process.env.PAYTR_MERCHANT_ID!
    const merchantKey  = process.env.PAYTR_MERCHANT_KEY!
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT!
    const base         = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001'
    const testMode     = process.env.PAYTR_TEST_MODE ?? '1'

    const userIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1'

    // PayTR wants payment_amount in kuruş (integer)
    const paymentAmount = Math.round(order.total * 100).toString()

    // Basket: [[name, unit_price_try_str, quantity], ...]
    const basketItems = order.items.map(item => [
      item.productName,
      item.productPrice.toFixed(2),
      String(item.quantity),
    ])
    if (order.shippingPrice > 0) {
      basketItems.push(['Kargo', order.shippingPrice.toFixed(2), '1'])
    }
    const userBasket = Buffer.from(JSON.stringify(basketItems)).toString('base64')

    const noInstallment  = '0'
    const maxInstallment = '0'
    const currency       = 'TL'

    // Hash: merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode
    const hashStr = merchantId + userIp + orderId + order.email + paymentAmount + userBasket + noInstallment + maxInstallment + currency + testMode
    const paytrToken = Buffer.from(
      createHmac('sha256', merchantKey + merchantSalt).update(hashStr).digest()
    ).toString('base64')

    const params = new URLSearchParams({
      merchant_id:      merchantId,
      user_ip:          userIp,
      merchant_oid:     orderId,
      email:            order.email,
      payment_amount:   paymentAmount,
      paytr_token:      paytrToken,
      user_basket:      userBasket,
      debug_on:         '1',
      no_installment:   noInstallment,
      max_installment:  maxInstallment,
      user_name:        `${order.firstName} ${order.lastName}`,
      user_address:     `${order.address}, ${order.city} ${order.zip}`,
      user_phone:       order.phone,
      merchant_ok_url:  `${base}/order-success?id=${orderId}`,
      merchant_fail_url:`${base}/payment/paytr/fail?id=${orderId}`,
      currency,
      test_mode:        testMode,
      lang:             order.country === 'TR' ? 'tr' : 'en',
    })

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      body:   params,
    })

    const data = await response.json() as { status: string; token?: string; reason?: string }

    if (data.status !== 'success') {
      console.error('[PayTR token error]', data)
      return NextResponse.json({ error: data.reason ?? 'PayTR token alınamadı.' }, { status: 500 })
    }

    return NextResponse.json({ token: data.token })
  } catch (err) {
    console.error('[POST /api/payment/paytr/token]', err)
    return NextResponse.json({ error: 'PayTR başlatılamadı.' }, { status: 500 })
  }
}
