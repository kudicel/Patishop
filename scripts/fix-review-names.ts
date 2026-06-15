import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })
import { PrismaNeonHttp } from '@prisma/adapter-neon'

const FIXES: [string, string][] = [
  ['Ayse Kaya',      'Ayşe Kaya'],
  ['Mehmet Yilmaz',  'Mehmet Yılmaz'],
  ['Fatma Celik',    'Fatma Çelik'],
  ['Mustafa Sahin',  'Mustafa Şahin'],
  ['Elif Koc',       'Elif Koç'],
  ['Hasan Ozturk',   'Hasan Öztürk'],
  ['Selin Aydin',    'Selin Aydın'],
  ['Burak Yildiz',   'Burak Yıldız'],
  ['Gulcan Erdogan', 'Gülcan Erdoğan'],
  ['Emre Cetin',     'Emre Çetin'],
  ['Pinar Dogan',    'Pınar Doğan'],
  ['Serkan Kilic',   'Serkan Kılıç'],
  ['Nilufer Ozkan',  'Nilüfer Özkan'],
]

async function main() {
  const { PrismaClient } = await import('../src/generated/prisma/client')
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  const prisma  = new (PrismaClient as any)({ adapter })

  const reviews = await prisma.review.findMany({ select: { id: true, name: true } })
  for (const rev of reviews) {
    const fix = FIXES.find(([from]) => from === rev.name)
    if (!fix) continue
    await prisma.review.update({ where: { id: rev.id }, data: { name: fix[1] } })
    console.log(`✔ ${fix[0]} → ${fix[1]}`)
  }
  console.log('Tamamlandi!')
}

main().catch(e => { console.error(e); process.exit(1) })
