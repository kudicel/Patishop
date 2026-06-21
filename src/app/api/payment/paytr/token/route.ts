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

    const merchantId   = process.env.PAYTR_MERCHANT_ID
    const merchantKey  = process.env.PAYTR_MERCHANT_KEY
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT
    if (!merchantId || !merchantKey || !merchantSalt) {
      return NextResponse.json({ error: 'PayTR yapılandırması eksik.' }, { status: 500 })
    }
    const base     = process.env.PAYTR_CALLBACK_BASE ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001'
    const testMode = process.env.PAYTR_TEST_MODE ?? '1'
    console.log('[PayTR debug] merchantId:', merchantId, '| keyLen:', merchantKey.length, '| saltLen:', merchantSalt.length, '| testMode:', testMode, '| base:', base)

    const rawIp  = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? req.headers.get('x-real-ip') ?? '127.0.0.1'
    const userIp = rawIp === '::1' ? '127.0.0.1' : rawIp

    // PayTR wants payment_amount in kuruş (integer)
    const paymentAmount = Math.round(Number(order.total) * 100).toString()

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

    // PayTR merchant_oid: tire ve özel karakter içeremez
    const merchantOid = orderId.replace(/-/g, '')

    // Hash: merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode + merchant_salt
    // HMAC key: merchant_key (not merchant_salt)
    const hashStr = merchantId + userIp + merchantOid + order.email + paymentAmount + userBasket + noInstallment + maxInstallment + currency + testMode + merchantSalt
    const paytrToken = Buffer.from(
      createHmac('sha256', merchantKey).update(hashStr).digest()
    ).toString('base64')

    const params = new URLSearchParams({
      merchant_id:      merchantId,
      user_ip:          userIp,
      merchant_oid:     merchantOid,
      email:            order.email,
      payment_amount:   paymentAmount,
      paytr_token:      paytrToken,
      user_basket:      userBasket,
      debug_on:         testMode === '1' ? '1' : '0',
      no_installment:   noInstallment,
      max_installment:  maxInstallment,
      user_name:        `${order.firstName} ${order.lastName}`,
      user_address:     `${order.address}, ${order.city} ${order.zip ?? ''}`,
      user_phone:       order.phone.replace(/\D/g, ''),
      merchant_ok_url:  `${base}/order-success?id=${orderId}`,
      merchant_fail_url:`${base}/payment/paytr/fail?id=${orderId}`,
      currency,
      test_mode:        testMode,
      lang:             order.country === 'TR' ? 'tr' : 'en',
      timeout_limit:    '30',
    })

    console.log('[PayTR params]', params.toString().replace(/paytr_token=[^&]+/, 'paytr_token=***').slice(0, 400))
    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    params.toString(),
    })

    const rawText = await response.text()
    const hdrs = Object.fromEntries(response.headers.entries())
    console.log('[PayTR token] HTTP status:', response.status, '| server:', hdrs['server'] ?? hdrs['cf-ray'] ? 'cloudflare' : '?', '| body:', rawText.slice(0, 300))
    let data: { status: string; token?: string; reason?: string }
    try {
      data = JSON.parse(rawText)
    } catch {
      console.error('[PayTR token] JSON parse failed, HTTP status:', response.status, '| raw:', rawText.slice(0, 500))
      return NextResponse.json({ error: `PayTR hata: HTTP ${response.status} — ${rawText.slice(0, 100) || '(boş yanıt)'}` }, { status: 500 })
    }

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
