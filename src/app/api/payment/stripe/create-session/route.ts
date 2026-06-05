import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getCountryConfig } from '@/lib/locale'

// Stripe does not support TRY — TR goes through iyzico
const STRIPE_UNSUPPORTED = ['TR', 'RU']

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json() as { orderId: string }
    if (!orderId) return NextResponse.json({ error: 'orderId gerekli.' }, { status: 400 })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })
    if (!order) return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 })
    if (STRIPE_UNSUPPORTED.includes(order.country)) {
      return NextResponse.json({ error: 'Bu ülke için Stripe desteklenmiyor.' }, { status: 400 })
    }

    const cfg      = getCountryConfig(order.country)
    const currency = cfg.currency.toLowerCase()
    const base     = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001'

    // Convert TRY amounts to the target currency (Stripe smallest unit)
    function toStripeAmount(tryAmount: number): number {
      return Math.round(tryAmount * cfg.rate * 100)
    }

    const lineItems = order.items.map(item => ({
      price_data: {
        currency,
        product_data: {
          name: item.productName,
          description: [item.selectedColor, item.selectedSize].filter(Boolean).join(' / ') || undefined,
        },
        unit_amount: toStripeAmount(item.productPrice),
      },
      quantity: item.quantity,
    }))

    // Add shipping as a line item if not free
    if (order.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency,
          product_data: { name: 'Kargo', description: undefined },
          unit_amount: toStripeAmount(order.shippingPrice),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: order.email,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      success_url: `${base}/payment/stripe/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order.id}`,
      cancel_url:  `${base}/payment/stripe/cancel?orderId=${order.id}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[POST /api/payment/stripe/create-session]', err)
    return NextResponse.json({ error: 'Stripe session oluşturulamadı.' }, { status: 500 })
  }
}
