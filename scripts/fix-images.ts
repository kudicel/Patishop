/**
 * İki türlü bozuk görseli düzeltir:
 * 1. thumbImage '["url"]' gibi JSON-string — parse edip gerçek URL'yi yaz
 * 2. images dizisi '["url"]' gibi tek-eleman JSON-string içeriyorsa düzelt
 * 3. Unsplash/placeholder URL olan CJ ürünleri → CJ detail'dan yeni görseller çek
 */
import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })
import { PrismaNeonHttp } from '@prisma/adapter-neon'

const CJ_BASE = process.env.CJ_API_BASE ?? 'https://developers.cjdropshipping.com/api2.0/v1'
const CJ_KEY  = process.env.CJ_API_KEY ?? ''
let _token = '', _exp = 0

async function getToken() {
  if (_token && Date.now() < _exp) return _token
  const r = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_KEY }),
  })
  const d = await r.json()
  if (!d.result) throw new Error('CJ auth failed')
  _token = d.data.accessToken; _exp = Date.now() + 22 * 3600_000
  return _token
}

async function getDetail(pid: string) {
  const token = await getToken()
  const r = await fetch(`${CJ_BASE}/product/query?pid=${encodeURIComponent(pid)}`, {
    headers: { 'CJ-Access-Token': token },
  })
  const d = await r.json()
  return d.data ?? null
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

function parseImgField(val: unknown): string[] {
  if (!val) return []
  if (typeof val === 'string') {
    const t = val.trim()
    if (t.startsWith('[')) {
      try { return (JSON.parse(t) as string[]).filter((u: string) => u.startsWith('http')) } catch { return [] }
    }
    return t.startsWith('http') ? [t] : []
  }
  if (Array.isArray(val)) return (val as any[]).flatMap(parseImgField)
  return []
}

function extractFromDetail(detail: any): string[] {
  const imgs: string[] = []
  imgs.push(...parseImgField(detail.productImage))
  if (Array.isArray(detail.productImages)) imgs.push(...detail.productImages.flatMap(parseImgField))
  if (Array.isArray(detail.productImageSet)) {
    imgs.push(...detail.productImageSet.flatMap((x: any) => parseImgField(x.imageUrl ?? x)))
  }
  if (Array.isArray(detail.variants)) {
    for (const v of detail.variants) {
      if (v.variantImage) imgs.push(...parseImgField(v.variantImage))
    }
  }
  return [...new Set(imgs)].filter(u => u.startsWith('http')).slice(0, 6)
}

const BAD_HOSTS = ['unsplash.com', 'picsum', 'via.placeholder', 'loremflickr']

function isBadUrl(url: string) {
  return !url || !url.startsWith('http') || BAD_HOSTS.some(h => url.includes(h))
}

async function main() {
  const { PrismaClient } = await import('../src/generated/prisma/client')
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  const prisma  = new (PrismaClient as any)({ adapter })

  const products = await prisma.product.findMany({
    select: { id: true, name: true, thumbImage: true, images: true, cjProductId: true },
  })

  let fixed = 0, skipped = 0, noFix = 0

  for (const p of products) {
    const rawThumb: string = p.thumbImage ?? ''
    const rawImages: string[] = p.images ?? []

    // --- Step 1: Fix JSON-encoded thumbImage ---
    const parsedThumb = parseImgField(rawThumb)
    // Fix images array items that are themselves JSON-encoded
    const parsedImages = rawImages.flatMap(parseImgField)

    const thumbIsBad = isBadUrl(rawThumb) || rawThumb.startsWith('[')
    const imagesNeedFix = rawImages.some(img => img.startsWith('[') || isBadUrl(img))

    // If thumb is JSON-encoded but parseable → fix without CJ call
    if (rawThumb.startsWith('[') && parsedThumb.length > 0) {
      const newThumb = parsedThumb[0]
      const newImages = [...new Set([...parsedThumb, ...parsedImages])].filter(u => !isBadUrl(u)).slice(0, 6)
      await prisma.product.update({
        where: { id: p.id },
        data: { thumbImage: newThumb, images: newImages },
      })
      console.log(`✅ JSON düzeltildi: ${p.name}`)
      console.log(`   ${rawThumb.slice(0, 60)} → ${newThumb.slice(0, 60)}`)
      fixed++
      continue
    }

    // --- Step 2: Fix Unsplash/bad URLs by fetching CJ detail ---
    if (thumbIsBad || imagesNeedFix) {
      if (!p.cjProductId) {
        console.log(`⚠ CJ ID yok, atlandı: ${p.name}`)
        noFix++
        continue
      }
      try {
        await sleep(600)
        const detail = await getDetail(p.cjProductId)
        if (!detail) { noFix++; continue }

        const newImages = extractFromDetail(detail)
        if (!newImages.length) { noFix++; continue }

        await prisma.product.update({
          where: { id: p.id },
          data: { thumbImage: newImages[0], images: newImages },
        })
        console.log(`✅ CJ görsel güncellendi: ${p.name}`)
        console.log(`   eski: ${rawThumb.slice(0, 60)}`)
        console.log(`   yeni: ${newImages[0].slice(0, 60)} (${newImages.length} görsel)`)
        fixed++
      } catch (e) {
        console.log(`❌ Hata: ${p.name} — ${e}`)
        skipped++
      }
      continue
    }

    skipped++
  }

  console.log(`\n✔ ${fixed} ürün güncellendi, ${skipped} atlandı (zaten iyi), ${noFix} düzeltilemedi (CJ ID yok veya veri yok)`)
}

main().catch(e => { console.error(e); process.exit(1) })
