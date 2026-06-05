import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CartItem } from '@/types'

function generateOrderNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = 'PS-'
  for (let i = 0; i < 7; i++) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      firstName: string
      lastName: string
      email: string
      phone: string
      address: string
      city: string
      zip: string
      country: string
      shippingMethod: string
      shippingPrice: number
      subtotal: number
      total: number
      items: CartItem[]
      status?: string
    }

    const order = await prisma.order.create({
      data: {
        orderNumber:    generateOrderNumber(),
        status:         body.status ?? 'pending',
        firstName:      body.firstName,
        lastName:       body.lastName,
        email:          body.email,
        phone:          body.phone,
        address:        body.address,
        city:           body.city,
        zip:            body.zip,
        country:        body.country,
        shippingMethod: body.shippingMethod,
        shippingPrice:  body.shippingPrice,
        subtotal:       body.subtotal,
        total:          body.total,
        items: {
          create: body.items.map(i => ({
            productId:     i.product.id,
            productName:   i.product.name,
            productPrice:  i.product.price,
            quantity:      i.quantity,
            selectedColor: i.selectedColor ?? null,
            selectedSize:  i.selectedSize ?? null,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json({ id: order.id, orderNumber: order.orderNumber }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/orders]', err)
    return NextResponse.json({ error: 'Sipariş kaydedilemedi.' }, { status: 500 })
  }
}

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json(orders)
}
