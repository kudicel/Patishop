import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { initCheckoutForm } = await import('@/lib/iyzico')
  try {
    const { orderId } = await req.json() as { orderId: string }
    if (!orderId) return NextResponse.json({ error: 'orderId gerekli.' }, { status: 400 })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })
    if (!order) return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 })

    const base   = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001'
    const locale = order.country === 'TR' ? 'tr' : 'en'

    // iyzico requires price as string with 2 decimals
    const fmt = (n: number) => n.toFixed(2)

    // Normalize phone: iyzico requires E.164 format (+90...)
    const rawPhone = order.phone.replace(/\D/g, '')
    const gsmNumber = order.phone.startsWith('+')
      ? order.phone
      : order.country === 'TR'
        ? `+90${rawPhone.startsWith('0') ? rawPhone.slice(1) : rawPhone}`
        : `+${rawPhone}`

    const result = await initCheckoutForm({
      locale,
      conversationId:   order.id,
      price:            fmt(order.subtotal),
      paidPrice:        fmt(order.total),
      currency:         'TRY',
      basketId:         order.orderNumber,
      paymentGroup:     'PRODUCT',
      callbackUrl:      `${base}/api/payment/iyzico/callback`,
      enabledInstallments: [1, 2, 3, 6, 9],

      buyer: {
        id:                  order.id,
        name:                order.firstName,
        surname:             order.lastName,
        email:               order.email,
        identityNumber:      '74300864791', // sandbox placeholder (required by iyzico)
        gsmNumber,
        registrationDate:    '2024-01-01 12:00:00',
        lastLoginDate:       '2024-01-01 12:00:00',
        registrationAddress: order.address,
        ip:                  req.headers.get('x-forwarded-for') ?? '85.34.78.112',
        city:                order.city,
        country:             'Turkey',
        zipCode:             order.zip,
      },

      shippingAddress: {
        contactName: `${order.firstName} ${order.lastName}`,
        city:        order.city,
        country:     'Turkey',
        address:     order.address,
        zipCode:     order.zip,
      },

      billingAddress: {
        contactName: `${order.firstName} ${order.lastName}`,
        city:        order.city,
        country:     'Turkey',
        address:     order.address,
        zipCode:     order.zip,
      },

      basketItems: [
        ...order.items.map(item => ({
          id:        item.productId,
          name:      item.productName,
          category1: 'Evcil Hayvan',
          itemType:  'PHYSICAL',
          price:     fmt(item.productPrice * item.quantity),
        })),
        ...(order.shippingPrice > 0 ? [{
          id:        'shipping',
          name:      'Kargo',
          category1: 'Kargo',
          itemType:  'PHYSICAL',
          price:     fmt(order.shippingPrice),
        }] : []),
      ],
    })

    if (result.status !== 'success') {
      console.error('[iyzico initialize error]', result)
      return NextResponse.json(
        { error: result.errorMessage ?? 'iyzico başlatma hatası.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      checkoutFormContent: result.checkoutFormContent,
      token:               result.token,
    })
  } catch (err) {
    console.error('[POST /api/payment/iyzico/initialize]', err)
    return NextResponse.json({ error: 'iyzico başlatılamadı.' }, { status: 500 })
  }
}
