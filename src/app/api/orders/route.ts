import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CartItem } from '@/types'
import { sendSupplierOrderEmail } from '@/lib/email'
import { createCJOrder } from '@/lib/cj'

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
      discount?: number
      couponCode?: string
      total: number
      items: CartItem[]
      status?: string
    }

    // Neon HTTP adapter doesn't support transactions, so create order and items separately
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
        discount:       body.discount ?? 0,
        couponCode:     body.couponCode ?? null,
        total:          body.total,
      },
    })

    // Increment coupon usedCount if applied
    if (body.couponCode) {
      await prisma.coupon.update({
        where: { code: body.couponCode },
        data:  { usedCount: { increment: 1 } },
      }).catch(() => null)
    }

    for (const i of body.items) {
      await prisma.orderItem.create({
        data: {
          orderId:       order.id,
          productId:     i.product.id,
          productName:   i.product.name,
          productPrice:  i.product.price,
          quantity:      i.quantity,
          selectedColor: i.selectedColor ?? null,
          selectedSize:  i.selectedSize ?? null,
        },
      })
    }

    // Notify suppliers via email
    try {
      await notifySuppliers(order, body.items)
    } catch (e) {
      console.error('[supplier-email]', e)
    }

    // Forward to CJdropshipping if any item has a CJ variant ID linked
    try {
      await forwardToCJ(order, body.items)
    } catch (e) {
      console.error('[cj-order]', e)
    }

    return NextResponse.json({ id: order.id, orderNumber: order.orderNumber }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/orders]', err)
    return NextResponse.json({ error: 'Sipariş kaydedilemedi.' }, { status: 500 })
  }
}

async function notifySuppliers(
  order: { orderNumber: string; firstName: string; lastName: string; address: string; city: string; country: string; shippingMethod: string },
  items: CartItem[]
) {
  const suppliers = await prisma.supplier.findMany({ where: { active: true } })
  const orderProductIds = items.map(i => i.product.id)
  console.log('[supplier-email] sipariş ürünleri:', orderProductIds)
  console.log('[supplier-email] aktif tedarikçi sayısı:', suppliers.length)

  for (const supplier of suppliers) {
    console.log(`[supplier-email] ${supplier.name} productIds:`, supplier.productIds)
    const supplierItems = items.filter(i => supplier.productIds.includes(i.product.id))
    console.log(`[supplier-email] ${supplier.name} eşleşen ürün sayısı:`, supplierItems.length)
    if (supplierItems.length === 0) continue
    await sendSupplierOrderEmail({
      supplierName:   supplier.name,
      supplierEmail:  supplier.email,
      orderNumber:    order.orderNumber,
      customerName:   `${order.firstName} ${order.lastName}`,
      address:        order.address,
      city:           order.city,
      country:        order.country,
      shippingMethod: order.shippingMethod,
      items: supplierItems.map(i => ({
        productName:   i.product.name,
        quantity:      i.quantity,
        selectedColor: i.selectedColor ?? null,
        selectedSize:  i.selectedSize ?? null,
      })),
    })
  }
}

async function forwardToCJ(
  order: { id: string; orderNumber: string; firstName: string; lastName: string; phone: string; address: string; city: string; zip: string; country: string },
  items: CartItem[]
) {
  const productIds = items.map(i => i.product.id)
  const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } } })

  const cjItems = items
    .map(i => {
      const db = dbProducts.find(p => p.id === i.product.id)
      if (!db?.cjVariantId) return null
      return { vid: db.cjVariantId, quantity: i.quantity }
    })
    .filter((x): x is { vid: string; quantity: number } => x !== null)

  if (cjItems.length === 0) {
    console.log('[cj-order] CJ variant ID bağlı ürün yok, atlandı')
    return
  }

  console.log('[cj-order] CJ\'ye iletiliyor, ürün sayısı:', cjItems.length)

  const result = await createCJOrder({
    orderNumber: order.orderNumber,
    items: cjItems,
    address: {
      shippingCustomerName: `${order.firstName} ${order.lastName}`,
      shippingPhone: order.phone,
      shippingCountryCode: order.country,
      shippingProvince: order.city,
      shippingCity: order.city,
      shippingAddress: order.address,
      shippingZip: order.zip,
    },
  })

  if (result.success) {
    console.log('[cj-order] başarılı, CJ order ID:', result.cjOrderId)
    await prisma.order.update({
      where: { id: order.id },
      data: { cjOrderId: result.cjOrderId, cjStatus: 'created' },
    })
  } else {
    console.error('[cj-order] hata:', result.message)
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
