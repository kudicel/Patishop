import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })

const CJ_BASE = process.env.CJ_API_BASE ?? 'https://developers.cjdropshipping.com/api2.0/v1'
const CJ_KEY  = process.env.CJ_API_KEY ?? ''

async function getToken() {
  const r = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_KEY }),
  })
  const d = await r.json()
  if (!d.result) throw new Error('CJ auth failed: ' + JSON.stringify(d))
  return d.data.accessToken as string
}

async function main() {
  const token = await getToken()

  const r = await fetch(`${CJ_BASE}/product/getCategory`, {
    headers: { 'CJ-Access-Token': token },
  })
  const d = await r.json()
  const cats: any[] = Array.isArray(d.data) ? d.data : []

  console.log(`Toplam ${cats.length} üst kategori\n`)

  for (const first of cats) {
    const firstName: string = first.categoryFirstName ?? ''
    console.log(`=== ${firstName}`)

    for (const second of (first.categoryFirstList ?? [])) {
      const secName: string = second.categorySecondName ?? ''
      const isPet = /pet|animal|cat|dog|kitten|puppy/i.test(secName)
      const marker = isPet ? ' <<<' : ''
      console.log(`  ${secName}${marker}`)

      for (const leaf of (second.categorySecondList ?? [])) {
        const leafName: string = leaf.categoryName ?? ''
        const isLeafPet = /pet|animal|cat|dog|kitten|puppy/i.test(leafName)
        const leafMarker = isLeafPet ? ' <<<' : ''
        console.log(`    [${leaf.categoryId}] ${leafName}${leafMarker}`)
      }
    }
  }
}

main().catch(e => { console.error(e); process.exit(1) })
