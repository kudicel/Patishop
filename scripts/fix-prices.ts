import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })

import { PrismaNeonHttp } from '@prisma/adapter-neon'

const CAPS: Record<string, { min: number; max: number }> = {
  'oyuncak':        { min: 150,  max: 900  },
  'tasma':          { min: 290,  max: 1200 },
  'yatak':          { min: 390,  max: 1500 },
  'mama-kabi':      { min: 390,  max: 1500 },
  'kiyafet':        { min: 190,  max: 900  },
  'kum-temizleyici':{ min: 590,  max: 2000 },
  'tasima-cantasi': { min: 490,  max: 1400 },
  'diger-aksesuar': { min: 140,  max: 700  },
}

function seededRandom(seed: string): number {
  let h = 5381
  for (const c of seed) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0
  return (h % 1000) / 1000
}

async function main() {
  const { PrismaClient } = await import('../src/generated/prisma/client')
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  const prisma = new (PrismaClient as any)({ adapter })

  const products = await prisma.product.findMany({ select: { id: true, price: true, category: true } })

  let fixed = 0
  for (const p of products) {
    const cap = CAPS[p.category]
    if (!cap || p.price <= cap.max) continue

    const r = seededRandom(p.id)
    const newPrice = Math.round((cap.min + r * (cap.max - cap.min)) / 10) * 10

    await prisma.product.update({ where: { id: p.id }, data: { price: newPrice } })
    console.log(`  ✅ ${p.id}: ${p.price}₺ → ${newPrice}₺`)
    fixed++
  }

  console.log(`\n✔ ${fixed} ürün fiyatı düzeltildi`)

  const cats = await prisma.product.groupBy({
    by: ['category'],
    _min: { price: true },
    _max: { price: true },
    _avg: { price: true },
  })
  console.log('\n📊 Yeni fiyat dağılımı:')
  for (const c of cats) {
    console.log(`  ${c.category.padEnd(20)} min:${c._min.price} max:${c._max.price} ort:${Math.round(c._avg.price)}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
