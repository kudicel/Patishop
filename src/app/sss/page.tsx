import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Sık Sorulan Sorular | PatiShop',
  description: 'PatiShop güvenilir mi, teslimat süresi ne kadar, ürünler nereden geliyor? Merak edilen tüm sorular.',
}

const faqs = [
  {
    q: 'PatiShop güvenilir mi?',
    a: 'Evet. PatiShop, Kuvix Digital Solutions tarafından işletilen, PayTR altyapısıyla 256-bit SSL şifreli güvenli ödeme sunan bir e-ticaret platformudur. Tüm ürünler denetlenen tedarikçi fabrikalardan seçilir ve her siparişte 14 gün yasal cayma hakkı geçerlidir.',
  },
  {
    q: 'PatiShop ürünleri nereden geliyor?',
    a: 'Ürünler CJ Dropshipping altyapısı üzerinden Çin\'deki onaylı üretici/fabrikalardan doğrudan temin edilir — aracı veya trader kullanılmaz. Bu sayede aracısız fiyat avantajı sağlanır.',
  },
  {
    q: 'PatiShop kargo/teslimat süresi ne kadar?',
    a: 'Sipariş onayından itibaren standart teslimat 10–20 iş günü sürer (Çin\'den doğrudan sevkiyat nedeniyle). Standart kargo ücreti 499 TL olup 3.000 TL ve üzeri siparişlerde kargo ücretsizdir.',
  },
  {
    q: 'PatiShop\'ta hangi ürünler satılıyor?',
    a: 'Kedi ve köpekler için mama kabı, kum temizleyici, tasma, oyuncak, kıyafet, yatak, taşıma çantası ve pet medikal ürünler (e-collar, destek koşumu, pençe botu vb.) satılmaktadır. Gıda/mama ürünü satılmamaktadır, sadece aksesuar kategorileri mevcuttur.',
  },
  {
    q: 'PatiShop\'ta iade yapabilir miyim?',
    a: 'Evet. 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında, ürünü teslim aldığınız tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin cayma hakkınızı kullanabilirsiniz. Kargoya verilmemiş siparişler ise 24 saat içinde ücretsiz iptal edilebilir.',
  },
  {
    q: 'PatiShop hangi ülkelere teslimat yapıyor?',
    a: 'Türkiye dahil 17 ülkeye teslimat yapılmaktadır. Yurt içi teslimatlar kapıya teslim şeklinde gerçekleştirilir.',
  },
]

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

        <div className="space-y-6">
          {faqs.map((f) => (
            <section
              key={f.q}
              className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6"
            >
              <h2 className="text-base font-bold text-white mb-2">{f.q}</h2>
              <p className="text-sm text-[#c4a896] leading-relaxed">{f.a}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
