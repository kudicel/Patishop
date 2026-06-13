import { prisma } from './prisma'
import { Product, Category } from '@/types'

function rowToProduct(row: Awaited<ReturnType<typeof prisma.product.findFirst>>): Product | null {
  if (!row || !row.name) return null
  return {
    id:            row.id,
    stock:         row.stock,
    name:          row.name,
    category:      row.category as Category,
    categoryLabel: row.categoryLabel,
    price:         row.price,
    rating:        row.rating,
    reviewCount:   row.reviewCount,
    badge:         row.badge ?? undefined,
    images:        row.images,
    thumbImage:    row.thumbImage,
    shortDesc:     row.shortDesc,
    description:   row.description,
    features:      row.features,
    colors:        row.colors.length ? row.colors : undefined,
    sizes:         row.sizes.length ? row.sizes : undefined,
    supplier:      row.supplier,
    supplierNote:  row.supplierNote,
  }
}

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, NOT: { name: '' } },
    orderBy: { id: 'asc' },
  })
  return rows.map(rowToProduct).filter((p): p is Product => p !== null)
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { id } })
  return rowToProduct(row)
}
