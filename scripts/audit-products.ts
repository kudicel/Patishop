/**
 * CJ'deki gerçek ürün adına bakarak pet ürünü olmayan ürünleri tespit eder.
 * --delete flag'iyle silebilir.
 */
import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })
import { PrismaNeonHttp } from '@prisma/adapter-neon'

const CJ_BASE = process.env.CJ_API_BASE ?? 'https://developers.cjdropshipping.com/api2.0/v1'
const CJ_KEY  = process.env.CJ_API_KEY ?? ''
const DELETE  = process.argv.includes('--delete')
const DELAY   = 600

let _token = '', _exp = 0
async function getToken() {
  if (_token && Date.now() < _exp) return _token
  const r = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_KEY }),
  })
  const d = await r.json()
  if (!d.result) throw new Error('CJ auth failed')
  _token = d.data.accessToken
  _exp   = Date.now() + 22 * 3600_000
  return _token
}

async function getDetail(pid: string) {
  const token = await getToken()
  const url = `${CJ_BASE}/product/query?pid=${encodeURIComponent(pid)}`
  const r = await fetch(url, { headers: { 'CJ-Access-Token': token } })
  const d = await r.json()
  return d.data ?? null
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

const PET_KEYWORDS = [
  'cat', 'dog', 'pet', 'kitten', 'puppy', 'feline', 'canine',
  'harness', 'leash', 'collar', 'litter', 'feeder', 'fountain',
  'carrier', 'crate', 'kennel', 'scratching', 'catnip', 'paw',
  'fur', 'grooming', 'comb', 'brush', 'nail clip', 'toy ball',
  'tunnel', 'bed house', 'pet bed', 'pet toy', 'animal',
]

function isPetProduct(name: string): boolean {
  const lower = name.toLowerCase()
  return PET_KEYWORDS.some(k => lower.includes(k))
}

async function main() {
  const { PrismaClient } = await import('../src/generated/prisma/client')
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  const prisma  = new (PrismaClient as any)({ adapter })

  const products = await prisma.product.findMany({
    where:  { cjProductId: { not: null } },
    select: { id: true, name: true, category: true, cjProductId: true },
  })

  console.log(`Toplam ${products.length} ürün kontrol ediliyor...\n`)

  const bad: { id: string; name: string; cjName: string; category: string }[] = []
  const noCj: { id: string; name: string; category: string; cjProductId: string }[] = []
  let checked = 0

  for (const p of products) {
    await sleep(DELAY)
    try {
      const detail = await getDetail(p.cjProductId)
      if (!detail) {
        noCj.push({ id: p.id, name: p.name, category: p.category, cjProductId: p.cjProductId! })
        console.log(`? [${p.category}] ${p.name} (cjProductId: ${p.cjProductId})`)
        continue
      }

      const cjName: string = detail.productNameEn ?? detail.productName ?? ''
      if (!isPetProduct(cjName)) {
        bad.push({ id: p.id, name: p.name, cjName, category: p.category })
        console.log(`✗ [${p.category}] ${p.name}`)
        console.log(`     CJ: "${cjName}"`)
      }
      checked++
      if (checked % 20 === 0) console.log(`  ... ${checked}/${products.length} kontrol edildi`)
    } catch (e) {
      console.log(`⚠ Hata: ${p.id}`)
    }
  }

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`Toplam yanlış ürün: ${bad.length}`)
  console.log(`CJ'de bulunamayan: ${noCj.length}`)

  if (noCj.length > 0) {
    console.log('\nCJ\'de bulunamayan ürünler:')
    for (const p of noCj) console.log(`  ${p.category.padEnd(20)} ${p.name} (${p.cjProductId})`)
  }

  if (DELETE && bad.length > 0) {
    console.log('\nSiliniyor...')
    for (const p of bad) {
      await prisma.product.delete({ where: { id: p.id } })
      console.log(`  🗑 ${p.name}`)
    }
    console.log(`\n✔ ${bad.length} yanlış ürün silindi.`)
  } else if (bad.length > 0) {
    console.log('\nSilmek için: npx tsx scripts/audit-products.ts --delete')
    console.log('\nYanlış ürün listesi:')
    for (const p of bad) console.log(`  ${p.category.padEnd(20)} ${p.name}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
