/**
 * Klinik KKD (Kişisel Koruyucu Donanım) import
 * Hedef: Muayene Eldiveni, Cerrahi Bone, Tek Kullanımlık Başlık
 *
 * Bunlar bilerek insan/personel kullanımı için ürünler (import-pet-medikal.ts'teki
 * isHumanProduct filtresi kasıtlı olarak burada UYGULANMIYOR) — veteriner klinik
 * personeli için tedarik ediliyor, pet-medikal kategorisine ekleniyor.
 */
import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })
import { PrismaNeonHttp } from '@prisma/adapter-neon'

const CJ_BASE = process.env.CJ_API_BASE ?? 'https://developers.cjdropshipping.com/api2.0/v1'
const CJ_KEY  = process.env.CJ_API_KEY ?? ''
const DRY_RUN = process.argv.includes('--dry-run')
const DELAY   = 800

let _token = '', _exp = 0
async function getToken() {
  if (_token && Date.now() < _exp) return _token
  const r = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_KEY }),
  })
  const d = await r.json()
  if (!d.result) throw new Error(`CJ auth failed: ${d.message}`)
  _token = d.data.accessToken; _exp = Date.now() + 22 * 3600_000
  return _token
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

async function cjGet(path: string, params: Record<string, string | number> = {}) {
  const token = await getToken()
  const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
  const r = await fetch(`${CJ_BASE}${path}${qs ? '?' + qs : ''}`, {
    headers: { 'CJ-Access-Token': token },
  })
  const d = await r.json()
  if (!d.result && /daily request limit/i.test(d.message ?? ''))
    throw new Error(`CJ günlük istek limiti doldu`)
  return d
}

async function searchByKeyword(kw: string, page: number, size = 50) {
  const d = await cjGet('/product/list', { productNameEn: kw, pageNum: page, pageSize: size })
  return (d.data?.list ?? []) as any[]
}

async function getDetail(pid: string, attempt = 1): Promise<any | null> {
  const d = await cjGet('/product/query', { pid })
  if (d.data) return d.data
  if (!d.result && attempt < 3) { await sleep(1500 * attempt); return getDetail(pid, attempt + 1) }
  return null
}

// ─── Alakasız/istenmeyen ürünleri eleyen negatif filtre ─────────────────────
// (Genel insan giyim/kozmetik ürünü — eldiven/bone aramasında bazen karışabiliyor)
const NEGATIVE_KEYWORDS = [
  'fashion glove', 'winter glove', 'ski glove', 'driving glove', 'motorcycle glove',
  'gardening glove', 'cleaning glove', 'oven glove', 'bbq glove', 'welding glove',
  'boxing glove', 'baseball glove', 'golf glove', 'touch screen glove',
  'goalkeeper', 'soccer', 'football glove', 'mechanic', 'household glove',
  'hand massager', 'massage glove', 'strawberry', 'cute style glove',
  'shower cap', 'swim cap', 'party hat', 'baby hat', 'sun hat', 'beanie',
  'wig cap', 'chef hat', 'santa hat', 'christmas hat',
  'toner pad', 'facial cotton', 'exfoliat', 'pore-care', 'pore care',
  'makeup', 'skincare', 'skin care', 'kojic', 'carotene', 'cosmetic cotton',
]

function isNegative(name: string): boolean {
  const n = name.toLowerCase()
  return NEGATIVE_KEYWORDS.some((k) => n.includes(k))
}

