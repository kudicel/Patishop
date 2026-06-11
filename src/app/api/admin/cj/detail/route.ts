import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getCJProductDetail } from '@/lib/cj'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) return false
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user?.role === 'admin'
}

export async function GET(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })

  const pid = req.nextUrl.searchParams.get('pid') ?? ''
  if (!pid) return NextResponse.json({ error: 'pid gerekli' }, { status: 400 })

  try {
    const product = await getCJProductDetail(pid)
    return NextResponse.json(product)
  } catch (e) {
    console.error('[cj-detail]', e)
    return NextResponse.json({ error: 'CJ API hatası' }, { status: 500 })
  }
}
