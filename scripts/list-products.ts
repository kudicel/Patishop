import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })
import { PrismaNeonHttp } from '@prisma/adapter-neon'

async function main() {
  const { PrismaClient } = await import('../src/generated/prisma/client')
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  const prisma  = new (PrismaClient as any)({ adapter })

  const products = await prisma.product.findMany({
    select: { id: true, name: true, category: true, thumbImage: true },
    orderBy: { category: 'asc' },
  })

  for (const p of products) {
    console.log(`${p.category.padEnd(20)} ${p.id}  ${p.name}`)
  }
  console.log(`\nToplam: ${products.length}`)
}

main().catch(e => { console.error(e); process.exit(1) })