// ─── RULES: CJ İngilizce ad → Türkçe ürün tipi ──────────────────────────────
interface Rule { re: RegExp; tr: string; tag: string }
const RULES: Rule[] = [
  {
    re: /\bexam(ination)?\s*gloves?\b|\bsurgical\s*gloves?\b|\bmedical\s*gloves?\b|\bdisposable\b.{0,25}\b(nitrile|latex|vinyl|pvc|tpe)\b.{0,15}\bgloves?\b|\b(nitrile|latex|vinyl|pvc|tpe)\b.{0,15}\bgloves?\b.{0,25}\bdisposable\b/i,
    tr: 'Muayene Eldiveni', tag: 'eldiven',
  },
  {
    re: /\bsurgical\s*cap\b|\bbouffant\s*cap\b|\bdisposable\s*(head)?\s*cap\b|\bmedical\s*cap\b|\bsurgeon\s*cap\b|\bhair\s*net\s*cap\b|\bclinic\s*cap\b/i,
    tr: 'Cerrahi Bone', tag: 'cerrahi-bone',
  },
  {
    re: /\bdisposable\s*(head\s*)?cover\b|\bhead\s*covering\b|\bhood\s*cap\b.{0,15}(medical|surgical|disposable)|\bdisposable\s*hood\b/i,
    tr: 'Tek Kullanımlık Başlık', tag: 'baslik',
  },
  {
    re: /\bdisposable\s*(surgical\s*)?gown\b|\bisolation\s*gown\b|\bmedical\s*apron\b|\bdisposable\s*apron\b|\bsurgical\s*apron\b/i,
    tr: 'Tek Kullanımlık Önlük', tag: 'onluk',
  },
  {
    re: /\bshoe\s*covers?\b.{0,15}(disposable|medical|non.?woven)|\bdisposable\s*shoe\s*covers?\b|\bboot\s*covers?\b.{0,15}(disposable|medical)/i,
    tr: 'Tek Kullanımlık Ayakkabı Kılıfı', tag: 'ayakkabi-kilifi',
  },
  {
    re: /\bsurgical\s*face\s*masks?\b|\bdisposable\s*face\s*masks?\b.{0,15}(medical|3.?ply|surgical)|\bmedical\s*face\s*masks?\b/i,
    tr: 'Cerrahi Maske', tag: 'cerrahi-maske',
  },
  {
    re: /\bexam(ination)?\s*table\s*paper\b|\bmedical\s*table\s*paper\s*roll\b|\bdisposable\s*bed\s*sheet\s*roll\b|\bexamination\s*couch\s*roll\b|\bmedical\s*paper\s*roll\b/i,
    tr: 'Sedye/Masa Kaplama Kağıdı', tag: 'sedye-kagidi',
  },
  {
    re: /\bgauze\s*(pads?|sponges?|swabs?|roll)\b|\bmedical\s*gauze\b|\b(medical|first.?aid|wound)\b.{0,20}\bcotton\s*(pads?|balls?|wool)\b|\bcotton\s*(pads?|balls?|wool)\b.{0,20}\b(medical|first.?aid|wound)\b/i,
    tr: 'Gazlı Bez / Pamuk', tag: 'gazli-bez',
  },
]

function matchRule(engName: string): Rule | null {
  for (const rule of RULES) {
    if (rule.re.test(engName)) return rule
  }
  return null
}

const BRAND_TAGS = ['Pro', 'Plus', 'Elite', 'Standart', 'Comfort']

function turkishName(engName: string, brandIdx: number): { name: string; tag: string } | null {
  const rule = matchRule(engName)
  if (!rule) return null
  const extras: string[] = []
  if (/large|xl/i.test(engName)) extras.push('Büyük Boy')
  if (/powder.?free/i.test(engName)) extras.push('Pudrasız')
  if (/blue/i.test(engName)) extras.push('Mavi')
  const extraStr = extras[0] ?? ''
  const brand = BRAND_TAGS[brandIdx % BRAND_TAGS.length]
  const parts = [extraStr, rule.tr, brand].filter(Boolean)
  return { name: parts.join(' '), tag: rule.tag }
}

