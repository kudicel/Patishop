import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })

import { PrismaNeonHttp } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'
import { PRODUCTS } from '../src/lib/products'

async function main() {
  const { PrismaClient } = await import('../src/generated/prisma/client')
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prisma  = new (PrismaClient as any)({ adapter })

  const hashed = await bcrypt.hash('Admin123!', 12)

  const admin = await prisma.user.upsert({
    where:  { email: 'admin@patishop.com' },
    update: { role: 'admin', password: hashed, name: 'PatiShop Admin' },
    create: { email: 'admin@patishop.com', name: 'PatiShop Admin', password: hashed, role: 'admin' },
  })
  console.log('✅ Admin hazır:', admin.email)

  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name, category: p.category, categoryLabel: p.categoryLabel,
        price: p.price, rating: p.rating, reviewCount: p.reviewCount,
        badge: p.badge ?? null, images: p.images, thumbImage: p.thumbImage,
        shortDesc: p.shortDesc, description: p.description, features: p.features,
        colors: p.colors ?? [], sizes: p.sizes ?? [],
        supplier: p.supplier, supplierNote: p.supplierNote, active: true,
      },
      create: {
        id: p.id, stock: 50,
        name: p.name, category: p.category, categoryLabel: p.categoryLabel,
        price: p.price, rating: p.rating, reviewCount: p.reviewCount,
        badge: p.badge ?? null, images: p.images, thumbImage: p.thumbImage,
        shortDesc: p.shortDesc, description: p.description, features: p.features,
        colors: p.colors ?? [], sizes: p.sizes ?? [],
        supplier: p.supplier, supplierNote: p.supplierNote, active: true,
      },
    })
    console.log('  📦', p.id)
  }
  console.log(`✅ ${PRODUCTS.length} ürün DB'ye yazıldı`)
}

main().catch(e => { console.error(e); process.exit(1) })
