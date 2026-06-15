import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCJProductDetail } from '@/lib/cj'

// Vercel Pro: 300s, Hobby: 60s
export const maxDuration = 300

const DELAY_MS   = 500
const BATCH_SIZE = parseInt(process.env.STOCK_SYNC_BATCH ?? '80')

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const all = await prisma.product.findMany({
    where:  { cjProductId: { not: null } },
    select: { id: true, cjProductId: true, stock: true },
  })

  // Karıştır, batch_size kadar al — büyük katalogda her gün farklı ürünler
  const shuffled = all.sort(() => Math.random() - 0.5).slice(0, BATCH_SIZE)

  const stats = { updated: 0, outOfStock: 0, unchanged: 0, errors: 0 }
  const outOfStockNames: string[] = []

  for (const product of shuffled) {
    try {
      const detail = await getCJProductDetail(product.cjProductId!)
      await sleep(DELAY_MS)

      if (!detail) { stats.errors++; continue }

      const raw = detail as Record<string, unknown>

      // CJ API: productInventory (toplam) veya variants içindeki variantStock toplamı
      let newStock: number | null = null
      if (typeof raw.productInventory === 'number') {
        newStock = raw.productInventory
      } else if (Array.isArray(raw.variants)) {
        newStock = (raw.variants as Record<string, unknown>[]).reduce(
          (s, v) => s + (Number(v.variantStock ?? v.inventory ?? 0)),
          0,
        )
      }

      if (newStock === null) { stats.errors++; continue }

      const stock = Math.min(Math.max(0, Math.round(newStock)), 999)

      if (stock === product.stock) { stats.unchanged++; continue }

      await prisma.product.update({ where: { id: product.id }, data: { stock } })

      if (stock === 0) {
        stats.outOfStock++
        outOfStockNames.push(product.id)
      } else {
        stats.updated++
      }
    } catch {
      stats.errors++
    }
  }

  return NextResponse.json({
    ok:        true,
    synced:    shuffled.length,
    total:     all.length,
    ...stats,
    outOfStock: outOfStockNames,
    timestamp:  new Date().toISOString(),
  })
}