const CONTENT: Record<string, { short: string; desc: string; features: string[] }> = {
  eldiven: {
    short: 'Klinik ve bakım işlemleri için hijyenik, tek kullanımlık muayene eldiveni.',
    desc: 'Nitril veya lateks yapılı, pudrasız tek kullanımlık eldivenler; muayene, bakım ve hijyen işlemleri sırasında hem hayvanı hem personeli korur. Kutu halinde toplu kullanım için uygundur.',
    features: ['Tek kullanımlık, hijyenik', 'Pudrasız seçenek mevcut', 'Kutuda çoklu adet', 'Nitril/lateks dayanıklı yapı'],
  },
  'cerrahi-bone': {
    short: 'Klinik ortamında saç kontaminasyonunu önleyen tek kullanımlık cerrahi bone.',
    desc: 'Hafif, nefes alabilen dokuma kumaştan üretilen cerrahi bone; muayene ve operasyon sırasında hijyeni artırır. Elastik bant sayesinde tüm baş boyutlarına uyum sağlar.',
    features: ['Tek kullanımlık, hijyenik', 'Elastik bantlı rahat oturum', 'Nefes alabilen dokuma kumaş', 'Kutuda toplu kullanım'],
  },
  baslik: {
    short: 'Klinik hijyeni için tam baş/saç örtücü tek kullanımlık başlık.',
    desc: 'Operasyon ve bakım alanlarında hijyeni desteklemek için tasarlanmış, tam kapatmalı tek kullanımlık başlık. Hafif ve nefes alabilen yapısıyla uzun süreli kullanımda konfor sağlar.',
    features: ['Tek kullanımlık, hijyenik', 'Tam kapatmalı tasarım', 'Hafif nefes alabilen kumaş', 'Kutuda toplu kullanım'],
  },
  onluk: {
    short: 'Klinik işlemleri sırasında kıyafeti koruyan tek kullanımlık önlük.',
    desc: 'Muayene ve bakım işlemleri sırasında sıvı/kirlenmeye karşı koruma sağlayan, hafif dokusuz kumaştan üretilmiş tek kullanımlık önlük. Bel ve boyun bağcıklarıyla kolay giyilir.',
    features: ['Tek kullanımlık, hijyenik', 'Sıvı geçirmez dokusuz kumaş', 'Bağcıklı kolay giyim', 'Kutuda toplu kullanım'],
  },
  'ayakkabi-kilifi': {
    short: 'Klinik zeminini korumak için tek kullanımlık ayakkabı/bot kılıfı.',
    desc: 'Klinik içinde hijyeni korumak ve dış kirin taşınmasını önlemek için tasarlanmış, kaymaz tabanlı tek kullanımlık ayakkabı kılıfı. Elastik bantla hızlı giyilip çıkarılır.',
    features: ['Tek kullanımlık, hijyenik', 'Kaymaz taban dokusu', 'Elastik bant hızlı giyim', 'Kutuda toplu kullanım'],
  },
  'cerrahi-maske': {
    short: 'Klinik ortamı için 3 katlı, nefes alabilen tek kullanımlık cerrahi maske.',
    desc: 'Muayene ve bakım işlemleri sırasında hijyeni destekleyen 3 katlı filtrasyonlu cerrahi maske. Ayarlanabilir burun teli ve elastik kulak bantlarıyla rahat ve güvenli kullanım sağlar.',
    features: ['3 katlı filtrasyon', 'Ayarlanabilir burun teli', 'Elastik kulak bantları', 'Kutuda toplu kullanım'],
  },
  'sedye-kagidi': {
    short: 'Muayene masası/sedye için tek kullanımlık, hijyenik kaplama kağıdı rulosu.',
    desc: 'Her hasta sonrası kolayca yenilenebilen, emici ve yırtılmaya dayanıklı muayene masası kaplama kağıdı. Rulo halinde, kesme çizgili tasarımıyla hızlı değişim sağlar.',
    features: ['Rulo halinde, kesme çizgili', 'Emici ve dayanıklı kağıt', 'Her hasta sonrası hijyen', 'Standart muayene masalarına uyumlu'],
  },
  'gazli-bez': {
    short: 'Yara temizliği ve bakımı için steril/hijyenik gazlı bez ve pamuk.',
    desc: 'Yara temizliği, kanama kontrolü ve genel bakım için kullanılan emici gazlı bez ped ve pamuk toplar. Yumuşak dokusu tahriş etmeden temizlik sağlar.',
    features: ['Emici yumuşak doku', 'Yara bakımı için uygun', 'Kutuda/paket halinde toplu kullanım', 'Tahriş etmeyen yapı'],
  },
}

function getContent(tag: string) {
  return CONTENT[tag] ?? CONTENT['eldiven']
}

function usdToTry(usd: number): number {
  if (!usd || isNaN(usd) || usd <= 0) return 0
  const raw = (usd + 13) * 38 * 1.55
  return Math.max(99, Math.round(raw / 10) * 10)
}

function seed(str: string): number {
  let h = 0
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}
function seededFloat(s: number, min: number, max: number): number {
  return min + ((s % 1000) / 1000) * (max - min)
}
function pickBadge(idx: number, price: number): string | null {
  if (price > 5000) return 'Premium'
  const r = idx % 10
  if (r === 0) return 'Çok Satan'
  if (r === 1) return 'Yeni'
  if (r === 2) return 'İndirim'
  return null
}

function parseImgField(val: unknown): string[] {
  if (!val) return []
  if (typeof val === 'string') {
    const t = val.trim()
    if (t.startsWith('[')) { try { return (JSON.parse(t) as string[]).filter(Boolean) } catch { return [t] } }
    return [t]
  }
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string' && Boolean(v))
  return []
}

