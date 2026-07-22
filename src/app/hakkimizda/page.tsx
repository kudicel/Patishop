import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Hakkımızda | PatiShop',
  description: 'PatiShop\'un hikayesi ve kurucusu hakkında bilgi edinin.',
}

export default function HakkimizdaPage() {
  return (
    <>
      <Header />
      <main className="px-6 lg:px-12 py-16 max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-2">Hakkımızda</h1>
        <p className="text-[#7ecad6] mb-10">
          PatiShop, evcil hayvan sahiplerinin kaliteli ve uygun fiyatlı aksesuara güvenilir şekilde ulaşmasını kolaylaştırmak için kuruldu.
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-[#c4a896]">
          <p>
            PatiShop, ~20 yıla yakın çağrı merkezi yöneticiliği, Almanca dilinde satış eğitimleri, koçluk ve liderlik
            deneyimine sahip <strong className="text-white">Kutret Çelik</strong> tarafından kuruldu.
          </p>
          <p>
            Yıllarca müşteri hizmetleri ve iletişim tarafında binlerce etkileşimi yönetip insanların ihtiyaç duydukları
            ürüne güvenilir ve sorunsuz bir şekilde ulaşmasının ne kadar değerli olduğunu yakından gördükten sonra, bu
            deneyimi evcil hayvan sahipleri için de hayata geçirmek istedik: kedi ve köpekler için kaliteli aksesuarları,
            karmaşık aracılara ya da şişirilmiş fiyatlara takılmadan, doğrudan ve güvenilir şekilde sunmak.
          </p>
          <p>
            Bu yüzden PatiShop&apos;taki ürünlerin tamamı CJ Dropshipping altyapısı üzerinden, aracı/trader firmalar
            değil doğrudan üretici fabrikalar baz alınarak özenle seçiliyor. Amacımız, dost canlısının ihtiyacı olan
            ürüne makul bir fiyatla, güvenle ulaşmasını sağlamak.
          </p>
          <p>
            <strong className="text-white">Kuvix Digital Solutions</strong> çatısı altında, PatiShop&apos;un yanı sıra{' '}
            <strong className="text-white">Kudi.ai</strong> (AI müzik stüdyosu) ve{' '}
            <strong className="text-white">VisioAI</strong> (B2B AI görünürlük platformu) markalarını da yönetiyoruz.
          </p>
        </div>

        {/* Güven rozetleri */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-4 text-center">
            <p className="text-sm font-semibold text-white">256-bit SSL</p>
            <p className="mt-1 text-xs text-[#7ecad6]">Şifreli bağlantı</p>
          </div>
          <div className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-4 text-center">
            <p className="text-sm font-semibold text-white">PayTR Güvenli Ödeme</p>
            <p className="mt-1 text-xs text-[#7ecad6]">3D Secure altyapı</p>
          </div>
          <div className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-4 text-center">
            <p className="text-sm font-semibold text-white">14 Gün İade Garantisi</p>
            <p className="mt-1 text-xs text-[#7ecad6]">KVKK uyumlu, verileriniz güvende</p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-6 text-center">
          <p className="text-sm text-[#7ecad6]">Sorularınız mı var?</p>
          <Link
            href="/iletisim"
            className="mt-2 inline-block text-sm font-medium text-[#06b6d4] hover:text-white transition-colors"
          >
            Bizimle iletişime geçin →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
