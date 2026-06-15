import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })
import { PrismaNeonHttp } from '@prisma/adapter-neon'

async function main() {
  const { PrismaClient } = await import('../src/generated/prisma/client')
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  const prisma  = new (PrismaClient as any)({ adapter })

  // cjProductId olmayan ve Unsplash/placeholder görseli olan demo ürünleri bul
  const products = await prisma.product.findMany({
    where: { cjProductId: null },
    select: { id: true, name: true, thumbImage: true, category: true },
  })

  const BAD_HOSTS = ['unsplash.com', 'picsum', 'placeholder']
  const toDelete = products.filter((p: any) =>
    BAD_HOSTS.some(h => (p.thumbImage ?? '').includes(h))
  )

  console.log(`CJ ID'si olmayan toplam: ${products.length}`)
  console.log(`Silinecek (Unsplash/placeholder): ${toDelete.length}`)
  for (const p of toDelete) {
    console.log(`  🗑 [${p.category}] ${p.name}`)
  }

  for (const p of toDelete) {
    await prisma.product.delete({ where: { id: p.id } })
  }
  console.log('\n✔ Silindi.')

  const total = await prisma.product.count()
  console.log(`DB toplam: ${total}`)
}
main().catch(e => { console.error(e); process.exit(1) })
