import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) return false
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user?.role === 'admin'
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  const allowed = [
    'name', 'category', 'categoryLabel', 'price', 'shortDesc', 'description',
    'features', 'badge', 'images', 'thumbImage', 'colors', 'sizes',
    'supplier', 'supplierNote', 'rating', 'reviewCount', 'active',
  ]
  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) data[key] = body[key]
  }

  const product = await prisma.product.upsert({
    where: { id },
    update: data,
    create: { id, ...data },
  })

  return NextResponse.json(product)
}