function extractImages(detail: any): string[] {
  const imgs: string[] = []
  imgs.push(...parseImgField(detail.productImage))
  if (Array.isArray(detail.productImages)) imgs.push(...detail.productImages.flatMap(parseImgField))
  if (Array.isArray(detail.productImageSet)) {
    imgs.push(...detail.productImageSet.flatMap((x: any) => parseImgField(x.imageUrl ?? x)))
  }
  if (Array.isArray(detail.variants)) {
    for (const v of detail.variants) { if (v.variantImage) imgs.push(...parseImgField(v.variantImage)) }
  }
  return [...new Set(imgs)].filter(u => u.startsWith('http')).slice(0, 6)
}

function slugify(str: string): string {
  return str
    .replace(/İ/g, 'i').replace(/I/g, 'i').replace(/Ğ/g, 'g').replace(/Ü/g, 'u').replace(/Ş/g, 's').replace(/Ö/g, 'o').replace(/Ç/g, 'c')
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
}

const KEYWORDS = [
  'nitrile exam gloves', 'disposable nitrile gloves', 'latex exam gloves',
  'disposable vinyl gloves', 'medical exam gloves box',
  'disposable surgical cap', 'bouffant cap disposable', 'medical bouffant cap',
  'surgeon cap disposable', 'disposable hair net cap',
  'disposable head cover medical', 'disposable hood cap medical',
  'disposable surgical gown', 'isolation gown disposable', 'medical apron disposable',
  'disposable shoe covers medical', 'disposable boot covers',
  'surgical face mask 3ply', 'disposable medical face mask',
  'examination table paper roll', 'medical bed sheet roll disposable', 'examination couch roll',
  'medical gauze pads', 'gauze sponges medical', 'cotton pads medical first aid',
]

const CAT_SLUG  = 'pet-medikal'
const CAT_LABEL = 'Pet Medikal & Güvenlik'
const TARGET    = 40

