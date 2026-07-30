import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | PatiShop',
  description: 'PatiShop mesafeli satış sözleşmesi ve satış koşulları.',
}

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <>
      <Header />
      <main className="px-6 lg:px-12 py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2">Mesafeli Satış Sözleşmesi</h1>
        <p className="text-[#7ecad6] mb-10 text-sm">Son güncellenme: Haziran 2026</p>

        <div className="space-y-6 text-sm text-[#c4a896] leading-relaxed prose-headings:text-white">

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">MADDE 1 — SATICI BİLGİLERİ</h2>
            <div className="space-y-1">
              <p><span className="text-white font-semibold">Unvan:</span> Kuvix Digital Solutions</p>
              <p><span className="text-white font-semibold">Faaliyet türü:</span> Bireysel — Muaf</p>
              <p><span className="text-white font-semibold">Adres:</span> Celaliye Mah. Özay Sk. No: 4 İç Kapı No: 1, 34534 Büyükçekmece-İstanbul/Türkiye</p>
              <p><span className="text-white font-semibold">E-posta:</span>{' '}
                <a href="mailto:info@patishop.tr" className="text-[#06b6d4] hover:underline">info@patishop.tr</a>
              </p>
              <p><span className="text-white font-semibold">Web sitesi:</span>{' '}
                <a href="https://patishop.tr" className="text-[#06b6d4] hover:underline">patishop.tr</a>
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">MADDE 2 — ALICI BİLGİLERİ</h2>
            <p>
              Sipariş sırasında alıcı tarafından sağlanan ad, soyad, adres, e-posta ve telefon
              bilgileri bu sözleşmenin ayrılmaz parçasıdır.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">MADDE 3 — KONU VE KAPSAM</h2>
            <p>
              İşbu sözleşme, alıcının satıcıya ait internet sitesi üzerinden elektronik ortamda
              sipariş verdiği, sözleşmede belirtilen nitelikteki ürün/ürünlerin satışı ve teslimatı
              ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
              Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini
              düzenler.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">MADDE 4 — SÖZLEŞME KONUSU ÜRÜN</h2>
            <p>
              Sözleşme konusu ürün/ürünlerin temel özellikleri, fiyatı ve ödeme bilgileri
              sipariş özeti sayfasında ve onay e-postasında yer almaktadır.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">MADDE 5 — ÖDEME</h2>
            <p>
              Ödeme, sipariş esnasında kredi/banka kartı veya diğer sunulan ödeme yöntemleriyle
              yapılır. Alıcı, ödeme bilgilerinin doğruluğundan sorumludur.
              Tutar, sipariş onaylandıktan sonra alıcının kartından tahsil edilir.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">MADDE 6 — TESLİMAT</h2>
            <p>
              Ürün/ürünler, sipariş onayından itibaren en geç <strong className="text-white">20 iş günü</strong> içinde
              alıcının bildirdiği adrese teslim edilir. Stok durumu ve gümrük süreçlerine bağlı olarak
              bu süre uzayabilir; alıcı e-posta ile bilgilendirilir.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">MADDE 7 — CAYMA HAKKI</h2>
            <p>
              Alıcı, ürünü teslim aldığı tarihten itibaren <strong className="text-white">14 (on dört) gün</strong> içinde,
              herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına
              sahiptir. Cayma bildirimi{' '}
              <a href="mailto:info@patishop.tr" className="text-[#06b6d4] hover:underline">info@patishop.tr</a>
              {' '}adresine e-posta yoluyla iletilmelidir.
            </p>
            <p className="mt-2">
              Cayma hakkı; alıcının talebi üzerine üretilen veya açıkça kişisel ihtiyaçlara göre
              hazırlanan ürünler ile hijyen açısından iadesi mümkün olmayan (açılmış) ürünler için
              kullanılamaz.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">MADDE 8 — İADE VE GERİ ÖDEME</h2>
            <p>
              Cayma hakkının kullanılması durumunda alıcı ürünü iade eder.
              Satıcı, iade talebinin kendisine ulaşmasından itibaren <strong className="text-white">14 gün</strong> içinde
              ödemeyi iade eder. Geri ödeme, ödemenin yapıldığı yöntemle gerçekleştirilir.
              İade kargo ücreti alıcıya aittir; ürün hasarlı veya hatalı ise satıcı karşılar.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">MADDE 9 — GİZLİLİK</h2>
            <p>
              Alıcıya ait kişisel veriler, yalnızca sipariş ve teslimat süreçlerinde kullanılır;
              üçüncü taraflarla paylaşılmaz. Ayrıntılı bilgi için{' '}
              <a href="/gizlilik-politikasi" className="text-[#06b6d4] hover:underline">Gizlilik Politikamızı</a>{' '}
              inceleyebilirsiniz.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">MADDE 10 — UYUŞMAZLIK ÇÖZÜMÜ</h2>
            <p>
              İşbu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti mevzuatı uygulanır.
              Tüketici şikayetleri için T.C. Ticaret Bakanlığı tarafından belirlenen il/ilçe
              tüketici hakem heyetleri yetkilidir.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">MADDE 11 — YÜRÜRLÜK</h2>
            <p>
              Alıcının sipariş onaylamasıyla birlikte bu sözleşme taraflarca kabul edilmiş sayılır.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
