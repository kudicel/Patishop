import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })
import { PrismaNeonHttp } from '@prisma/adapter-neon'

async function main() {
  const { PrismaClient } = await import('../src/generated/prisma/client')
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  const prisma = new (PrismaClient as any)({ adapter })

  const products = await prisma.product.findMany({
    select: { id: true, name: true, thumbImage: true, images: true },
  })

  let noThumb = 0
  let badThumb = 0
  let goodThumb = 0
  const BAD_HOSTS = ['patishop', 'placeholder', 'unsplash', 'picsum', 'via.placeholder']
  const samples: any[] = []

  for (const p of products) {
    const thumb: string = p.thumbImage ?? ''
    if (!thumb) {
      noThumb++
      if (samples.length < 5) samples.push({ name: p.name, issue: 'NO THUMB', thumb })
    } else if (BAD_HOSTS.some(h => thumb.includes(h)) || !thumb.startsWith('http')) {
      badThumb++
      if (samples.length < 10) samples.push({ name: p.name, issue: 'BAD URL', thumb })
    } else {
      goodThumb++
    }
  }

  console.log(`Toplam: ${products.length}`)
  console.log(`Thumb yok: ${noThumb}`)
  console.log(`Kötü URL: ${badThumb}`)
  console.log(`İyi URL: ${goodThumb}`)

  console.log('\nÖrnek sorunlu ürünler:')
  for (const s of samples) {
    console.log(`  [${s.issue}] ${s.name}`)
    console.log(`    ${s.thumb}`)
  }

  // İlk 5 ürünün tüm verilerini göster
  console.log('\nİlk 5 ürün detay:')
  for (const p of products.slice(0, 5)) {
    console.log(`\n  ${p.name}`)
    console.log(`  thumb: ${p.thumbImage}`)
    console.log(`  images: ${JSON.stringify(p.images?.slice(0, 2))}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
