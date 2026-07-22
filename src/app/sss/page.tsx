import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Sık Sorulan Sorular | PatiShop',
  description: 'PatiShop güvenilir mi, teslimat süresi ne kadar, ürünler nereden geliyor? Merak edilen tüm sorular.',
}

const faqs = [
  {
    group: 'Genel Sorular',
    q: 'PatiShop güvenilir mi?',
    a: 'Evet. PatiShop, Kuvix Digital Solutions tarafından işletilen, PayTR altyapısıyla 256-bit SSL şifreli güvenli ödeme sunan bir e-ticaret platformudur. Tüm ürünler denetlenen tedarikçi fabrikalardan seçilir ve her siparişte 14 gün yasal cayma hakkı geçerlidir.',
  },
  {
    group: 'Genel Sorular',
    q: 'PatiShop ürünleri nereden geliyor?',
    a: 'Ürünler CJ Dropshipping altyapısı üzerinden Çin\'deki onaylı üretici/fabrikalardan doğrudan temin edilir — aracı veya trader kullanılmaz. Bu sayede aracısız fiyat avantajı sağlanır.',
  },
  {
    group: 'Genel Sorular',
    q: 'PatiShop kargo/teslimat süresi ne kadar?',
    a: 'Sipariş onayından itibaren standart teslimat 10–20 iş günü sürer (Çin\'den doğrudan sevkiyat nedeniyle). Kargo ücreti her zaman ürün fiyatına dahildir, ek ücret alınmaz. 3.000 TL ve üzeri siparişlerde sipariş tutarının %10\'u kadar gümrük tahmini eklenir.',
  },
  {
    group: 'Genel Sorular',
    q: 'PatiShop\'ta hangi ürünler satılıyor?',
    a: 'Kedi ve köpekler için mama kabı, kum temizleyici, tasma, oyuncak, kıyafet, yatak, taşıma çantası ve pet medikal ürünler (e-collar, destek koşumu, pençe botu vb.) satılmaktadır. Gıda/mama ürünü satılmamaktadır, sadece aksesuar kategorileri mevcuttur.',
  },
  {
    group: 'Genel Sorular',
    q: 'PatiShop\'ta iade yapabilir miyim?',
    a: 'Evet. 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında, ürünü teslim aldığınız tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin cayma hakkınızı kullanabilirsiniz. Kargoya verilmemiş siparişler ise 24 saat içinde ücretsiz iptal edilebilir.',
  },
  {
    group: 'Genel Sorular',
    q: 'PatiShop hangi ülkelere teslimat yapıyor?',
    a: 'Türkiye dahil 17 ülkeye teslimat yapılmaktadır. Yurt içi teslimatlar kapıya teslim şeklinde gerçekleştirilir.',
  },
  {
    group: 'Ürün Seçimi Soruları',
    q: 'Köpek tasmasında doğru beden nasıl seçilir?',
    a: 'Tasma takıldığında boyun (veya göğüs tasmasında gövde) ile tasma arasına iki parmağınız rahatça girebilmelidir. Çok gevşek bir tasma köpeğin sıyrılıp kaçmasına, çok sıkı bir tasma ise rahatsızlık ve cilt tahrişine yol açabilir. Ayarlanabilir tokalı modeller büyüme çağındaki yavru köpekler için daha esnek bir seçenektir.',
  },
  {
    group: 'Ürün Seçimi Soruları',
    q: 'Otomatik kedi kumu temizleyici hangi kum türleriyle uyumlu?',
    a: 'Otomatik kum temizleyicilerin büyük çoğunluğu topaklaşan (kümeleşen) kum ile tasarlanmıştır; tarama mekanizması bu kum türünde en verimli şekilde çalışır. Kristal veya biyobozunur kumlarda uyumluluk modelden modele değişebileceğinden, satın almadan önce ürün açıklamasındaki üretici tavsiyesini kontrol etmeniz önerilir.',
  },
  {
    group: 'Ürün Seçimi Soruları',
    q: 'Akıllı/otomatik mama kabı nasıl çalışır?',
    a: 'Akıllı mama kapları, mobil uygulama veya cihaz üzerindeki panel aracılığıyla besleme saatini ve porsiyon miktarını önceden programlamanıza olanak tanır. Belirlenen saatte haznede depolanan mama otomatik olarak kaba dağıtılır. Elektrik kesintisine karşı pil yedeği bulunan modeller, seyahat veya mesai saatlerinde besleme aksamalarını önler.',
  },
  {
    group: 'Pet Medikal Sorular',
    q: 'E-collar (koruyucu koni) hangi durumlarda gereklidir?',
    a: 'E-collar genellikle ameliyat sonrası dikişlerin yalanmasını/kaşınmasını önlemek, cilt tahrişi olan bölgeye erişimi engellemek veya yara bölgesinin iyileşme sürecini korumak amacıyla kullanılır. Kullanım gerekliliği ve süresi konusunda kesin karar veterinerinize aittir; bu ürün tıbbi tedavinin yerine geçmez.',
  },
  {
    group: 'Pet Medikal Sorular',
    q: 'Hareket desteği koşumu (destek harness) nasıl seçilir?',
    a: 'Seçimde öncelikle desteğe ihtiyaç duyulan bölge (ön gövde, arka gövde veya tüm vücut) belirlenmelidir. Yaşlı, ameliyat sonrası iyileşme sürecinde olan veya eklem zayıflığı yaşayan köpeklerde sahibinin hayvanı kaldırırken veya merdiven kullanırken desteklemesine yardımcı olur. Kayışların cilde baskı yapmayacak genişlikte ve yıkanabilir malzemeden olması önerilir; kullanım öncesi veterinerinize danışmanız faydalı olacaktır.',
  },
  {
    group: 'Pet Medikal Sorular',
    q: 'Ameliyat sonrası tulum veya bandaj ne işe yarar?',
    a: 'Ameliyat sonrası tulumlar, dikiş bölgesini dış etkenlerden ve yalamadan koruyarak e-collar\'a alternatif veya ek bir önlem olarak kullanılabilir. Bandajlar ise yara bakımında hijyeni desteklemek amacıyla tercih edilir. Her iki üründe de doğru kullanım süresi ve sıklığı için veterinerinizin talimatlarını takip etmeniz önemlidir.',
  },
]

const faqGroups = Array.from(new Set(faqs.map(f => f.group)))

export default function SSSPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="px-6 lg:px-12 py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2">Sık Sorulan Sorular</h1>
        <p className="text-[#7ecad6] mb-10 text-sm">PatiShop hakkında merak edilenler.</p>

        {faqGroups.map((group) => (
          <div key={group} className="mb-10 last:mb-0">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#06b6d4] mb-4">{group}</h2>
            <div className="space-y-6">
              {faqs.filter(f => f.group === group).map((f) => (
                <section
                  key={f.q}
                  className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6"
                >
                  <h3 className="text-base font-bold text-white mb-2">{f.q}</h3>
                  <p className="text-sm text-[#c4a896] leading-relaxed">{f.a}</p>
                </section>
              ))}
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </>
  )
}
