import type { Metadata } from 'next'
import './globals.css'
import { CartPanel } from '@/components/CartPanel'
import { ProductModal } from '@/components/ProductModal'
import { AuthProvider } from '@/components/AuthProvider'
import { getProducts } from '@/lib/db-products'

export const metadata: Metadata = {
  title: 'PatiShop — Kedi & Köpek Aksesuarları',
  description: 'Çin\'den ithal premium kedi ve köpek aksesuarları. 17 ülkeye hızlı teslimat.',
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
