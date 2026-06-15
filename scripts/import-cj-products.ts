import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })

import { PrismaNeonHttp } from '@prisma/adapter-neon'

// ─── CJ API ─────────────────────────────────────────────────────────────────
const CJ_BASE = process.env.CJ_API_BASE ?? 'https://developers.cjdropshipping.com/api2.0/v1'
const CJ_KEY = process.env.CJ_API_KEY ?? ''

let _token: string | null = null
let _tokenExp = 0

async function getToken(): Promise<string> {
  if (_token && Date.now() < _tokenExp) return _token
  const r = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_KEY }),
  })
  const d = await r.json()
  if (!d.result) throw new Error(`CJ auth başarısız: ${d.message}`)
  _token = d.data.accessToken
  _tokenExp = Date.now() + 22 * 3600_000
  console.log('✅ CJ token alındı')
  return _token!
}

async function cjGet(path: string, params: Record<string, string> = {}): Promise<any> {
  const token = await getToken()
  const url = new URL(`${CJ_BASE}${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const r = await fetch(url.toString(), { headers: { 'CJ-Access-Token': token } })
  if (!r.ok) throw new Error(`CJ HTTP ${r.status}: ${path}`)
  return r.json()
}

// ─── Pet doğrulama ───────────────────────────────────────────────────────────
const PET_KEYWORDS = [
  'cat', 'dog', 'pet', 'kitten', 'puppy', 'feline', 'canine',
  'harness', 'leash', 'collar', 'litter', 'feeder', 'fountain',
  'carrier', 'kennel', 'scratching', 'catnip', 'paw',
  'grooming', 'nail clip', 'tunnel', 'pet bed', 'pet toy', 'animal',
]
// Açık şekilde insan/eşya ürünü olduğunu gösteren kelimeler
const HUMAN_PRODUCT_KEYWORDS = [
  "sterling silver", "moissanite", "women's", "men's", "woman", "men ",
  "bracelet", "necklace", "earring", " ring ", "anklet", "jewelry",
  "jeans", " pants", "suit ", "blouse", "dress ", "skirt",
  "school bag", "building block", "puzzle game", "pool game",
  "inflatable", "bed frame", "side table", "dining", "camping chair",
  "roof rack", "magnetic screen door", "screen door",
  "chest pads", "trendy brand", "skin-friendly", "cardigan sweater",
  "fleece suit", "two-piece suit", "three-piece suit", "windscreen",
  "crossbody", "cosmetic bag", "washing cosmetic", "human hair",
  "tic-tac-toe", "pool game", "knotted",
]

function isPetProductByName(name: string): boolean {
  const lower = name.toLowerCase()
  // Eğer açıkça insan ürünü kelimesi varsa reddet
  if (HUMAN_PRODUCT_KEYWORDS.some(k => lower.includes(k))) return false
  // Pet kelimesi içeriyorsa kabul et
  if (PET_KEYWORDS.some(k => lower.includes(k))) return true
  // Hiçbiri yoksa reddet
  return false
}

async function searchCJByCategory(categoryId: string, page = 1, size = 50): Promise<any[]> {
  const d = await cjGet('/product/list', {
    categoryId, pageNum: String(page), pageSize: String(size),
    productType: 'DROPSHIPPING',
  })
  return (d.data?.list ?? []) as any[]
}

async function searchCJ(keyword: string, page = 1, size = 50): Promise<any[]> {
  const d = await cjGet('/product/list', {
    productNameEn: keyword, pageNum: String(page), pageSize: String(size),
    productType: 'DROPSHIPPING',
  })
  return (d.data?.list ?? []) as any[]
}

async function getDetail(pid: string): Promise<any | null> {
  const d = await cjGet('/product/query', { pid })
  return d.data ?? null
}

// ─── Kategori konfigürasyonu ─────────────────────────────────────────────────
interface CatConfig {
  slug: string
  label: string
  // CJ category IDs — guaranteed to be pet products
  cjCategoryIds?: string[]
  // Fallback keyword search (for kum-temizleyici where no exact CJ category exists)
  keywords?: string[]
  target: number
}

const CATEGORIES: CatConfig[] = [
  {
    slug: 'oyuncak', label: 'Oyuncak', target: 42,
    cjCategoryIds: [
      '2410110339311602900', // Pet Chase Toys
      '2410110339451623300', // Pet Chew Toys
      '2410110340031614900', // Pet Training Toys
      '2410110340161623400', // Pet Sound Toys
      '2410110340291603400', // Pet Tunnel Toys
      '2410110340411608400', // Pet Toy Set
      '2410110340531618900', // Pet Plush Toys
    ],
  },
  {
    slug: 'tasma', label: 'Tasma & Göğüs Tasması', target: 35,
    cjCategoryIds: [
      '2410110352591600400', // Pet Harnesses
      '2410110352471611400', // Pet Leashes
      '2410110352331629800', // Pet Collars
      '2410110353301600600', // Pet Collar, Leash & Harness Sets
    ],
  },
  {
    slug: 'yatak', label: 'Yatak & Yuva', target: 32,
    cjCategoryIds: [
      '2410110358051626100', // Pet Beds
      '2410110357511615700', // Pet Nests
      '2410110357391611900', // Pet Mats
      '2410110356441603600', // Pet Houses & Cages
      '2410110358191601900', // Pet Blankets & Quilts
      '2410110357221629500', // Pet Hammocks
    ],
  },
  {
    slug: 'mama-kabi', label: 'Mama Kabı & Besleyici', target: 30,
    cjCategoryIds: [
      '2410110341061612000', // Pet Bowls
      '2410110341331606800', // Pet Drinking Tools
      '2410110341451628800', // Pet Feeding Tools
    ],
  },
  {
    slug: 'kiyafet', label: 'Kıyafet', target: 28,
    cjCategoryIds: [
      '2410110348401611500', // Pet Sweaters
      '2410110348531624100', // Pet Sweatshirts & Hoodies
      '2410110349061619800', // Pet Coats & Jackets
      '2410110349471606300', // Pet Clothings
      '2410110348131619300', // Pet Dresses
      '2410110349341618600', // Pet Pajamas
      '2410110349201623700', // Pet Jumpsuits
      '2410110350021615300', // Pet Functional Clothings
      '2410110350311612500', // Pet Down & Parkas
    ],
  },
  {
    slug: 'kum-temizleyici', label: 'Kum Temizleyici', target: 20,
    keywords: ['cat litter box enclosed', 'self cleaning litter box', 'cat toilet litter tray', 'cat litter scoop'],
  },
  {
    slug: 'tasima-cantasi', label: 'Taşıma Çantası', target: 16,
    cjCategoryIds: [
      '2410110342571606700', // Pet Bags (Outdoor)
      '2410110351121613900', // Pet Bags (Apparels)
    ],
  },
  {
    slug: 'diger-aksesuar', label: 'Diğer Aksesuar', target: 15,
    cjCategoryIds: [
      '2410110354491625800', // Pet Hair Removers & Combs
      '2410110355021623200', // Pet Nail Polishers
      '2410110355151622300', // Pet Shower Products
      '2410110355491614000', // Cat Scratching Posts
      '2410110355321622400', // Pet Towels
    ],
  },
]

// ─── Türkçe içerik üretici ──────────────────────────────────────────────────
const BRAND_TAGS = ['Pro', 'Plus', 'Elite', 'Smart', 'Cozy', 'Lüx', 'Max', 'Mini', 'Duo', 'Air']

const PRODUCT_TYPES: Record<string, string[]> = {
  oyuncak: [
    'Tüylü Değnek Oyuncak', 'İnteraktif Top Oyuncak', 'Lazer İşaretçi', 'Kedi Tüneli',
    'Catnip Fare Oyuncak', 'Sesli Lastik Oyuncak', 'Elektronik Fare', 'Rotasyonlu Kelebek Oyuncak',
    'Köpek Çekme Halat', 'Zıplayan Top', 'Doğal Catnip Oyuncak', 'Balık Peluş Oyuncak',
    'Kafesli Bal Kabağı Oyuncak', 'Akılı Otomatik Oyuncak', 'Tatlı Tavşan Oyuncak',
  ],
  tasma: [
    'Göğüs Tasması', 'Yürüyüş Tasması', 'Ayarlanabilir Göğüs Tasması', 'Reflektörlü Tasma',
    'Step-In Göğüs Tasması', 'Nefes Alan Hasır Tasma', 'Klasik Boyun Tasması',
    'Köpek Kayışı Set', 'Ekose Desen Tasma', 'Yumuşak Astarlı Göğüs Tasması',
  ],
  yatak: [
    'Yuvarlak Peluş Yatak', 'Mağara Tip Yuva', 'Çivi Altı Kedi Evi', 'Ortopedik Köpek Yatağı',
    'Balık Şeklinde Yatak', 'Sıcak Derin Yuva', 'Pencere Askılı Kedi Minderi', 'Katlanabilir Kedi Yatağı',
    'Makine Yıkanabilir Köpek Yatağı', 'Tünel Kedi Evi', 'Ahşap Kedi Evi', 'Çatılı Köpek Kulübesi',
  ],
  'mama-kabi': [
    'Otomatik Zamanlayıcılı Besleyici', 'Çift Mama Kabı', 'Döner Su Çeşmesi', 'Yavaş Yeme Kabı',
    'LCD Ekranlı Otomatik Besleyici', 'Paslanmaz Çelik Mama Seti', 'WiFi Akıllı Besleyici',
    'Porselen Mama Kabı Seti', 'Seyahat Mama Kabı', 'Anti-Boğulma Yavaş Besleyici',
  ],
  kiyafet: [
    'Kapüşonlu Kazak', 'Ekose Desen Palto', 'Yağmurluk', 'Uyku Tulumu',
    'Parti Kostümü', 'Örme Kazak', 'Kış Ceketi', 'Çok Renkli Tulum',
    'Çizgili Günlük Tişört', 'Sıcak Tutcu Kıyafet',
  ],
  'kum-temizleyici': [
    'Kapalı Kedi Tuvaleti', 'Büyük Kum Kabı', 'Otomatik Temizleme Kutusu', 'Tasarım Kedi WC',
    'Filtreli Kum Kutusu', 'Köşe Kedi Tuvaleti', 'Kürek ve Kum Seti', 'Asma Kapılı Tuvalet',
  ],
  'tasima-cantasi': [
    'Taşıma Çantası', 'Uzay Kapsülü Sırt Çantası', 'Omuz Çantası', 'Katlanabilir Taşıyıcı',
    'Nefes Alabilen Örgü Çanta', 'Kutu Tip Taşıyıcı', 'Bölmeli Taşıma Çantası',
  ],
  'diger-aksesuar': [
    'Tımar Fırçası', 'Tırnak Makası Seti', 'Çift Taraflı Tarama Tarağı', 'Banyo Masajı Eldiveni',
    'Bandana & Papyon Seti', 'Kedi Künye Seti', 'Anti-Kıl Rulo', 'Dişçi Fırçası Seti',
  ],
}

const DESCS: Record<string, string[]> = {
  oyuncak: [
    'Kedinin veya köpeğin doğal avlanma içgüdüsünü harekete geçiren bu oyuncak, saatlerce aktif eğlence sunar. Dayanıklı malzeme ve canlı renklerle hazırlanmıştır.',
    'Evcil hayvanınızın sıkılmasına son! İnteraktif tasarımı ile her oturumda yeni bir heyecan yaratır. Yıkanabilir ve güvenli malzemeden üretilmiştir.',
    'Yüksek kaliteli malzeme kullanılarak üretilen bu oyuncak, evcil hayvanınızın fiziksel ve zihinsel gelişimine katkı sağlar. Dikkatini çeken renk ve seslerle donatılmıştır.',
    'Uzun süre evde kalacak olan evcil hayvanınızın enerjisini bu oyuncakla harcamasını sağlayın. Güvenli ve non-toxic malzemelerden yapılmıştır.',
    'Kedi ve köpeklerin ilgisini çeken akıllı tasarımı ile hem kapalı hem de açık alanda kullanım için uygundur.',
  ],
  tasma: [
    'Ergonomik kesimi ve yumuşak iç astarı ile günlük yürüyüşlerde hem siz hem de evcil hayvanınız için konfor sağlar. Ayarlanabilir tokaları ile her bedene uyum sağlar.',
    'Yüksek kaliteli malzemeden üretilen bu tasma, uzun ömürlü kullanım sunar. Gece görünürlüğü için reflektörlü şeritler ile donatılmıştır.',
    'Kaçmaya karşı güvenli kilit sistemi ve geniş aralıkta ayarlanabilir bantları ile her ırk ve beden için idealdir.',
    'Nefes alabilen kumaşı ile uzun yürüyüşlerde evcil hayvanınızın rahat etmesini sağlar. Hızlı takıp çıkarma tokası ile pratik kullanım sunar.',
    'Şık deseni ve sağlam dokumasıyla hem günlük yürüyüş hem de seyahat için mükemmeldir.',
  ],
  yatak: [
    'Ultra yumuşak peluş dolgusu ile evcil hayvanınıza yıldız gibi uyku deneyimi sunar. Makine yıkanabilir kılıfı ile hijyen açısından pratik bir kullanım sağlar.',
    'Yuvarlak tasarımı kedi ve köpeklerin doğal kıvrılma içgüdüsüne cevap verir. Dört mevsim kullanıma uygun yüksek yoğunluklu köpük dolgusuna sahiptir.',
    'Sıcak tutan ve kaygıyı gideren çevreleyen tasarımı ile evcil hayvanınızın en rahat uykusunu uyumasına yardımcı olur.',
    'Kaymaz taban ve çevreye duyarlı malzemeleri ile evcil hayvan sağlığını ön planda tutan bir yatak deneyimi sunar.',
    'Ağır gövdeler için destek sağlayan ortopedik dolgusu ile eklem ağrılarını hafifleten özel yatak tasarımı.',
  ],
  'mama-kabi': [
    'Programlanabilir zamanlayıcısı ile evcil hayvanınız her gün belirlediğiniz saatlerde beslenebilir. Büyük kapasiteli haznesi seyahat özgürlüğü sunar.',
    'Paslanmaz çelik kap bölmesi, bakterilerin üremesini engellerken dayanıklılık sağlar. Anti-kayma taban ile yemek sırasında sabit kalır.',
    'LCD ekranlı dijital paneli ile besleme saatlerini ve porsiyon miktarlarını kolayca ayarlayabilirsiniz.',
    'Döner pompa teknolojisi ile sürekli taze ve oksijene dolu su sağlayan bu çeşme, evcil hayvanınızın daha fazla su içmesini teşvik eder.',
    'Yavaş yeme tasarımı ile aşırı hızlı yemenin neden olduğu sindirim sorunlarını önler. Kolay temizlenebilir parçaları ile hijyenik kullanım sağlar.',
  ],
  kiyafet: [
    'Yumuşak ve esnek kumaşı ile hareketi kısıtlamadan evcil hayvanınızı sıcak tutar. Kolayca giydirip çıkarabilmeniz için özel cırt-cırt kapatma sistemi mevcuttur.',
    'Tatlı tasarımı ve kaliteli dikişleriyle uzun süre kullanıma dayanıklıdır. Soğuk havalarda evcil hayvanınızı koruyan ideal kış kıyafeti.',
    'Nefes alabilen kumaşı ile yazın serinlik sağlar. Makinede yıkanabilir yapısı ile bakımı kolaydır.',
    'Özel okasyon ve günlük kullanım için tasarlanan bu kıyafet, evcil hayvanınızı her ortamda şık gösterir.',
    'Anti-alerjik ve skin-friendly malzeme ile hassas deriler için güvenli kullanım sunar.',
  ],
  'kum-temizleyici': [
    'Kapalı tasarımı kötü kokuları hapseder ve evcil hayvanınıza mahremiyet sunar. Büyük giriş ağzı ile her boyuttaki kedi için uygundur.',
    'Yüksek kenarlı tasarımı ile kum dağılmasını önler. Kolay temizleme için çıkarılabilir astar kulplarına sahiptir.',
    'Hava filtreleme sistemi ile ev ortamındaki koku ve tozu minimuma indirir. Dayanıklı plastik malzemeden üretilmiştir.',
    'Kedi konforunu maksimuma çıkaran geniş iç hacmi ile büyük ırklar için de yeterli alan sunar.',
  ],
  'tasima-cantasi': [
    'Nefes alabilen örgü panelleri ile evcil hayvanınızın seyahat sırasında rahat ve güvende kalmasını sağlar. Havayolu standartlarına uygundur.',
    'Katlanabilir tasarımı ile kullanılmadığında az yer kaplar. Güçlendirilmiş tabanı sağlam bir zemin sunar.',
    'Şeffaf üst bölmesi ile hayvanınızın dışarıyı görmesine imkân tanıyan uzay kapsülü tasarımı.',
    'Hafif ve dayanıklı yapısı ile uzun yolculuklarda bile taşınması kolaydır. Yan cepleri pratik depolama imkânı sunar.',
  ],
  'diger-aksesuar': [
    'Ölü tüyleri ve altı tüyü uzaklaştıran çift katlı diş yapısı ile etkin tımar sağlar. Ergonomik sap ile uzun kullanımda el yorulmaz.',
    'Profesyonel kalitede kesim yapan paslanmaz çelik bıçakları ile evcil hayvanınızın tırnaklarını güvenle kesebilirsiniz.',
    'Kolay kullanım ve profesyonel sonuç için tasarlanmış komple bakım seti. Evcil hayvan bakımını evde yapmayı kolaylaştırır.',
    'Sağlıklı ve parlak bir tüy yapısı için düzenli kullanımda farkedilir sonuçlar sunar. Toksik içerik içermez.',
  ],
}

const FEATURES_MAP: Record<string, string[][]> = {
  oyuncak: [
    ['Dayanıklı, ısırma dirençli malzeme', 'Canlı renkler ve ilgi çekici tasarım', 'Güvenli, non-toxic bileşenler', 'Tüm ırk ve boyutlar için uygun'],
    ['İnteraktif avlanma simülasyonu', 'Yüksek sesli çıngırak veya gıcırdatma özelliği', 'Uzaktan kumanda veya otomatik hareket', 'Pil veya USB şarj ile çalışır'],
    ['Yıkanabilir ve hijyenik tasarım', 'Hafif ve taşıması kolay', 'Çok parçalı, zengin içerik', 'Kedi ve köpekler için uygun'],
  ],
  tasma: [
    ['Paslanmaz çelik toka ve D-halka', 'Reflektörlü şeritler, gece görünürlüğü', 'Nefes alabilen mesh kumaş', '3 ayrı boyut ayar noktası'],
    ['Anında takıp çıkarma tokası', 'Yumuşak neopren iç astar', 'Çekiş ve kaçış önleyici tasarım', 'Hafif ve dayanıklı'],
    ['Makine yıkanabilir', 'Geri çekilebilir kayış seçeneği', 'Kaymaz bant kaplama', 'Renk seçenekleri'],
  ],
  yatak: [
    ['Makine yıkanabilir kapak', 'Kaymaz taban', 'Anti-alerjik peluş dolgu', '4 mevsim kullanıma uygun'],
    ['Yıkanabilir iç ve dış kapak', 'Ortopedik bellek köpüğü', 'Sıcaklık yalıtım teknolojisi', 'Çevre dostu malzeme'],
    ['Yuvarlak çevreleyen tasarım', 'Fermuar ile çıkarılabilir kılıf', 'Saç ve kır tutmayan yüzey', 'Birden fazla renk seçeneği'],
  ],
  'mama-kabi': [
    ['Programlanabilir 1-6 öğün / gün', 'LCD ekran ve alarm', '4L+ geniş kapasite', 'Yedek pil bölümü'],
    ['USB + adaptör ile çalışır', 'Ses kaydı ile beslenme bildirim', 'Paslanmaz çelik kap', 'Kolay temizlenebilir'],
    ['2.5L+ su kapasitesi (çeşme)', 'Aktif karbon filtresi', 'Hızı ayarlanabilir pompa', 'Ultra sessiz çalışma'],
  ],
  kiyafet: [
    ['%100 pamuk veya fleece', 'Cırt cırt + düğme kapama', 'Köpek tasma deliği', 'XS–XL beden çeşidi'],
    ['Esnek, hareketi kısıtlamayan kumaş', 'Makinede yıkanabilir', 'Geri reflektörlü şerit (yağmurluk)', 'Mevsime uygun ağırlık'],
  ],
  'kum-temizleyici': [
    ['Koku önleyici aktif karbon filtresi', 'Alçak giriş eşiği', 'Kürek hediyeli', 'Koyu renk iç yüzey'],
    ['Geniş iç alan, büyük ırklar için uygun', 'Çıkarılabilir iç tepsisi', 'Kum matı ile birlikte', 'Kaymaz taban'],
  ],
  'tasima-cantasi': [
    ['Havayolu kabin onaylı ölçüler', 'Nefes alabilen örgü yan paneller', 'Güvenlik emniyet tokası', 'Omuz + el tutacağı'],
    ['Katlanabilir, kompakt depolama', 'Su geçirmez taban', 'Yan erişim fermuar', 'Uzay kapsülü pencere'],
  ],
  'diger-aksesuar': [
    ['Paslanmaz çelik bıçak/diş', 'Ergonomik kaymaz sap', 'Yedek parça içerikli', 'Temizleme tuşu (fırça)'],
    ['Güvenli tur kilidi', 'Parmak basınç sensörü', 'Anti-yanak kesici tasarım', 'Veteriner onaylı'],
  ],
}

// ─── Yardımcı fonksiyonlar ────────────────────────────────────────────────────
function seed(str: string): number {
  let h = 0
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

function seededFloat(s: number, min: number, max: number): number {
  return min + ((s % 1000) / 1000) * (max - min)
}

function turkishName(engName: string, catSlug: string, idx: number): string {
  const n = engName.toLowerCase()
  const pet = n.includes('dog') && !n.includes('cat') ? 'Köpek'
    : n.includes('cat') && !n.includes('dog') ? 'Kedi'
    : ''

  const types = PRODUCT_TYPES[catSlug] ?? ['Aksesuar']
  const baseType = types[idx % types.length]
  const brand = BRAND_TAGS[idx % BRAND_TAGS.length]

  const extras: string[] = []
  if (/automatic|auto/i.test(engName)) extras.push('Otomatik')
  if (/smart|intelligent/i.test(engName)) extras.push('Akıllı')
  if (/waterproof|water.?resistant/i.test(engName)) extras.push('Su Geçirmez')
  if (/adjustable|retractable/i.test(engName)) extras.push('Ayarlanabilir')
  if (/washable/i.test(engName)) extras.push('Yıkanabilir')
  if (/foldable|folding|collapsible/i.test(engName)) extras.push('Katlanabilir')
  if (/portable/i.test(engName)) extras.push('Taşınabilir')
  if (/soft|plush|cozy/i.test(engName)) extras.push('Yumuşak')

  // Tekrarları önle: extra veya pet zaten baseType içindeyse ekleme
  const extraStr = extras.find(e => !baseType.includes(e)) ?? ''
  const petPart = baseType.toLowerCase().includes(pet.toLowerCase()) ? '' : pet
  const parts = [petPart, extraStr, baseType, brand].filter(Boolean)
  return parts.join(' ')
}

function turkishShortDesc(engName: string, catSlug: string, idx: number): string {
  const shorts: Record<string, string[]> = {
    oyuncak: ['Evcil hayvanınızın sevgilisi olacak interaktif oyuncak!', 'Bıkmadan oynayacak, merak duygusunu canlı tutacak tasarım.', 'Doğal avlanma içgüdüsünü uyandıran eğlenceli oyuncak.', 'Akıllı hareketli mekanizmasıyla saatlerce eğlence!'],
    tasma: ['Konforlu ve güvenli yürüyüş için tasarlandı.', 'Ergonomik kesimi ile hem siz hem pati dostunuz rahat.', 'Güçlendirilmiş toka ve kaçış önleyici tasarım.', 'Her ırk ve beden için ayarlanabilir fit.'],
    yatak: ['Derin ve rahat bir uyku için premium yatak.', 'Sıcacık sarmalayan tasarım, evcil hayvanınızın favorisi olacak.', 'Makinede yıkanabilir, her zaman temiz!', 'Ortopedik destek ile eklem sağlığını korur.'],
    'mama-kabi': ['Besleme saatlerini otomatikleştiren akıllı çözüm!', 'Taze su ve mama her zaman hazır.', 'LCD ekran ve zamanlayıcı ile tam kontrol.', 'Yavaş yeme sağlayan akıllı tasarım.'],
    kiyafet: ['Şık ve sıcak tutan harika kıyafet!', 'Kolay giydir-çıkar, evcil hayvanınız kaçmaya çalışmaz.', 'Her mevsim için uygun, nefes alan kumaş.', 'Parti ya da günlük kullanıma mükemmel.'],
    'kum-temizleyici': ['Koku sorununu çözen kapalı tuvalet tasarımı.', 'Temizlenmesi kolay, hijyenik kum kutusu.', 'Büyük kapasitesi ile az değiştirme ihtiyacı.', 'Kedi konforu ve ev estetiği bir arada.'],
    'tasima-cantasi': ['Güvenli ve konforlu seyahat için ideal çanta!', 'Havayolu kabinine girebilen ölçüler.', 'Hem siz hem evcil hayvanınız için rahat seyahat.', 'Katlanabilir, az yer kaplayan tasarım.'],
    'diger-aksesuar': ['Profesyonel bakımı evde yapmanızı sağlar.', 'Güvenli ve etkili tımar deneyimi.', 'Uzman seçimi, güvenilir kalite.', 'Evcil hayvan bakımında eksiksiz çözüm.'],
  }
  const opts = shorts[catSlug] ?? ['Kaliteli ve dayanıklı evcil hayvan aksesuarı.']
  return opts[idx % opts.length]
}

function turkishDescription(engName: string, catSlug: string, idx: number): string {
  const opts = DESCS[catSlug] ?? ['Yüksek kaliteli malzemeden üretilmiş bu ürün, evcil hayvanınızın konfor ve güvenliğini ön planda tutar. Uzun ömürlü kullanım ve kolay bakım için tasarlanmıştır.']
  return opts[idx % opts.length]
}

function pickFeatures(catSlug: string, idx: number): string[] {
  const sets = FEATURES_MAP[catSlug] ?? [['Kaliteli malzeme', 'Dayanıklı yapı', 'Kolay kullanım', 'Evcil hayvan güvenliği']]
  return sets[idx % sets.length]
}

function usdToTry(usdPrice: number): number {
  if (!usdPrice || isNaN(usdPrice) || usdPrice <= 0) return 0
  const usdTry = 38
  const markup = 1.55
  const shipping = 13
  const raw = (usdPrice + shipping) * usdTry * markup
  return Math.max(99, Math.round(raw / 10) * 10)
}

function pickBadge(idx: number, price: number): string | null {
  if (price > 5000) return 'Premium'
  const r = idx % 10
  if (r === 0) return 'Çok Satan'
  if (r === 1) return 'Yeni'
  if (r === 2) return 'İndirim'
  if (r === 3 && price > 1500) return 'Premium'
  return null
}

function parseImgField(val: unknown): string[] {
  if (!val) return []
  if (typeof val === 'string') {
    const trimmed = val.trim()
    // JSON-encoded array: '["url1","url2"]'
    if (trimmed.startsWith('[')) {
      try { return (JSON.parse(trimmed) as string[]).filter(Boolean) } catch { return [trimmed] }
    }
    return [trimmed]
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
    for (const v of detail.variants) {
      if (v.variantImage) imgs.push(...parseImgField(v.variantImage))
    }
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

// ─── Ana importasyon mantığı ──────────────────────────────────────────────────
async function main() {
  const DRY_RUN = process.argv.includes('--dry-run')

  if (DRY_RUN) console.log('🔵 DRY-RUN modu — DB\'ye yazılmayacak')

  // Prisma client
  const { PrismaClient } = await import('../src/generated/prisma/client')
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  const prisma = new (PrismaClient as any)({ adapter }) as any

  // Mevcut CJ ürün ID'lerini ve kategori sayılarını çek
  const existing = await prisma.product.findMany({ select: { cjProductId: true, category: true } })
  const existingCjIds = new Set(existing.map((p: any) => p.cjProductId).filter(Boolean))
  const categoryCounts: Record<string, number> = {}
  for (const p of existing) categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1
  console.log(`📋 Mevcut ürün sayısı: ${existing.length}, mevcut CJ ürünleri: ${existingCjIds.size}`)
  console.log('📊 Kategori dağılımı:', categoryCounts)

  // target'ı mevcut sayıya göre ayarla (sadece eksik olanı import et)
  for (const cat of CATEGORIES) {
    const current = categoryCounts[cat.slug] ?? 0
    const needed = Math.max(0, cat.target - current)
    cat.target = needed
    console.log(`  ${cat.slug}: ${current} mevcut → ${needed} eklenecek`)
  }

  let totalImported = 0
  let totalSkipped = 0

  for (const cat of CATEGORIES) {
    console.log(`\n🐾 Kategori: ${cat.label} (hedef: ${cat.target})`)
    const collected: any[] = []
    const seenPids = new Set<string>()

    // Category-ID-based search (preferred — guaranteed pet products)
    if (cat.cjCategoryIds?.length) {
      for (const catId of cat.cjCategoryIds) {
        if (collected.length >= cat.target * 2) break
        for (let page = 1; page <= 4; page++) {
          if (collected.length >= cat.target * 2) break
          console.log(`  🔍 CJ catId ${catId.slice(-6)} — sayfa ${page}`)
          let list: any[] = []
          try {
            list = await searchCJByCategory(catId, page, 50)
          } catch (err) {
            console.warn(`  ⚠ Kategori arama hatası: ${err}`)
            break
          }
          if (!list.length) break
          for (const item of list) {
            const pid = item.pid ?? item.productId
            if (!pid || seenPids.has(pid) || existingCjIds.has(pid)) continue
            seenPids.add(pid)
            if (!item.productImage) continue
            const price = parseFloat(item.sellPrice ?? item.variants?.[0]?.variantSellPrice ?? 0)
            if (!price || isNaN(price) || price <= 0 || price > 200) continue  // $200 = ~10,000₺ premium
            // Ön-filtre: liste isminden açık insan ürünü kırmızı bayrakları kontrol et
            const listName = (item.productNameEn ?? item.productName ?? '').toLowerCase()
            if (HUMAN_PRODUCT_KEYWORDS.some(k => listName.includes(k))) continue
            collected.push({ ...item, _price: price })
            if (collected.length >= cat.target * 2) break
          }
          await new Promise(r => setTimeout(r, 700))
        }
      }
    }

    // Keyword fallback (kum-temizleyici, or if category search didn't yield enough)
    if (collected.length < cat.target && cat.keywords?.length) {
      for (const kw of cat.keywords) {
        if (collected.length >= cat.target * 2) break
        for (let page = 1; page <= 3; page++) {
          if (collected.length >= cat.target * 2) break
          console.log(`  🔍 keyword "${kw}" — sayfa ${page}`)
          let list: any[] = []
          try {
            list = await searchCJ(kw, page, 50)
          } catch (err) {
            console.warn(`  ⚠ Arama hatası: ${err}`)
            break
          }
          if (!list.length) break
          for (const item of list) {
            const pid = item.pid ?? item.productId
            if (!pid || seenPids.has(pid) || existingCjIds.has(pid)) continue
            seenPids.add(pid)
            if (!item.productImage) continue
            const price = parseFloat(item.sellPrice ?? item.variants?.[0]?.variantSellPrice ?? 0)
            if (!price || isNaN(price) || price <= 0 || price > 200) continue
            // Keyword aramada hem pet keyword şart hem de insan ürünü filtresi
            if (!isPetProductByName(item.productNameEn ?? item.productName ?? '')) continue
            collected.push({ ...item, _price: price })
            if (collected.length >= cat.target * 2) break
          }
          await new Promise(r => setTimeout(r, 700))
        }
      }
    }

    console.log(`  📦 ${collected.length} aday ürün toplandı, ${cat.target} ürün import edilecek`)

    let catCount = 0
    for (let i = 0; i < collected.length && catCount < cat.target; i++) {
      const item = collected[i]
      const pid = item.pid ?? item.productId

      // Detail al (opsiyonel — başarısız olursa list verisini kullan)
      let detail: any = item
      try {
        const d = await getDetail(pid)
        if (d) detail = d
        await new Promise(r => setTimeout(r, 500))
      } catch {
        // list verisini kullanmaya devam et
      }

      // ⚠ CJ ismini doğrula — pet ürünü değilse atla
      const cjEnName: string = detail.productNameEn ?? detail.productName ?? item.productNameEn ?? item.productName ?? ''
      if (!isPetProductByName(cjEnName)) {
        console.log(`  ⛔ PET DEĞİL, atlandı: "${cjEnName.slice(0, 70)}"`)
        totalSkipped++
        continue
      }

      const images = extractImages(detail)
      if (!images.length) { totalSkipped++; continue }

      const thumbImage = images[0]
      const cjVariant = detail.variants?.[0]
      const cjVariantId = cjVariant?.vid ?? null
      const cjPrice = parseFloat(detail.sellPrice ?? item._price ?? 0)
      if (!cjPrice || isNaN(cjPrice) || cjPrice <= 0) { totalSkipped++; continue }
      const tryPrice = usdToTry(cjPrice)
      if (!tryPrice || tryPrice <= 0) { totalSkipped++; continue }

      const s = seed(pid)
      const rating = parseFloat(seededFloat(s, 3.8, 4.95).toFixed(1))
      const reviewCount = Math.round(seededFloat(s >> 4, 50, 1500))
      const stock = Math.round(seededFloat(s >> 8, 30, 200))

      const trName = turkishName(detail.productNameEn ?? item.productNameEn ?? '', cat.slug, catCount)
      const idBase = slugify(trName)
      const id = `${idBase}-${catCount + 1}`

      const colors = detail.variants
        ? [...new Set(detail.variants
            .map((v: any) => v.variantProperty?.split(' ')[0] ?? '')
            .filter((c: string) => c.length > 0 && c.length < 20)
          )].slice(0, 5) as string[]
        : []

      const sizes = detail.variants
        ? [...new Set(detail.variants
            .map((v: any) => {
              const parts = (v.variantProperty ?? '').split(' ')
              return parts.length > 1 ? parts.slice(1).join(' ') : ''
            })
            .filter((s: string) => s.length > 0 && s.length < 15)
          )].slice(0, 5) as string[]
        : []

      const productData = {
        id,
        cjProductId: pid,
        cjVariantId,
        name: trName,
        category: cat.slug,
        categoryLabel: cat.label,
        price: tryPrice,
        rating,
        reviewCount,
        badge: pickBadge(catCount, tryPrice),
        images,
        thumbImage,
        shortDesc: turkishShortDesc(detail.productNameEn ?? '', cat.slug, catCount),
        description: turkishDescription(detail.productNameEn ?? '', cat.slug, catCount),
        features: pickFeatures(cat.slug, catCount),
        colors,
        sizes,
        stock,
        active: true,
        supplier: 'CJ Dropshipping',
        supplierNote: `CJ PID: ${pid}${cjVariantId ? ` | VID: ${cjVariantId}` : ''}`,
      }

      if (DRY_RUN) {
        console.log(`  [DRY] ${id} — ${trName} — ${tryPrice}₺ — ${images.length} görsel`)
      } else {
        try {
          await prisma.product.upsert({
            where: { id },
            create: productData,
            update: { ...productData },
          })
          console.log(`  ✅ ${id} — ${trName} — ${tryPrice}₺`)
          existingCjIds.add(pid)
          totalImported++
        } catch (err: any) {
          // ID çakışması olursa sufiks ekle
          if (err?.code === 'P2002') {
            const altId = `${idBase}-${catCount + 1}-x`
            try {
              await prisma.product.upsert({
                where: { id: altId },
                create: { ...productData, id: altId },
                update: { ...productData, id: altId },
              })
              console.log(`  ✅ ${altId} (çakışma düzeltildi)`)
              totalImported++
            } catch (err2) {
              console.error(`  ❌ ${id} hata:`, err2)
              totalSkipped++
            }
          } else {
            console.error(`  ❌ ${id} hata:`, err)
            totalSkipped++
          }
        }
      }
      catCount++
    }

    console.log(`  ✔ ${cat.label}: ${catCount} ürün import edildi`)
  }

  console.log(`\n🎉 Tamamlandı! Import: ${totalImported}, Atlanan: ${totalSkipped}`)
  if (!DRY_RUN) {
    const total = await prisma.product.count()
    console.log(`📊 DB'deki toplam ürün sayısı: ${total}`)
  }
}

main().catch(e => { console.error('❌ Kritik hata:', e); process.exit(1) })
