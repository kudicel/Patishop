import type { Metadata } from 'next'
import './globals.css'
import { CartPanel } from '@/components/CartPanel'
import { ProductModal } from '@/components/ProductModal'
import { AuthProvider } from '@/components/AuthProvider'
import { getProducts } from '@/lib/db-products'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop-gamma.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'PatiShop — Premium Kedi & Köpek Aksesuarları',
    template: '%s | PatiShop',
  },
  description: 'Premium kedi ve köpek aksesuarları — akıllı mama kapları, otomatik kum temizleyiciler, tasmalar ve daha fazlası. 17 ülkeye hızlı teslimat.',
  keywords: ['kedi aksesuarı', 'köpek aksesuarı', 'evcil hayvan', 'akıllı mama kabı', 'kum temizleyici', 'tasma', 'pet shop'],
  openGraph: {
    type: 'website',
    siteName: 'PatiShop',
    title: 'PatiShop — Premium Kedi & Köpek Aksesuarları',
    description: 'Premium kedi ve köpek aksesuarları. 17 ülkeye hızlı teslimat.',
    url: BASE_URL,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'PatiShop' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PatiShop — Premium Kedi & Köpek Aksesuarları',
    description: 'Premium kedi ve köpek aksesuarları. 17 ülkeye hızlı teslimat.',
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const products = await getProducts()
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          {children}
          <CartPanel />
          <ProductModal products={products} />
        </AuthProvider>
      </body>
    </html>
  )
}
