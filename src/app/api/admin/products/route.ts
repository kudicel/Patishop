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
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 401 })
  const rows = await prisma.product.findMany()
  return NextResponse.json(rows)
}

export async function PATCH(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 401 })
  const { id, stock } = await req.json() as { id: string; stock: number }
  if (!id || typeof stock !== 'number' || stock < 0) {
    return NextResponse.json({ error: 'Geçersiz veri.' }, { status: 400 })
  }
  const row = await prisma.product.upsert({
    where: { id },
    update: { stock },
    create: { id, stock },
  })
  return NextResponse.json(row)
}
