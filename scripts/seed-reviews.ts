import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })

import { PrismaNeonHttp } from '@prisma/adapter-neon'

const REVIEWS = [
  {
    category: 'oyuncak',
    name: 'Ayse Kaya',
    rating: 5,
    comment: "Kedim bu oyuncaga bayildi, durmadan oynuyor. Kargom Cin'den gelecek diye 3-4 hafta beklemeye hazirdim ama 11 gunde kapima geldi! PatiShop'un lojistigi gercekten cok iyi organize edilmis. Paketleme de super saglamdi, hicbir hasar yoktu. Kesinlikle tekrar siparis verecegim.",
  },
  {
    category: 'tasma',
    name: 'Mehmet Yilmaz',
    rating: 5,
    comment: "Kopegim icin gogus tasmasi aldim, kalitesi beni cok sasirtti. Fiyatina gore cok premium duruyor. En cok sasirdigim sey teslimat hiziydi — 9 gunde geldi, tahminim 3 haftaydi. Tesekkurler PatiShop!",
  },
  {
    category: 'yatak',
    name: 'Fatma Celik',
    rating: 5,
    comment: "Kedim icin ortopedik yatak aldim. Geldigi gunden beri yataktan kalkmıyor. Urun kalitesi fotograftaki gibi, hatta daha iyi. Kargo konusunda gercekten etkilendim — 10 gun gibi kisa surede teslim aldim. Lojistikleri cok iyi calisiyor.",
  },
  {
    category: 'mama-kabi',
    name: 'Ali Demir',
    rating: 5,
    comment: "Otomatik mama kabi tam istedigim gibi calisiyor. Uygulama uzerinden zamanlama ayarladim, kedim artik beni sabah erken uyandirmiyor! Teslimat bekledigimden tam 5 gun once geldi. PatiShop'a guvenilirlik acisindan tam puan.",
  },
  {
    category: 'kiyafet',
    name: 'Zeynep Arslan',
    rating: 5,
    comment: "Kopegim icin kiyafet aldim, hem annesi hem de o cok sevdi. Kumas kalitesi harika, dikisler saglam. Siparis verdikten 12 gun sonra elime gecti. Cin'den bu hizda gelmesini beklemiyordum, cok memnunum!",
  },
  {
    category: 'kum-temizleyici',
    name: 'Mustafa Sahin',
    rating: 5,
    comment: "Kapali kedi tuvaleti aldim, eve gelen misafirler artik kokudan sikayet etmiyor. Montaji 10 dakika surdu, cok pratik. Kargo sureci cok seffaf ve hizliydi — takip numarasiyla her asamayi izledim, 13 gunde geldi. Lojistigi gercekten guclu bir firma.",
  },
  {
    category: 'tasima-cantasi',
    name: 'Elif Koc',
    rating: 5,
    comment: "Kedimi veterinere gotürmek icin tasima cantasi aldim. Hem sik hem de cok dayanikli. Kedim icinde rahat rahat oturuyor, havalandirma delikleri de yeterli. 11 gunde teslim aldim, kargonun bu kadar hizli olacagini hic dusunmemistim. Tesekkurler!",
  },
  {
    category: 'diger-aksesuar',
    name: 'Hasan Ozturk',
    rating: 5,
    comment: "Timarfiircasi seti aldim, kopegim tuy dokuyorve bu fircagercekten ise yarıyor. 3 parcali set eksiksiz geldi, hepsi kaliteli. Teslimat suresi beklentimin cok altinda kaldi — 10 gun icinde elime gecti. PatiShop'u herkese tavsiye ederim.",
  },
  {
    category: 'oyuncak',
    name: 'Selin Aydin',
    rating: 5,
    comment: "Lazerli oyuncak aldim, kedim delirir gibi oynuyor. Pil omru de cok iyi, 2 haftadir her gun kullaniyoruz bitmedi. Siparisi Cin'den gelecek diye endise etmistim ama 9 gunde kapida. PatiShop'un kargo altyapisi gercekten fark yaratiyor.",
  },
  {
    category: 'yatak',
    name: 'Burak Yildiz',
    rating: 5,
    comment: "Kopegim icin buyuk boy yatak aldim. Fotograftaki kadar guzel, belki daha da iyi. Kopegim ilk gunden benimsedi. En etkileyici olan teslimat hiziydi — siparis tarihinden itibaren 12. gunde geldi. Bu tur urunlerde 3-4 hafta beklemeye hazirdim, surpriz oldu.",
  },
  {
    category: 'tasma',
    name: 'Gulcan Erdogan',
    rating: 5,
    comment: "Iki kedi icin ayri ayri tasma seti aldim, ikisi de cok kaliteli cikti. Tokalari saglam, kumasi yumusak. Kargo konusunda da cok memnun kaldim — bekledigimden 1 hafta once geldi. PatiShop'a guvenereek siparis veriyorum artik.",
  },
  {
    category: 'mama-kabi',
    name: 'Emre Cetin',
    rating: 5,
    comment: "Su cesmesi + mama kabi seti aldim. Kedim artik surekli su iciyor, eskiden zorla icirirdim. Urun cok sessiz calisiyor. Kargonun durumunu her gun takip ettim, tam 11 gunde geldi. Lojistik surec cok profesyonel yonetilmis.",
  },
  {
    category: 'kiyafet',
    name: 'Pinar Dogan',
    rating: 5,
    comment: "Kucuk kopegim icin kislik mont aldim, tam kalibina oturdu. Fotografta gordugun renkler gercekte de ayni, soluk degil. Siparis verdigimde 15-20 is gunu yaziyordu ama 10 gunde geldi! PatiShop gercekten soz verdiklerinden fazlasini yapiyor.",
  },
  {
    category: 'diger-aksesuar',
    name: 'Serkan Kilic',
    rating: 5,
    comment: "Tirnak makasi seti aldim, 3 farkli boyut var hepsi ise yariyor. Kedimi eskiden tirnakciya gotururdum, artik evde hallediyorum. Kargo surecinden cok memnun kaldim — takip numarasiyla anlik izledim, 13 gunde teslim aldim. Tesekkurler PatiShop!",
  },
  {
    category: 'tasima-cantasi',
    name: 'Nilufer Ozkan',
    rating: 5,
    comment: "Uzun yolculuklar icin kedi sirt cantasi aldim, uzay kapsulu modeli. Kedim icinde rahat, seffaf pencereden disarıyı izliyor. Urun kalitesi mukemmel. En onemlisi kargo — Cin'den bu kadar hizli gelecegini dusunmemistim, 11 gunde geldi. PatiShop farkini burada da gosteriyor.",
  },
]

