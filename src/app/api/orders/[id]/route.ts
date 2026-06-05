import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ORDER_STATUSES } from '@/lib/orderStatus'

const VALID_STATUSES = ORDER_STATUSES.map(s => s.value)

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })
  if (!order) return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Yetkisiz.' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (user?.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })
  }

  const { id } = await params
  const { status } = await req.json() as { status: string }

  if (!VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return NextResponse.json({ error: 'Geçersiz durum.' }, { status: 400 })
  }

  const order = await prisma.order.update({
    where: { id },
    data:  { status },
  })

  return NextResponse.json(order)
}
