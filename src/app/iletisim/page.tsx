import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'İletişim | PatiShop',
  description: 'PatiShop ile iletişime geçin.',
}

export default function IletisimPage() {
  return (
    <>
      <Header />
      <main className="px-6 lg:px-12 py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2">İletişim</h1>
        <p className="text-[#7ecad6] mb-10">Sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz.</p>

        <div className="grid gap-6">
          <div className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-lg font-bold mb-4">Firma Bilgileri</h2>
            <div className="space-y-2 text-sm text-[#c4a896]">
              <p><span className="text-white font-semibold">Ünvan:</span> Kuvix Digital Solutions</p>
              <p><span className="text-white font-semibold">Vergi Kimlik No / TC Kimlik No:</span> Bireysel — Muaf</p>
              <p><span className="text-white font-semibold">Adres:</span> Vatan Caddesi, Özay Sokak No 4, 34534 Büyükçekmece-İstanbul/Türkiye</p>
              <p><span className="text-white font-semibold">E-posta:</span>{' '}
                <a href="mailto:info@patishop.tr" className="text-[#06b6d4] hover:underline">
                  info@patishop.tr
                </a>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6">
            <h2 className="text-lg font-bold mb-4">Müşteri Desteği</h2>
            <div className="space-y-3 text-sm text-[#c4a896]">
              <p>Sipariş, kargo ve iade konularında destek almak için e-posta gönderebilirsiniz.</p>
              <p>
                <span className="text-white font-semibold">E-posta:</span>{' '}
                <a href="mailto:info@patishop.tr" className="text-[#06b6d4] hover:underline">
                  info@patishop.tr
                </a>
              </p>
              <p><span className="text-white font-semibold">Yanıt süresi:</span> 1–2 iş günü</p>
              <p><span className="text-white font-semibold">Çalışma saatleri:</span> Pazartesi–Cuma, 09:00–18:00</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(255,154,60,0.12)] bg-[rgba(255,154,60,0.04)] p-6">
            <h2 className="text-lg font-bold mb-3">Bize Yazın</h2>
            <p className="text-sm text-[#c4a896] mb-4">
              Ürünler, siparişler veya işbirliği hakkında her türlü sorunuzu iletebilirsiniz.
            </p>
            <a
              href="mailto:info@patishop.tr"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#06b6d4] to-[#6366f1] px-6 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
            >
              E-posta Gönder
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