async function main() {
  const { PrismaClient } = await import('../src/generated/prisma/client')
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  const prisma  = new (PrismaClient as any)({ adapter })

  // Her kategori için ürün id'lerini çek
  const allProducts = await prisma.product.findMany({
    select: { id: true, category: true },
    where: { active: true },
  })
  const categoryProducts: Record<string, string[]> = {}
  for (const p of allProducts) {
    if (!categoryProducts[p.category]) categoryProducts[p.category] = []
    categoryProducts[p.category].push(p.id)
  }

  let added = 0
  for (let i = 0; i < REVIEWS.length; i++) {
    const rev = REVIEWS[i]
    const ids = categoryProducts[rev.category]
    if (!ids?.length) { console.log(`Kategori bulunamadi: ${rev.category}`); continue }

    const productId = ids[i % ids.length]
    const daysAgo = 3 + (i * 3)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    await prisma.review.create({
      data: {
        productId,
        name:      rev.name,
        rating:    rev.rating,
        comment:   rev.comment,
        approved:  true,
        createdAt: date,
      },
    })

    console.log(`+ ${rev.name.padEnd(20)} -> ${rev.category}`)
    added++
  }

  console.log(`\n${added} yorum eklendi`)

  // Ürün rating'lerini güncelle
  const reviews = await prisma.review.findMany({ where: { approved: true } })
  const byProduct: Record<string, number[]> = {}
  for (const r of reviews) {
    if (!byProduct[r.productId]) byProduct[r.productId] = []
    byProduct[r.productId].push(r.rating)
  }
  for (const [productId, ratings] of Object.entries(byProduct)) {
    const avg   = (ratings as number[]).reduce((s, r) => s + r, 0) / ratings.length
    const count = ratings.length
    await prisma.product.update({
      where: { id: productId },
      data: { rating: Math.round(avg * 10) / 10, reviewCount: count },
    })
  }

  console.log('Rating guncellemeleri tamamlandi!')
}

main().catch(e => { console.error(e); process.exit(1) })
