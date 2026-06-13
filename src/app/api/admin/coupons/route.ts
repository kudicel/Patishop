import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) return false
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user?.role === 'admin'
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(coupons)
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })
  const body = await req.json()
  const coupon = await prisma.coupon.create({
    data: {
      code:        body.code.trim().toUpperCase(),
      type:        body.type,
      value:       Number(body.value),
      minOrderTRY: Number(body.minOrderTRY ?? 0),
      maxUses:     Number(body.maxUses ?? 0),
      active:      body.active ?? true,
      expiresAt:   body.expiresAt ? new Date(body.expiresAt) : null,
    },
  })
  return NextResponse.json(coupon, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })
  const { id } = await req.json()
  await prisma.coupon.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
