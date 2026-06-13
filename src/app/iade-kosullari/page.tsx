import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'İade ve İptal Koşulları | PatiShop',
  description: 'PatiShop iptal, iade ve geri ödeme koşulları.',
}

export default function IadeKosullariPage() {
  return (
    <>
      <Header />
      <main className="px-6 lg:px-12 py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2">İptal, İade ve Geri Ödeme Koşulları</h1>
        <p className="text-[#7ecad6] mb-10 text-sm">Son güncellenme: Haziran 2026</p>

        <div className="space-y-6 text-sm text-[#c4a896] leading-relaxed">

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">Sipariş İptali</h2>
            <p>
              Siparişiniz henüz kargoya verilmemişse, sipariş tarihinden itibaren
              <strong className="text-white"> 24 saat</strong> içinde iptal talebinde bulunabilirsiniz.
              İptal talebi için{' '}
              <a href="mailto:info@patishop.tr" className="text-[#06b6d4] hover:underline">info@patishop.tr</a>
              {' '}adresine sipariş numaranızı belirterek e-posta gönderiniz.
            </p>
            <p className="mt-2">
              Kargoya verilmiş siparişler iade sürecine tabi tutulur.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">Cayma Hakkı</h2>
            <p>
              6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında, ürünü teslim aldığınız
              tarihten itibaren <strong className="text-white">14 (on dört) gün</strong> içinde
              herhangi bir gerekçe göstermeksizin cayma hakkınızı kullanabilirsiniz.
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">İade Süreci</h2>
            <ol className="space-y-2 list-decimal list-inside">
              <li>
                <a href="mailto:info@patishop.tr" className="text-[#06b6d4] hover:underline">info@patishop.tr</a>
                {' '}adresine sipariş numaranızı ve iade nedeninizi belirterek e-posta gönderin.
              </li>
              <li>Tarafımızdan iade onayı ve talimatları e-posta ile iletilir (1–2 iş günü).</li>
              <li>Ürünü orijinal ambalajında, kullanılmamış ve hasarsız şekilde gönderin.</li>
              <li>
                Ürün tarafımıza ulaştıktan sonra <strong className="text-white">14 gün</strong> içinde
                ödemeniz iade edilir.
              </li>
            </ol>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">İade Kargo Ücreti</h2>
            <ul className="space-y-2">
              <li>• <strong className="text-white">Standart iade:</strong> Kargo ücreti alıcıya aittir.</li>
              <li>• <strong className="text-white">Hatalı veya hasarlı ürün:</strong> Kargo ücreti PatiShop tarafından karşılanır.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">Geri Ödeme</h2>
            <p>
              Onaylanan iadeler için geri ödeme, <strong className="text-white">ödemenin yapıldığı yöntemle</strong> gerçekleştirilir.
              Kredi kartı iadelerinde süre bankaya göre değişebilir (3–10 iş günü).
            </p>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">İade Edilemeyen Ürünler</h2>
            <p>Aşağıdaki durumlarda iade kabul edilmez:</p>
            <ul className="mt-2 space-y-1">
              <li>• Kullanılmış, yıpranmış veya orijinal ambalajı açılmış ürünler</li>
              <li>• Kişiye özel üretilmiş veya özelleştirilmiş ürünler</li>
              <li>• Hijyen nedeniyle iadesi mümkün olmayan ürünler (iç giyim, kum kabı vb.)</li>
              <li>• 14 günlük cayma süresi geçmiş ürünler</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-base font-bold text-white mb-3">İletişim</h2>
            <p>
              İade ve iptalle ilgili sorularınız için:{' '}
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
