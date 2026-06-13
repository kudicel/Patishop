import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Gizlilik Politikası | PatiShop',
  description: 'PatiShop KVKK kapsamında kişisel veri işleme politikası.',
}

export default function GizlilikPolitikasiPage() {
  return (
    <>
      <Header />
      <main className="px-6 lg:px-12 py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2">Gizlilik Politikası</h1>
        <p className="text-[#7ecad6] mb-10 text-sm">Son güncellenme: Haziran 2026 — KVKK (6698 sayılı Kişisel Verilerin Korunması Kanunu) kapsamında</p>

        <div className="space-y-6 text-sm text-[#c4a896] leading-relaxed">

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">1. Veri Sorumlusu</h2>
            <p>
              Bu politika, <strong className="text-white">Kuvix Digital Solutions</strong> (bundan böyle "PatiShop" olarak anılacaktır)
              tarafından hazırlanmıştır. İletişim:{' '}
              <a href="mailto:info@patishop.tr" className="text-[#06b6d4] hover:underline">info@patishop.tr</a>
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">2. Toplanan Kişisel Veriler</h2>
            <p>Hizmetlerimizi kullanırken aşağıdaki veriler toplanabilir:</p>
            <ul className="mt-2 space-y-1">
              <li>• <strong className="text-white">Kimlik bilgileri:</strong> Ad, soyad</li>
              <li>• <strong className="text-white">İletişim bilgileri:</strong> E-posta adresi, telefon numarası</li>
              <li>• <strong className="text-white">Teslimat bilgileri:</strong> Adres bilgileri</li>
              <li>• <strong className="text-white">İşlem bilgileri:</strong> Sipariş geçmişi, ödeme yöntemi (kart bilgileri PatiShop'ta saklanmaz)</li>
              <li>• <strong className="text-white">Teknik veriler:</strong> IP adresi, tarayıcı türü, ziyaret saati</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">3. Verilerin İşlenme Amacı</h2>
            <ul className="space-y-1">
              <li>• Sipariş ve teslimat işlemlerinin yürütülmesi</li>
              <li>• Müşteri destek hizmetlerinin sağlanması</li>
              <li>• Yasal yükümlülüklerin yerine getirilmesi</li>
              <li>• Onay verilmesi halinde tanıtım ve kampanya bildirimleri</li>
              <li>• Site güvenliğinin sağlanması ve iyileştirilmesi</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">4. Verilerin Paylaşılması</h2>
            <p>
              Kişisel verileriniz; sipariş teslimatını sağlamak amacıyla kargo firmaları,
              ödeme işlemlerini gerçekleştirmek amacıyla ödeme kuruluşları (PayTR) ve
              yasal zorunluluk halinde yetkili kamu kurumlarıyla paylaşılabilir.
              Reklam amaçlı üçüncü taraf paylaşımı yapılmaz.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">5. Çerezler (Cookies)</h2>

            <ul className="mt-2 space-y-1">
              <li>• <strong className="text-white">Oturum çerezleri:</strong> Giriş durumunuzu ve sepetinizi korumak için zorunludur.</li>
              <li>• <strong className="text-white">Google Analytics:</strong> Anonim ziyaretçi istatistikleri. Kişisel veri içermez; tarayıcı ayarlarından devre dışı bırakılabilir.</li>
              <li>• <strong className="text-white">localStorage:</strong> Sepet içeriği ve dil tercihi tarayıcınızda saklanır, sunucuya gönderilmez.</li>
            </ul>
            <p className="mt-3">
              Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz;
              ancak bu durumda bazı özellikler çalışmayabilir.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">6. Veri Saklama Süresi</h2>
            <p>
              Kişisel verileriniz, ilgili mevzuatta öngörülen süre boyunca veya işlenme amacı
              ortadan kalktığında silinir, yok edilir ya da anonim hale getirilir.
              Sipariş kayıtları yasal yükümlülükler gereği <strong className="text-white">10 yıl</strong> saklanır.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">7. Haklarınız (KVKK Madde 11)</h2>
            <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="mt-2 space-y-1">
              <li>• Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>• İşlenmişse buna ilişkin bilgi talep etme</li>
              <li>• Verilerin düzeltilmesini veya silinmesini isteme</li>
              <li>• İşlemenin kısıtlanmasını talep etme</li>
              <li>• Veri taşınabilirliği hakkı</li>
            </ul>
            <p className="mt-3">
              Haklarınızı kullanmak için:{' '}
              <a href="mailto:info@patishop.tr" className="text-[#06b6d4] hover:underline">
                info@patishop.tr
              </a>
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">8. Güvenlik</h2>
            <p>
              Verileriniz SSL/TLS şifrelemesiyle korunmakta, yetkisiz erişime karşı teknik
              ve idari önlemler alınmaktadır. Ödeme bilgileri PatiShop sunucularında
              saklanmaz; işlemler PayTR güvenli altyapısı üzerinden gerçekleştirilir.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">9. İletişim</h2>
            <p>
              Bu politikayla ilgili sorularınız için:{' '}
              <a href="mailto:info@patishop.tr" className="text-[#06b6d4] hover:underline">
                info@patishop.tr
              </a>
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