async function main() {
  if (DRY_RUN) console.log('🔵 DRY-RUN modu — DB\'ye yazılmayacak\n')

  const { PrismaClient } = await import('../src/generated/prisma/client')
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  const prisma = new (PrismaClient as any)({ adapter }) as any

  const existing = await prisma.product.findMany({ select: { cjProductId: true, category: true } })
  const existingCjIds = new Set(existing.map((p: any) => p.cjProductId).filter(Boolean))
  const currentCount = existing.filter((p: any) => p.category === CAT_SLUG).length
  console.log(`📋 Mevcut toplam: ${existing.length} ürün`)
  console.log(`🏥 ${CAT_LABEL}: ${currentCount} ürün`)
  console.log(`🎯 Hedef ek: ${TARGET} ürün (eldiven/bone/başlık)\n`)

  const collected: any[] = []
  const seenPids = new Set<string>()

  for (const kw of KEYWORDS) {
    if (collected.length >= TARGET * 4) break
    for (let page = 1; page <= 5; page++) {
      if (collected.length >= TARGET * 4) break
      let list: any[] = []
      try {
        list = await searchByKeyword(kw, page, 50)
      } catch (err: any) {
        if (/limit/i.test(String(err))) throw err
        console.warn(`  ⚠ arama hatası: ${err}`)
        break
      }
      if (!list.length) break

      let added = 0
      for (const item of list) {
        const pid = item.pid ?? item.productId
        if (!pid || seenPids.has(pid) || existingCjIds.has(pid)) continue
        seenPids.add(pid)
        if (!item.productImage) continue
        const price = parseFloat(item.sellPrice ?? item.variants?.[0]?.variantSellPrice ?? 0)
        if (!price || isNaN(price) || price <= 0 || price > 120) continue
        const engName = item.productNameEn ?? item.productName ?? ''
        if (!matchRule(engName)) {
          if (DRY_RUN) console.log(`    · rules yok: "${engName.slice(0, 70)}"`)
          continue
        }
        if (isNegative(engName)) { console.log(`  🚫 alakasız: "${engName.slice(0, 60)}"`); continue }
        collected.push({ ...item, _price: price })
        added++
      }
      if (added > 0) console.log(`  +${added} "${kw}" (sayfa ${page}) → toplam: ${collected.length}`)
      await sleep(DELAY)
    }
  }

  console.log(`\n📦 Toplam aday: ${collected.length}, import edilecek: ${Math.min(collected.length, TARGET)}\n`)

  let totalImported = 0, totalSkipped = 0

  for (let i = 0; i < collected.length && totalImported < TARGET; i++) {
    const item = collected[i]
    const pid = item.pid ?? item.productId

    let detail: any = item
    if (!DRY_RUN) {
      try {
        const d = await getDetail(pid)
        if (d) detail = d
        await sleep(600)
      } catch (err: any) {
        if (/limit/i.test(String(err))) throw err
      }
    }

    const engName: string = detail.productNameEn ?? detail.productName ?? item.productNameEn ?? item.productName ?? ''

    if (isNegative(engName)) {
      console.log(`  🚫 alakasız: "${engName.slice(0, 70)}"`)
      totalSkipped++; continue
    }

    const images = extractImages(detail)
    if (!images.length) { totalSkipped++; continue }

    const cjPrice = parseFloat(detail.sellPrice ?? item._price ?? 0)
    if (!cjPrice || isNaN(cjPrice) || cjPrice <= 0) { totalSkipped++; continue }
    const tryPrice = usdToTry(cjPrice)
    if (!tryPrice) { totalSkipped++; continue }

    const result = turkishName(engName, totalImported)
    if (!result) {
      console.log(`  ⛔ RULES yok: "${engName.slice(0, 70)}"`)
      totalSkipped++; continue
    }
    const { name: trName, tag } = result
    const content = getContent(tag)

    const s = seed(pid)
    const rating = parseFloat(seededFloat(s, 3.8, 4.95).toFixed(1))
    const reviewCount = Math.round(seededFloat(s >> 4, 30, 800))
    const stock = Math.round(seededFloat(s >> 8, 30, 200))

    const idBase = slugify(trName)
    const id = `${idBase}-${currentCount + totalImported + 1}`

    const cjVariant = detail.variants?.[0]
    const cjVariantId = cjVariant?.vid ?? null

    const colors = detail.variants
      ? [...new Set(detail.variants.map((v: any) => v.variantProperty?.split(' ')[0] ?? '').filter((c: string) => c.length > 0 && c.length < 20))].slice(0, 5) as string[]
      : []
    const sizes = detail.variants
      ? [...new Set(detail.variants.map((v: any) => { const parts = (v.variantProperty ?? '').split(' '); return parts.length > 1 ? parts.slice(1).join(' ') : '' }).filter((s: string) => s.length > 0 && s.length < 15))].slice(0, 5) as string[]
      : []

    const productData = {
      id,
      cjProductId: pid,
      cjVariantId,
      name: trName,
      category: CAT_SLUG,
      categoryLabel: CAT_LABEL,
      price: tryPrice,
      rating,
      reviewCount,
      badge: pickBadge(totalImported, tryPrice),
      images,
      thumbImage: images[0],
      shortDesc: content.short,
      description: content.desc,
      features: content.features,
      colors,
      sizes,
      stock,
      active: true,
      supplier: 'CJ Dropshipping',
      supplierNote: `CJ PID: ${pid}${cjVariantId ? ` | VID: ${cjVariantId}` : ''}`,
    }

    console.log(`  ${DRY_RUN ? '[DRY]' : '→'} ${trName} | ${tryPrice}₺ | ${tag} | "${engName.slice(0, 55)}"`)

    if (!DRY_RUN) {
      try {
        await prisma.product.upsert({ where: { id }, create: productData, update: productData })
        existingCjIds.add(pid)
        totalImported++
      } catch (err: any) {
        if (err?.code === 'P2002') {
          const altId = `${idBase}-${currentCount + totalImported + 1}-b`
          try {
            await prisma.product.upsert({ where: { id: altId }, create: { ...productData, id: altId }, update: { ...productData, id: altId } })
            totalImported++
          } catch (e2) { console.error(`  ❌ ${id}:`, e2); totalSkipped++ }
        } else { console.error(`  ❌ ${id}:`, err); totalSkipped++ }
      }
    } else {
      totalImported++
    }
  }

  console.log(`\n🎉 Tamamlandı! Eklenen: ${totalImported}, Atlanan: ${totalSkipped}`)
  if (!DRY_RUN) {
    const total = await prisma.product.count()
    console.log(`📊 Toplam ürün: ${total}`)
  }

  await prisma.$disconnect()
}

main().catch(e => { console.error('❌ Kritik hata:', e); process.exit(1) })
