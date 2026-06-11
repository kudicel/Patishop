import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getCJTrackInfo } from '@/lib/cj'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) return false
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user?.role === 'admin'
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })

  const { id } = await params

  const order = await prisma.order.findUnique({ where: { id }, select: { cjOrderId: true } })
  if (!order?.cjOrderId) return NextResponse.json({ error: 'CJ sipariş ID yok.' }, { status: 404 })

  try {
    const trackInfo = await getCJTrackInfo(order.cjOrderId)
    return NextResponse.json(trackInfo)
  } catch (e) {
    console.error('[cj-track]', e)
    return NextResponse.json({ error: 'CJ takip bilgisi alınamadı.' }, { status: 502 })
  }
}
