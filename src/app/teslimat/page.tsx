import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Teslimat ve Kargo | PatiShop',
  description: 'PatiShop teslimat koşulları, kargo süreleri ve ücretleri.',
}

export default function TeslimatPage() {
  return (
    <>
      <Header />
      <main className="px-6 lg:px-12 py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2">Teslimat ve Kargo Koşulları</h1>
        <p className="text-[#7ecad6] mb-10 text-sm">Son güncellenme: Haziran 2026</p>

        <div className="space-y-6 text-sm text-[#c4a896] leading-relaxed">

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">Teslimat Süresi</h2>
            <p>
              PatiShop'ta satılan ürünler Çin'deki onaylı tedarikçi fabrikalarından temin edilmektedir.
              Sipariş onayından itibaren <strong className="text-white">10–20 iş günü</strong> içinde
              teslimat gerçekleştirilmektedir. Gümrük süreçleri nedeniyle bu süre uzayabilir.
            </p>
            <p className="mt-2">
              Siparişiniz kargoya verildiğinde e-posta ile bilgilendirilirsiniz.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">Kargo ve Gümrük</h2>
            <ul className="space-y-2">
              <li>• Kargo ücreti her zaman <span className="text-[#06b6d4] font-bold">ürün fiyatına dahildir</span>, ek ücret alınmaz</li>
              <li>• <strong className="text-white">3.000 ₺</strong> ve üzeri siparişlerde sipariş tutarının <strong className="text-white">%10&#39;u</strong> kadar gümrük tahmini eklenir</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">Teslimat Bölgeleri</h2>
            <p>
              Türkiye dahil <strong className="text-white">17 ülkeye</strong> teslimat yapılmaktadır.
              Yurt içi teslimatlar kapıya teslim şeklinde gerçekleştirilir.
              Yurt dışı teslimatlar için gümrük beyannamesinde belirtilen değer esas alınır.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">Kargo Takibi</h2>
            <p>
              Siparişiniz kargoya verildikten sonra takip numaranız e-posta ile iletilir.
              Hesabınıza giriş yaparak <strong className="text-white">Siparişlerim</strong> sayfasından
              anlık kargo durumunu takip edebilirsiniz.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">Hasar ve Kayıp</h2>
            <p>
              Kargo sürecinde oluşan hasar veya kayıp durumunda lütfen ürünü teslim almadan önce
              kargo görevlisinin huzurunda tutanağa bağlayın ve bizimle iletişime geçin.
              Hasar gören ürünler için ücretsiz yeniden gönderim sağlanır.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">İletişim</h2>
            <p>
              Kargo ve teslimat sorularınız için:{' '}
              <a href="mailto:destek@patishop.com.tr" className="text-[#06b6d4] hover:underline">
                destek@patishop.com.tr
              </a>
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
