import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) return false
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user?.role === 'admin'
}

// PATCH /api/admin/cj/link — { productId, cjProductId, cjVariantId }
export async function PATCH(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })

  const { productId, cjProductId, cjVariantId } = await req.json()
  if (!productId) return NextResponse.json({ error: 'productId gerekli' }, { status: 400 })

  // Product kaydı yoksa oluştur (stok kaydı da tutulur)
  const product = await prisma.product.upsert({
    where: { id: productId },
    update: { cjProductId: cjProductId ?? null, cjVariantId: cjVariantId ?? null },
    create: { id: productId, cjProductId: cjProductId ?? null, cjVariantId: cjVariantId ?? null },
  })

  return NextResponse.json(product)
}
