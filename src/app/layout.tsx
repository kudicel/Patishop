import type { Metadata } from 'next'
import './globals.css'
import { CartPanel } from '@/components/CartPanel'
import { ProductModal } from '@/components/ProductModal'
import { AuthProvider } from '@/components/AuthProvider'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { getProducts } from '@/lib/db-products'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop.tr'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PatiShop — Uygun Fiyatlı Kedi & Köpek Aksesuarları',
    template: '%s | PatiShop',
  },
  description: 'Kedi ve köpekler için özenle seçilmiş, uygun fiyatlı pet aksesuarları. Çin\'den doğrudan fabrikadan kedi köpek ürünleri — mama kabı, kum temizleyici, tasma ve daha fazlası, 17 ülkeye teslimat.',
  keywords: ['kedi aksesuarı', 'köpek aksesuarı', 'evcil hayvan', 'akıllı mama kabı', 'kum temizleyici', 'tasma', 'pet shop', 'uygun fiyatlı pet aksesuarları', "çin'den kedi köpek ürünleri"],
  openGraph: {
    type: 'website',
    siteName: 'PatiShop',
    title: 'PatiShop — Uygun Fiyatlı Kedi & Köpek Aksesuarları',
    description: 'Kedi ve köpekler için özenle seçilmiş, uygun fiyatlı pet aksesuarları. Çin\'den doğrudan fabrikadan, 17 ülkeye teslimat.',
    url: BASE_URL,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'PatiShop' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PatiShop — Uygun Fiyatlı Kedi & Köpek Aksesuarları',
    description: 'Kedi ve köpekler için özenle seçilmiş, uygun fiyatlı pet aksesuarları. Çin\'den doğrudan fabrikadan, 17 ülkeye teslimat.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PatiShop',
  url: BASE_URL,
  logo: `${BASE_URL}/og-image.jpg`,
  description: 'Kedi ve köpekler için özenle seçilmiş, uygun fiyatlı aksesuarlar. Çin\'deki üreticilerden doğrudan, aracısız olarak temin edilip müşteriye kapıya kadar teslim edilir.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Celaliye Mah. Özay Sk. No: 4 İç Kapı No: 1',
    postalCode: '34534',
    addressLocality: 'Büyükçekmece-İstanbul',
    addressCountry: 'TR',
  },
  email: 'info@patishop.tr',
  sameAs: [
    'https://linkedin.com/company/patishop',
    'https://x.com/Patishop_tr',
  ],
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'PatiShop',
  url: BASE_URL,
  image: `${BASE_URL}/og-image.jpg`,
  description: 'Kedi ve köpekler için özenle seçilmiş, uygun fiyatlı pet aksesuarları satan e-ticaret işletmesi.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Celaliye Mah. Özay Sk. No: 4 İç Kapı No: 1',
    postalCode: '34534',
    addressLocality: 'Büyükçekmece-İstanbul',
    addressCountry: 'TR',
  },
  email: 'info@patishop.tr',
  sameAs: [
    'https://linkedin.com/company/patishop',
    'https://x.com/Patishop_tr',
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const products = await getProducts()
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <AuthProvider>
          <GoogleAnalytics />
          {children}
          <CartPanel />
          <ProductModal products={products} />
        </AuthProvider>
      </body>
    </html>
  )
}
