import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) return false
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user?.role === 'admin'
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })
  const { id } = await params
  const body = await req.json()
  const supplier = await prisma.supplier.update({
    where: { id },
    data: {
      name:       body.name,
      email:      body.email,
      phone:      body.phone || null,
      country:    body.country,
      productIds: body.productIds,
      active:     body.active,
      notes:      body.notes || null,
    },
  })
  return NextResponse.json(supplier)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })
  const { id } = await params
  await prisma.supplier.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
