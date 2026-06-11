import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createCJOrder } from '@/lib/cj'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) return false
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user?.role === 'admin'
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })

  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })
  if (!order) return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 })
  if (order.cjOrderId) return NextResponse.json({ error: 'Bu sipariş zaten CJ\'ye iletildi.' }, { status: 400 })

  const productIds = order.items.map(i => i.productId)
  const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } } })

  const cjItems = order.items
    .map(i => {
      const db = dbProducts.find(p => p.id === i.productId)
      if (!db?.cjVariantId) return null
      return { vid: db.cjVariantId, quantity: i.quantity }
    })
    .filter((x): x is { vid: string; quantity: number } => x !== null)

  if (cjItems.length === 0) {
    return NextResponse.json({ error: 'Bu siparişte CJ variant ID bağlı ürün yok.' }, { status: 400 })
  }

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

  if (!result.success) {
    return NextResponse.json({ error: result.message ?? 'CJ sipariş oluşturulamadı.' }, { status: 502 })
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { cjOrderId: result.cjOrderId, cjStatus: 'created' },
  })

  return NextResponse.json({ cjOrderId: updated.cjOrderId, cjStatus: updated.cjStatus })
}
