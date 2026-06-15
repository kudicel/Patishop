/**
 * Formül: (CJ_alisFiyati_USD + kargo_USD) × kur × kar_marji = satış fiyatı
 *
 * Kargo: ~$13/sipariş (Çin→Türkiye)
 * Kur:    38 TRY/USD
 * Kar:    %40 minimum
 *
 * Kategori bazlı tahmini CJ alış aralıkları (USD):
 *   oyuncak        $2–15    → maliyet tabanı: (2+13)*38 = 570₺  → min satış 800₺
 *   tasma          $4–20    → maliyet tabanı: (4+13)*38 = 646₺  → min satış 910₺
 *   yatak          $5–30    → maliyet tabanı: (5+13)*38 = 684₺  → min satış 960₺
 *   mama-kabi      $5–25    → maliyet tabanı: (5+13)*38 = 684₺  → min satış 960₺
 *   kiyafet        $3–15    → maliyet tabanı: (3+13)*38 = 608₺  → min satış 850₺
 *   kum-temizleyici$10–40   → maliyet tabanı: (10+13)*38=874₺  → min satış 1230₺
 *   tasima-cantasi $5–25    → maliyet tabanı: (5+13)*38 = 684₺  → min satış 960₺
 *   diger-aksesuar $2–10    → maliyet tabanı: (2+13)*38 = 570₺  → min satış 800₺
 *
 * Min satış = maliyet tabanı × 1.40 (kar) → yuvarlanmış
 */

import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })

import { PrismaNeonHttp } from '@prisma/adapter-neon'

const USD_TRY  = 38
const KARGO    = 13   // $ / sipariş
const MIN_KAR  = 1.40 // %40 minimum kar

// Kategoriye göre: [tahmini min CJ alış $, tahmini max CJ alış $, satış tavanı ₺]
const CATEGORY_RANGES: Record<string, { cjMin: number; cjMax: number; sellMax: number }> = {
  'oyuncak':         { cjMin: 2,  cjMax: 15, sellMax: 900  },
  'tasma':           { cjMin: 4,  cjMax: 20, sellMax: 1200 },
  'yatak':           { cjMin: 5,  cjMax: 30, sellMax: 1500 },
  'mama-kabi':       { cjMin: 5,  cjMax: 25, sellMax: 1500 },
  'kiyafet':         { cjMin: 3,  cjMax: 15, sellMax: 900  },
  'kum-temizleyici': { cjMin: 10, cjMax: 40, sellMax: 2000 },
  'tasima-cantasi':  { cjMin: 5,  cjMax: 25, sellMax: 1400 },
  'diger-aksesuar':  { cjMin: 2,  cjMax: 10, sellMax: 700  },
}

function calcMin(cjMin: number): number {
  return Math.ceil((cjMin + KARGO) * USD_TRY * MIN_KAR / 10) * 10
}

function calcMax(cjMax: number, sellMax: number): number {
  const costBased = Math.ceil((cjMax + KARGO) * USD_TRY * MIN_KAR / 10) * 10
  return Math.min(costBased, sellMax)
}

function seededRandom(seed: string): number {
  let h = 5381
  for (const c of seed) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0
  return (h % 1000) / 1000
}

async function main() {
  const { PrismaClient } = await import('../src/generated/prisma/client')
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  const prisma  = new (PrismaClient as any)({ adapter })

  const products = await prisma.product.findMany({
    select: { id: true, price: true, category: true, name: true },
  })

  let fixed = 0
  for (const p of products) {
    const range = CATEGORY_RANGES[p.category]
    if (!range) continue

    const sellMin = calcMin(range.cjMin)
    const sellMax = calcMax(range.cjMax, range.sellMax)

    if (p.price >= sellMin && p.price <= sellMax) continue // zaten doğru aralıkta

    const r   = seededRandom(p.id + '_v2')
    const raw = sellMin + r * (sellMax - sellMin)
    const newPrice = Math.round(raw / 10) * 10

    await prisma.product.update({ where: { id: p.id }, data: { price: newPrice } })
    console.log(`  ${p.price < sellMin ? '⬆' : '⬇'} ${p.name.slice(0, 35).padEnd(35)} ${p.price}₺ → ${newPrice}₺  [min:${sellMin} max:${sellMax}]`)
    fixed++
  }

  console.log(`\n✔ ${fixed} ürün fiyatı güncellendi`)

  console.log('\n📊 Kategori bazlı fiyat aralıkları:')
  for (const [cat, r] of Object.entries(CATEGORY_RANGES)) {
    const min = calcMin(r.cjMin)
    const max = calcMax(r.cjMax, r.sellMax)
    console.log(`  ${cat.padEnd(20)} satış aralığı: ${min}₺ – ${max}₺`)
  }

  console.log('\n📊 DB\'deki gerçek dağılım:')
  const stats = await prisma.product.groupBy({
    by: ['category'],
    _min: { price: true },
    _max: { price: true },
    _avg: { price: true },
  })
  for (const s of stats) {
    console.log(`  ${s.category.padEnd(20)} min:${s._min.price}₺  max:${s._max.price}₺  ort:${Math.round(s._avg.price)}₺`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
