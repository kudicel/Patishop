import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getProducts } from '@/lib/db-products'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SortableProductGrid } from '@/components/SortableProductGrid'

interface Props { params: Promise<{ slug: string }> }

const CATEGORY_META: Record<string, {
  label: string
  labelEn: string
  description: string
  guide: string
}> = {
  'mama-kabi': {
    label: 'Mama Kapları',
    labelEn: 'Food Bowls',
    description: 'Akıllı ve WiFi kontrollü otomatik mama kapları. ISO sertifikalı, 17 ülkeye hızlı teslimat.',
    guide: `Doğru mama kabı boyutu, evcil hayvanınızın günlük tükettiği mama miktarına göre belirlenir. Küçük ırk kediler ve köpekler için 200–400 ml hazneli kaplar genelde yeterlidir; orta ve büyük ırk köpeklerde ise 1–2 litre kapasiteli, çoklu bölmeli kaplar tercih edilmelidir. Birden fazla evcil hayvanınız varsa, her hayvana ayrı kap ayırmak yiyecek rekabetini ve stresi azaltır.

Malzeme seçimi de en az boyut kadar önemlidir. Paslanmaz çelik kaplar hijyenik, kokusuz ve çizilmeye dayanıklıdır; özellikle çene aknesi (kedi çene siyah noktaları) yaşayan kediler için plastik kaplara göre daha uygundur. Seramik kaplar estetik açıdan tercih edilir ancak kırılabilir olduğundan dikkatli kullanılmalıdır. Plastik kaplar ise ucuz ve hafif olsa da zamanla çizilerek bakteri üreme riski taşıyabilir, bu yüzden düzenli değişimi gerekir.

Otomatik/akıllı mama kapları, porsiyon miktarını ve besleme saatlerini uygulama üzerinden programlamanıza imkân tanır. Bu sayede seyahatte ya da mesai saatlerinde evcil hayvanınız düzenli beslenmeye devam eder. Elektrik kesintisine karşı pil yedeği bulunan modelleri tercih etmek, besleme aksaklıklarını önler. Kabın kolayca sökülüp bulaşık makinesinde yıkanabilmesi de günlük kullanım açısından pratiklik sağlar.`,
  },
  'kum-temizleyici': {
    label: 'Kum Temizleyiciler',
    labelEn: 'Litter Cleaners',
    description: 'Sessiz çalışan otomatik kedi kumu temizleyiciler. Akıllı sensörlü, kolay temizlik.',
    guide: `Otomatik kum temizleyiciler, kedi kum kabından çıktıktan sonra hareket sensörü ile algılama yapar ve belirli bir bekleme süresinin ardından tarama mekanizmasını devreye sokarak atığı ayrı bir haznede toplar. Bu sayede günlük manuel temizlik ihtiyacı büyük ölçüde azalır, koku kontrolü daha tutarlı hale gelir.

Uyumluluk açısından en önemli kriter kum türüdür: otomatik temizleyicilerin büyük çoğunluğu topaklaşan (kümeleşen) kum ile tasarlanmıştır, çünkü tarama mekanizması topaklaşmayan kumlarda (bazı kristal veya biyobozunur kumlarda) verimli çalışmayabilir. Cihazı almadan önce üretici tavsiyesindeki kum türünü ürün açıklamasından kontrol etmeniz önerilir.

Kapasite ve gürültü seviyesi de seçimde belirleyicidir. Birden fazla kediniz varsa daha büyük atık haznesine sahip modeller, haznenin sık sık boşaltılması ihtiyacını azaltır. Sessiz motor teknolojisine sahip modeller, ürkek kediler için daha uygundur; ilk kullanımlarda kediyi cihaza kademeli olarak alıştırmak, cihazdan kaçınmasını önler.`,
  },
  'tasma': {
    label: 'Tasma & Aksesuar',
    labelEn: 'Leashes & Accessories',
    description: 'Ergonomik tasma setleri ve aksesuar koleksiyonu. Her ırk ve beden için uygun.',
    guide: `Boyun tasması mı yoksa göğüs tasması (harness) mı kullanılacağı, köpeğin ırkına ve yürüyüş alışkanlığına göre değişir. Boyun tasması, tasma eğitimi almış ve fazla çekmeyen köpekler için uygundur. Çekme alışkanlığı olan büyük ırklarda veya trakea (nefes borusu) hassasiyeti olan küçük ırklarda göğüs tasması, boyuna binen baskıyı azalttığı için daha güvenli bir seçenektir.

Doğru beden seçimi için basit bir kural vardır: tasma takıldığında boyun veya gövde ile tasma arasına iki parmağınız rahatça girebilmelidir. Çok gevşek bir tasma köpeğin boynundan sıyrılıp kaçmasına, çok sıkı bir tasma ise rahatsızlık ve cilt tahrişine yol açabilir. Ayarlanabilir tokalı modeller, büyüme çağındaki yavru köpekler için daha ekonomik bir tercihtir.

Malzeme seçiminde naylon tasmalar hafif, dayanıklı ve kolay yıkanabilir olduğu için günlük kullanıma uygundur. Deri tasmalar daha şık bir görünüm sunar ancak nemden etkilenebileceğinden düzenli bakım ister. Gece yürüyüşleri yapanlar için reflektif detaylı modeller görünürlüğü artırır. Tasmanın yalnızca yürüyüş sırasında takılması, evde sürekli takılı bırakılmaması tüy dökülmesi ve cilt tahrişini önler.`,
  },
  'oyuncak': {
    label: 'Oyuncaklar',
    labelEn: 'Toys',
    description: 'Kedi ve köpekler için interaktif oyuncaklar. Lazerli, sesli ve hareketli modeller.',
    guide: `Kedi ve köpeklerin oyuncak ihtiyaçları farklı içgüdülere dayanır. Kediler için lazer pointer ve tüylü çubuklar av içgüdüsünü tetikler; seansı gerçek bir ödül (mama veya oyuncak) ile bitirmek, kedinin hayal kırıklığı yaşamasını önler. Köpekler içinse halat ve çekiştirme oyuncakları fiziksel enerjiyi boşaltırken, dolgu ve zeka oyuncakları zihinsel uyarım sağlar.

Yaşa göre oyuncak seçimi de önemlidir. Yavru hayvanlarda diş çıkarma dönemine uygun, çiğnenebilir ve yumuşak malzemeli oyuncaklar tercih edilmelidir. Yetişkin evcil hayvanlarda dayanıklılık ön planda tutulurken, yaşlı hayvanlarda eklem yükünü artırmayan, hafif ve kolay taşınabilir oyuncaklar daha uygundur.

Güvenlik açısından, kopabilecek küçük parçalar içeren oyuncaklardan kaçınılmalı ve oyuncak boyutunun evcil hayvanın ağzına tam sığmayacak kadar büyük olmasına dikkat edilmelidir. Hasar gören veya parçalanmaya başlayan oyuncaklar yutma riskine karşı vakit kaybetmeden değiştirilmelidir.`,
  },
  'kiyafet': {
    label: 'Kıyafetler',
    labelEn: 'Clothing',
    description: 'Sevimli ve şık kedi & köpek kıyafetleri. Tüm sezonlar için model çeşitliliği.',
    guide: `Kıyafet seçiminde ilk kriter mevsim ve ortam koşullarıdır. Soğuk aylarda kısa tüylü veya küçük ırklar için astarlı, su geçirmez mont tipi kıyafetler tercih edilirken, sıcak havalarda ince pamuklu kumaşlar cildin nefes almasına yardımcı olur. Tüy dökme döneminde kıyafet kullanımı, ev içi tüylenmeyi de bir miktar azaltabilir.

Doğru beden için sırt uzunluğu, göğüs çevresi ve boyun ölçüsünün alınması önerilir; çoğu üründe beden tablosu bu üç ölçüye göre hazırlanır. Kıyafetin bacak ve kol hareketini kısıtlamaması, cırt cırt veya düğme gibi kapama mekanizmalarının cilde batmaması önemlidir.

İlk kullanımlarda evcil hayvanın kıyafete alışması zaman alabilir; kısa süreli denemelerle kademeli alıştırma, strese neden olmadan adaptasyonu kolaylaştırır. Kıyafetin uzun süre değil, dış mekân kullanımı veya özel durumlarla sınırlı tutulması cilt ve tüy sağlığı açısından tavsiye edilir.`,
  },
  'yatak': {
    label: 'Yataklar',
    labelEn: 'Beds',
    description: 'Ortopedik ve lüks evcil hayvan yatakları. Yumuşak, yıkanabilir, dayanıklı.',
    guide: `Yatak seçiminde evcil hayvanın yaşı ve eklem sağlığı belirleyici rol oynar. Yaşlı köpek ve kedilerde, özellikle kalça veya eklem rahatsızlığı öyküsü olanlarda, ortopedik köpük dolgulu yataklar vücut ağırlığını daha dengeli dağıtarak baskı noktalarını azaltır. Yavru ve genç hayvanlarda ise standart dolgulu, kolay temizlenebilir modeller yeterlidir.

Boyut seçiminde, evcil hayvanın uzanmış haldeki tam boyunun yatak içine rahatça sığması gerekir; çok küçük bir yatak kıvrılmaya zorlarken çok büyük bir yatak güvenlik hissini azaltabilir. Kenarları yüksek "yuva" tipi yataklar, kendini güvende hissetmek isteyen kediler ve küçük ırk köpekler için tercih edilebilir.

Kılıfı çıkarılıp yıkanabilen modeller hijyen açısından avantajlıdır, özellikle tüy dökülmesi yoğun ırklarda düzenli yıkama kokuyu ve alerjen birikimini azaltır. Kaymaz taban özelliği olan yataklar, sert zeminlerde yatağın kaymasını önleyerek kullanım ömrünü uzatır.`,
  },
  'tasima-cantasi': {
    label: 'Taşıma Çantaları',
    labelEn: 'Carrier Bags',
    description: 'Kedi ve köpekler için güvenli ve konforlu taşıma çantaları. Havayolu onaylı, nefes alabilen modeller.',
    guide: `Taşıma çantası seçerken öncelikle kullanım amacına karar vermek gerekir: uçak yolculuğu planlanıyorsa havayolunun koltuk altı boyut ve ağırlık sınırlarına uygun, havayolu onaylı modeller tercih edilmelidir; günlük veteriner ziyaretleri için ise hafif ve katlanabilir modeller yeterlidir.

Havalandırma, çantanın en kritik özelliklerinden biridir. Ağ panelli veya delikli yapılar, uzun yolculuklarda evcil hayvanın rahat nefes almasını sağlar. Sert kabuklu (hard-shell) çantalar darbelere karşı daha korumalı olsa da ağırdır; yumuşak kumaş çantalar ise daha hafif ve esnek olup kısa mesafe taşımalar için pratiktir.

Boyut seçiminde evcil hayvanın çanta içinde rahatça dönebilmesi ve ayakta durabilmesi önemlidir. İçeride kayma yapmayan taban desteği ve güvenlik kayışı/emniyet kemeri bağlantısı bulunan modeller, araç içi kullanımda ekstra güvenlik sağlar. İlk kullanımdan önce çantayı eve tanıdık bir eşya olarak bırakmak, evcil hayvanın strese kapılmadan alışmasına yardımcı olur.`,
  },
  'diger-aksesuar': {
    label: 'Diğer Aksesuarlar',
    labelEn: 'Other Accessories',
    description: 'Tımar fırçaları, tırnak makaları, bandanalar ve daha fazlası. Evcil hayvan bakımı için her şey.',
    guide: `Tımar fırçası seçimi tüy tipine göre değişir: kısa tüylü ırklarda lastik kıllı masaj fırçaları ölü tüyü etkili şekilde toplarken, uzun tüylü ırklarda tel dişli tarak veya düğüm açıcı fırçalar dolaşıkları önler. Düzenli fırçalama, tüy dökülmesini ev içinde azaltmanın yanı sıra cilt kan dolaşımını da destekler.

Tırnak makası seçiminde, küçük ırk kedi ve köpekler için makas tipi küçük tırnak kesiciler, büyük ırk köpekler için ise guillotine tipi veya elektrikli tırnak törpüleri daha kontrollü kesim sağlar. Tırnağın çok kısa kesilmesi kanamaya yol açabileceğinden, ilk denemelerde küçük miktarlarla ilerlemek ve gerekirse veteriner/pet kuaförden destek almak önerilir.

Bandana ve benzeri küçük aksesuarlarda boyun ölçüsüne uygun ayarlanabilir model seçmek, hem konfor hem de güvenlik açısından önemlidir; çok sıkı bağlanan aksesuarlar nefes almayı zorlaştırabilir.`,
  },
  'pet-medikal': {
    label: 'Pet Medikal & Güvenlik',
    labelEn: 'Pet Medical & Safety',
    description: 'E-collar, koruyucu koni, ameliyat sonrası tulum, bandaj ve güvenlik ürünleri. Evcil hayvanınızın iyileşme sürecini destekleyin.',
    guide: `E-collar (koruyucu koni), genellikle ameliyat sonrası dikişlerin yalanmasını/kaşınmasını önlemek, cilt tahrişi veya yara bölgesine erişimi engellemek amacıyla kullanılır. Doğru boyut seçimi için boyun çevresi ölçüsüne ek olarak, koninin burundan ucuna kadar olan mesafesinin evcil hayvanın burnunu hafifçe geçmesi gerekir; bu sayede hayvan yara bölgesine erişemez ama yeme-içme hareketini rahatça yapabilir.

Sert plastik koniler görüş açısını kısıtlasa da en güvenilir bariyeri sağlar; özellikle dikiş bölgesine ulaşma riski yüksek vakalarda tercih edilir. Yumuşak/şişme yaka veya kumaş koniler ise daha hafif ve konforlu olup, evcil hayvanın günlük hareketlerini daha az kısıtlar; ancak koruma seviyesi sert konilere göre daha düşüktür ve genelde hafif tahriş veya düşük riskli durumlarda tercih edilir.

Hareket desteği koşumu (destek harness), özellikle yaşlı, ameliyat sonrası iyileşme sürecinde olan veya arka/ön bacak zayıflığı yaşayan köpeklerde, sahibinin hayvanı kaldırırken veya merdiven inip çıkarken desteklemesine yardımcı olur. Seçim yaparken destek bölgesinin (ön gövde, arka gövde veya tüm vücut) ihtiyaca uygun olması ve kayışların cilde baskı yapmayacak genişlikte, yıkanabilir malzemeden olması önemlidir.

Bu bölümdeki tüm ürünler, bir veteriner hekim tarafından konulan tanı ve tedavi planının tamamlayıcısı olarak tasarlanmıştır; tıbbi tedavinin yerine geçmez. Kullanmadan önce ürünün mevcut duruma uygunluğu konusunda mutlaka veterinerinize danışmanız önerilir.`,
  },
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = CATEGORY_META[slug]
  if (!meta) return {}
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop.tr'
  const url  = `${base}/kategori/${slug}`
  return {
    title: `${meta.label} — Evcil Hayvan Aksesuarları`,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      type:        'website',
      url,
      title:       `${meta.label} | PatiShop`,
      description: meta.description,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug }   = await params
  const meta       = CATEGORY_META[slug]
  if (!meta) notFound()

  const allProducts = await getProducts()
  const products    = allProducts.filter(p => p.category === slug)
  const base        = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop.tr'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type':    'ItemList',
    name:       meta.label,
    url:        `${base}/kategori/${slug}`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type':   'ListItem',
      position:  i + 1,
      url:       `${base}/products/${p.id}`,
      name:      p.name,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: base },
      { '@type': 'ListItem', position: 2, name: 'Ürünler', item: `${base}/#products` },
      { '@type': 'ListItem', position: 3, name: meta.label, item: `${base}/kategori/${slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main className="px-6 lg:px-12 py-12 max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#7ecad6] mb-8">
          <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/#products" className="hover:text-white transition-colors">Ürünler</Link>
          <span>/</span>
          <span className="text-white">{meta.label}</span>
        </nav>

        {/* Başlık */}
        <div className="mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#06b6d4] mb-3">
            Kategori
          </span>
          <h1 className="text-4xl font-black mb-3">{meta.label}</h1>
          <p className="text-[#7ecad6] max-w-2xl leading-relaxed">{meta.description}</p>
        </div>

        {/* Nasıl seçilir rehberi */}
        <section className="mb-10 rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6 lg:p-8">
          <h2 className="text-lg font-bold text-white mb-4">{meta.label} Nasıl Seçilir?</h2>
          <div className="space-y-4 text-sm text-[#c4a896] leading-relaxed max-w-3xl">
            {meta.guide.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Diğer kategorilere linkler */}
        <div className="flex flex-wrap gap-2 mb-10">
          {Object.entries(CATEGORY_META).map(([s, m]) => (
            <Link
              key={s}
              href={`/kategori/${s}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition-all ${
                s === slug
                  ? 'border-[rgba(6,182,212,0.5)] bg-[rgba(6,182,212,0.15)] text-[#06b6d4]'
                  : 'border-white/10 bg-white/5 text-[#7ecad6] hover:border-[rgba(6,182,212,0.3)] hover:text-white'
              }`}
            >
              {m.label}
            </Link>
          ))}
        </div>

        {/* Ürün grid */}
        {products.length === 0 ? (
          <p className="text-center text-[#7ecad6] py-20">Bu kategoride henüz ürün yok.</p>
        ) : (
          <SortableProductGrid products={products} />
        )}
      </main>
      <Footer />
    </>
  )
}
