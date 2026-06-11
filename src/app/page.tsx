import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Kedi & Köpek Aksesuarları — Ücretsiz Kargo',
  description: 'Akıllı mama kapları, otomatik kum temizleyiciler, tasmalar ve daha fazlası. 17 ülkeye hızlı teslimat, uygun fiyat garantisi.',
}

import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { FeaturedPanels } from '@/components/FeaturedPanels'
import { ProductsSection } from '@/components/ProductsSection'
import { ReviewsSection } from '@/components/ReviewsSection'
import { SuppliersSection } from '@/components/SuppliersSection'
import { AnalyticsSection } from '@/components/AnalyticsSection'
import { Footer } from '@/components/Footer'
import { getProducts } from '@/lib/db-products'

export default async function HomePage() {
  const products = await getProducts()
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedPanels />
        <ProductsSection products={products} />
        <ReviewsSection />
        <SuppliersSection />
        <AnalyticsSection />
      </main>
      <Footer />
    </>
  )
}
