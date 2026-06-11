import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { searchCJProducts } from '@/lib/cj'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) return false
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user?.role === 'admin'
}

export async function GET(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })

  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (!q) return NextResponse.json([])

  try {
    const products = await searchCJProducts(q)
    return NextResponse.json(products)
  } catch (e) {
    console.error('[cj-search]', e)
    return NextResponse.json({ error: 'CJ API hatası' }, { status: 500 })
  }
}
