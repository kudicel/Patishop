import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { code, subtotalTRY } = await req.json() as { code: string; subtotalTRY: number }

  if (!code?.trim()) {
    return NextResponse.json({ error: 'Kupon kodu gerekli.' }, { status: 400 })
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  })

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş kupon.' }, { status: 404 })
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Bu kuponun süresi dolmuş.' }, { status: 400 })
  }

  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: 'Bu kupon kullanım limitine ulaşmış.' }, { status: 400 })
  }

  if (subtotalTRY < coupon.minOrderTRY) {
    return NextResponse.json({
      error: `Bu kupon için minimum sipariş tutarı ${coupon.minOrderTRY.toLocaleString('tr-TR')}₺.`,
    }, { status: 400 })
  }

  const discount = coupon.type === 'percent'
    ? Math.round(subtotalTRY * coupon.value / 100)
    : Math.min(coupon.value, subtotalTRY)

  return NextResponse.json({
    code:     coupon.code,
    type:     coupon.type,
    value:    coupon.value,
    discount,
  })
}
