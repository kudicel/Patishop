import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PRODUCTS } from '@/lib/products'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) return false
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user?.role === 'admin'
}

export async function POST() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })

  const results = []
  for (const p of PRODUCTS) {
    const row = await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name:          p.name,
        category:      p.category,
        categoryLabel: p.categoryLabel,
        price:         p.price,
        rating:        p.rating,
        reviewCount:   p.reviewCount,
        badge:         p.badge ?? null,
        images:        p.images,
        thumbImage:    p.thumbImage,
        shortDesc:     p.shortDesc,
        description:   p.description,
        features:      p.features,
        colors:        p.colors ?? [],
        sizes:         p.sizes ?? [],
        supplier:      p.supplier,
        supplierNote:  p.supplierNote,
        active:        true,
      },
      create: {
        id:            p.id,
        name:          p.name,
        category:      p.category,
        categoryLabel: p.categoryLabel,
        price:         p.price,
        rating:        p.rating,
        reviewCount:   p.reviewCount,
        badge:         p.badge ?? null,
        images:        p.images,
        thumbImage:    p.thumbImage,
        shortDesc:     p.shortDesc,
        description:   p.description,
        features:      p.features,
        colors:        p.colors ?? [],
        sizes:         p.sizes ?? [],
        supplier:      p.supplier,
        supplierNote:  p.supplierNote,
        active:        true,
      },
    })
    results.push(row.id)
  }

  return NextResponse.json({ seeded: results.length, ids: results })
}
